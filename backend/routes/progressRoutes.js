
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// =========================================================
// SAVE A QUIZ ATTEMPT
// =========================================================

router.post("/attempts", (req, res) => {
    const {
        student_id,
        semester,
        subject_name,
        topic_name,
        score,
        total_questions,
        correct_answers,
        time_spent_seconds
    } = req.body;

    if (
        !Number.isInteger(Number(student_id)) ||
        Number(student_id) <= 0 ||
        !subject_name ||
        !topic_name ||
        score === undefined ||
        !Number.isFinite(Number(score)) ||
        !Number.isInteger(Number(total_questions)) ||
        !Number.isInteger(Number(correct_answers)) ||
        Number(total_questions) <= 0 ||
        Number(correct_answers) < 0 ||
        Number(correct_answers) > Number(total_questions) ||
        Number(score) < 0 ||
        Number(score) > 100
    ) {
        return res.status(400).json({
            message: "Invalid or missing quiz attempt details."
        });
    }

    const sql = `
        INSERT INTO quiz_attempts
        (
            student_id,
            semester,
            subject_name,
            topic_name,
            score,
            total_questions,
            correct_answers,
            time_spent_seconds
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            Number(student_id),
            semester || null,
            subject_name,
            topic_name,
            Number(score),
            Number(total_questions),
            Number(correct_answers),
            time_spent_seconds == null
                ? null
                : Number(time_spent_seconds)
        ],
        (err, result) => {
            if (err) {
                console.error("Error saving quiz attempt:", err);

                return res.status(500).json({
                    message: "Could not save quiz attempt."
                });
            }

            return res.status(201).json({
                message: "Quiz attempt saved successfully.",
                attempt_id: result.insertId
            });
        }
    );
});

// =========================================================
// RETRIEVE QUIZ HISTORY FOR A STUDENT
// =========================================================

router.get("/attempts/:studentId", (req, res) => {
    const studentId = Number(req.params.studentId);

    if (!Number.isInteger(studentId) || studentId <= 0) {
        return res.status(400).json({
            message: "Invalid student ID."
        });
    }

    const sql = `
        SELECT
            id,
            semester,
            subject_name,
            topic_name,
            score,
            total_questions,
            correct_answers,
            time_spent_seconds,
            attempted_at
        FROM quiz_attempts
        WHERE student_id = ?
        ORDER BY attempted_at ASC, id ASC
    `;

    db.query(sql, [studentId], (err, results) => {
        if (err) {
            console.error("Error retrieving quiz history:", err);

            return res.status(500).json({
                message: "Could not retrieve quiz history."
            });
        }

        return res.json(results);
    });
});

// =========================================================
// SAVE VIDEO WATCH PROGRESS
// =========================================================

router.post("/videos", (req, res) => {
    const {
        student_id,
        subject_name,
        topic_name,
        video_id,
        video_title,
        video_url,
        completed,
        watched_seconds,
        duration_seconds
    } = req.body;

    const studentId = Number(student_id);
    const watchedSeconds = Number(watched_seconds ?? 0);
    const durationSeconds = Number(duration_seconds ?? 0);

    if (
        !Number.isInteger(studentId) ||
        studentId <= 0 ||
        typeof subject_name !== "string" ||
        !subject_name.trim() ||
        typeof topic_name !== "string" ||
        !topic_name.trim() ||
        video_id == null ||
        String(video_id).trim() === ""
    ) {
        return res.status(400).json({
            message: "Invalid or missing video progress details."
        });
    }

    if (
        !Number.isSafeInteger(watchedSeconds) ||
        !Number.isSafeInteger(durationSeconds) ||
        watchedSeconds < 0 ||
        durationSeconds < 0 ||
        watchedSeconds > 4294967295 ||
        durationSeconds > 4294967295
    ) {
        return res.status(400).json({
            message: "Invalid video watch-time details."
        });
    }

    const isCompleted = completed === true;

    const watchPercentage =
        durationSeconds > 0
            ? Math.min(
                100,
                Number(
                    (
                        (watchedSeconds / durationSeconds) *
                        100
                    ).toFixed(2)
                )
            )
            : 0;

    const sql = `
        INSERT INTO video_progress
        (
            student_id,
            subject_name,
            topic_name,
            video_id,
            video_title,
            video_url,
            completed,
            completed_at,
            watched_seconds,
            duration_seconds,
            watch_percentage
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            video_title = VALUES(video_title),
            video_url = VALUES(video_url),

            completed = GREATEST(
                completed,
                VALUES(completed)
            ),

            completed_at = CASE
                WHEN GREATEST(
                    completed,
                    VALUES(completed)
                ) = 1
                THEN COALESCE(
                    completed_at,
                    VALUES(completed_at)
                )
                ELSE NULL
            END,

            watched_seconds = GREATEST(
                watched_seconds,
                VALUES(watched_seconds)
            ),

            duration_seconds = GREATEST(
                duration_seconds,
                VALUES(duration_seconds)
            ),

            watch_percentage = CASE
                WHEN GREATEST(
                    duration_seconds,
                    VALUES(duration_seconds)
                ) > 0
                THEN LEAST(
                    100,
                    ROUND(
                        GREATEST(
                            watched_seconds,
                            VALUES(watched_seconds)
                        ) /
                        GREATEST(
                            duration_seconds,
                            VALUES(duration_seconds)
                        ) * 100,
                        2
                    )
                )
                ELSE 0
            END
    `;

    db.query(
        sql,
        [
            studentId,
            subject_name.trim(),
            topic_name.trim(),
            String(video_id),
            video_title || null,
            video_url || null,
            isCompleted ? 1 : 0,
            isCompleted ? new Date() : null,
            watchedSeconds,
            durationSeconds,
            watchPercentage
        ],
        (err) => {
            if (err) {
                console.error("Error saving video progress:", err);

                return res.status(500).json({
                    message: "Could not save video progress."
                });
            }

            return res.status(200).json({
                message: "Video progress saved successfully.",
                watched_seconds: watchedSeconds,
                duration_seconds: durationSeconds,
                watch_percentage: watchPercentage,
                completed: isCompleted
            });
        }
    );
});

// =========================================================
// RETRIEVE VIDEO PROGRESS FOR A STUDENT
// =========================================================

router.get("/videos/:studentId", (req, res) => {
    const studentId = Number(req.params.studentId);

    if (!Number.isInteger(studentId) || studentId <= 0) {
        return res.status(400).json({
            message: "Invalid student ID."
        });
    }

    const sql = `
        SELECT
            id,
            student_id,
            subject_name,
            topic_name,
            video_id,
            video_title,
            video_url,
            completed,
            completed_at,
            watched_seconds,
            duration_seconds,
            watch_percentage,
            updated_at
        FROM video_progress
        WHERE student_id = ?
        ORDER BY updated_at DESC, id DESC
    `;

    db.query(sql, [studentId], (err, results) => {
        if (err) {
            console.error("Error retrieving video progress:", err);

            return res.status(500).json({
                message: "Could not retrieve video progress."
            });
        }

        return res.json(results);
    });
});

module.exports = router;
