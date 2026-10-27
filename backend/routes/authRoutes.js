
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../config/db");

// Register a new student
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email, and password are required."
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        `;

        db.query(
            sql,
            [name.trim(), email.trim().toLowerCase(), hashedPassword],
            (err, result) => {
                if (err) {
                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({
                            message: "This email is already registered."
                        });
                    }

                    console.error("Registration error:", err);
                    return res.status(500).json({
                        message: "Registration failed."
                    });
                }

                return res.status(201).json({
                    message: "Registration successful.",
                    user: {
                        id: result.insertId,
                        name: name.trim(),
                        email: email.trim().toLowerCase()
                    }
                });
            }
        );
    } catch (error) {
        console.error("Password hashing error:", error);
        return res.status(500).json({
            message: "Registration failed."
        });
    }
});

// Log in an existing student
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required."
        });
    }

    const sql = `
        SELECT id, name, email, password, semester
        FROM users
        WHERE email = ?
        LIMIT 1
    `;

    db.query(
        sql,
        [email.trim().toLowerCase()],
        async (err, results) => {
            if (err) {
                console.error("Login database error:", err);
                return res.status(500).json({
                    message: "Login failed."
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    message: "Invalid email or password."
                });
            }

            try {
                const user = results[0];
                const passwordMatches = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!passwordMatches) {
                    return res.status(401).json({
                        message: "Invalid email or password."
                    });
                }

                return res.json({
                    message: "Login successful.",
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        semester: user.semester
                    }
                });
            } catch (error) {
                console.error("Login verification error:", error);
                return res.status(500).json({
                    message: "Login failed."
                });
            }
        }
    );
});

module.exports = router;
