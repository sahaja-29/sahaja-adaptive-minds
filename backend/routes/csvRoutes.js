
const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const db = require("../config/db");

const router = express.Router();

const DATASET_DIR = path.join(__dirname, "../../dataset");

const SUBJECT_FOLDERS = {
    "Data Structures": "dsa",
    "Operating Systems": "operating_system",
    "Database Management Systems": "DBMS",
    "Computer Networks": "computer_networks",
    "Software Engineering": "software_engineering",
    "Analysis & Design of Algorithms": "ada",
    "Analysis and Design of Algorithms": "ada",
    "OOP with Java": "oop_with_java",
    "Digital Design and Computer Organization": "ddco",
    "DDCO": "ddco",
    "Microcontrollers": "microcontrollers",
    "Biology for Computer Engineers": "biology_for_computer_engineers"
};

function normalize(value) {
    return String(value ?? "")
        .replace(/^\uFEFF/, "")
        .trim()
        .replace(/&/g, " and ")
        .replace(/[•·]/g, " ")
        .replace(/\s+/g, " ")
        .toLowerCase();
}

function normalizeSubject(value) {
    const name = normalize(value);

    const aliases = {
        "dsa": "data structures",
        "data structure": "data structures",
        "dbms": "database management systems",
        "database management system": "database management systems",
        "operating system": "operating systems",
        "os": "operating systems",
        "ada": "analysis and design of algorithms",
        "analysis design of algorithms": "analysis and design of algorithms",
        "oop": "oop with java",
        "object oriented programming": "oop with java",
        "digital design and computer organization": "digital design and computer organization",
        "ddco": "digital design and computer organization"
    };

    return aliases[name] || name;
}

function normalizeTopic(value) {
    return normalize(value)
        .replace(/[–—-]/g, " ")
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function getSubjectFolder(subjectName) {
    const exactFolder = SUBJECT_FOLDERS[subjectName];

    if (exactFolder) {
        return exactFolder;
    }

    const normalized = normalizeSubject(subjectName);

    const folders = {
        "data structures": "dsa",
        "operating systems": "operating_system",
        "database management systems": "DBMS",
        "computer networks": "computer_networks",
        "software engineering": "software_engineering",
        "analysis and design of algorithms": "ada",
        "oop with java": "oop_with_java",
        "digital design and computer organization": "ddco",
        "microcontrollers": "microcontrollers",
        "biology for computer engineers": "biology_for_computer_engineers"
    };

    return folders[normalized] || null;
}

function readQuestions(filePath) {
    return new Promise((resolve, reject) => {
        const questions = [];

        fs.createReadStream(filePath, {
            encoding: "utf8"
        })
            .pipe(csv())
            .on("data", (row) => {
                const cleaned = {};

                for (const [key, value] of Object.entries(row)) {
                    const cleanKey = String(key)
                        .replace(/^\uFEFF/, "")
                        .trim();

                    cleaned[cleanKey] =
                        typeof value === "string"
                            ? value.trim()
                            : value;
                }

                if (
                    cleaned.Subject &&
                    cleaned.Topic &&
                    cleaned.Difficulty &&
                    cleaned.Question &&
                    cleaned.Option1 &&
                    cleaned.Option2 &&
                    cleaned.Option3 &&
                    cleaned.Option4 &&
                    cleaned.CorrectAnswer
                ) {
                    questions.push(cleaned);
                }
            })
            .on("end", () => resolve(questions))
            .on("error", reject);
    });
}

function getCsvFiles(folderPath) {
    return fs.readdirSync(folderPath)
        .filter((file) => file.toLowerCase().endsWith(".csv"))
        .filter((file) => {
            const fullPath = path.join(folderPath, file);

            return fs.statSync(fullPath).isFile();
        });
}

// Diagnostic endpoint: lists the CSV files detected for a subject.
// Example: GET /csvfiles?subject=2
router.get("/csvfiles", (req, res) => {
    const { subject } = req.query;

    if (!subject) {
        return res.status(400).json({
            message: "subject is required"
        });
    }

    db.query(
        "SELECT name FROM subjects WHERE id = ?",
        [subject],
        (error, results) => {
            if (error) {
                console.error("Subject lookup error:", error);

                return res.status(500).json({
                    message: "Unable to look up subject"
                });
            }

            if (!results.length) {
                return res.status(404).json({
                    message: "Subject not found"
                });
            }

            const subjectName = results[0].name;
            const folder = getSubjectFolder(subjectName);

            if (!folder) {
                return res.status(404).json({
                    message: `No dataset folder configured for subject: ${subjectName}`
                });
            }

            const folderPath = path.join(DATASET_DIR, folder);

            if (!fs.existsSync(folderPath)) {
                return res.status(404).json({
                    message: `Dataset folder not found: ${folder}`
                });
            }

            const files = getCsvFiles(folderPath).map((file) => ({
                file,
                empty: fs.statSync(path.join(folderPath, file)).size === 0
            }));

            return res.json({
                subject: subjectName,
                folder,
                totalCsvFiles: files.length,
                files
            });
        }
    );
});

router.get("/csvquestions", async (req, res) => {
    const { subject, topic, difficulty } = req.query;

    if (!subject || !topic || !difficulty) {
        return res.status(400).json({
            message: "subject, topic, and difficulty are required"
        });
    }

    db.query(
        "SELECT name FROM subjects WHERE id = ?",
        [subject],
        async (subjectError, subjectResult) => {
            if (subjectError) {
                console.error("Subject lookup error:", subjectError);

                return res.status(500).json({
                    message: "Unable to look up subject"
                });
            }

            if (!subjectResult.length) {
                return res.json([]);
            }

            const subjectName = subjectResult[0].name;
            const folder = getSubjectFolder(subjectName);

            if (!folder) {
                return res.status(404).json({
                    message: `No dataset folder configured for subject: ${subjectName}`
                });
            }

            const folderPath = path.join(DATASET_DIR, folder);

            if (!fs.existsSync(folderPath)) {
                return res.status(404).json({
                    message: `Dataset folder not found: ${folder}`
                });
            }

            db.query(
                "SELECT topic_name FROM topics WHERE id = ? AND subject_id = ?",
                [topic, subject],
                async (topicError, topicResult) => {
                    if (topicError) {
                        console.error("Topic lookup error:", topicError);

                        return res.status(500).json({
                            message: "Unable to look up topic"
                        });
                    }

                    if (!topicResult.length) {
                        return res.json([]);
                    }

                    const topicName = topicResult[0].topic_name;

                    try {
                        const files = getCsvFiles(folderPath);

                        let matchingQuestions = [];
                        let unreadableFiles = 0;
                        let emptyFiles = 0;

                        for (const file of files) {
                            const filePath = path.join(folderPath, file);

                            if (fs.statSync(filePath).size === 0) {
                                emptyFiles++;
                                console.warn("Skipping empty CSV:", filePath);
                                continue;
                            }

                            let questions;

                            try {
                                questions = await readQuestions(filePath);
                            } catch (error) {
                                unreadableFiles++;

                                console.warn(
                                    "Skipping unreadable CSV:",
                                    filePath,
                                    error.message
                                );

                                continue;
                            }

                            const matches = questions.filter((question) => {
                                return (
                                    normalizeSubject(question.Subject) ===
                                        normalizeSubject(subjectName) &&
                                    normalizeTopic(question.Topic) ===
                                        normalizeTopic(topicName) &&
                                    normalize(question.Difficulty) ===
                                        normalize(difficulty)
                                );
                            });

                            matchingQuestions.push(...matches);
                        }

                        console.log({
                            subject: subjectName,
                            folder,
                            topic: topicName,
                            difficulty,
                            csvFilesFound: files.length,
                            emptyFiles,
                            unreadableFiles,
                            matchingQuestions: matchingQuestions.length
                        });

                        for (
                            let i = matchingQuestions.length - 1;
                            i > 0;
                            i--
                        ) {
                            const j = Math.floor(
                                Math.random() * (i + 1)
                            );

                            [
                                matchingQuestions[i],
                                matchingQuestions[j]
                            ] = [
                                matchingQuestions[j],
                                matchingQuestions[i]
                            ];
                        }

                        return res.json(matchingQuestions.slice(0, 5));
                    } catch (error) {
                        console.error("CSV loading error:", error);

                        return res.status(500).json({
                            message: "Error loading dataset questions"
                        });
                    }
                }
            );
        }
    );
});

module.exports = router;
