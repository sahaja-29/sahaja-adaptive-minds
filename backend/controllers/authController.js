const db = require("../config/db");
const bcrypt = require("bcryptjs");

// ================= REGISTER USER =================

const registerUser = async (req, res) => {
    try {
        const { name, email, password, semester } = req.body;

        db.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (err, results) => {
                if (err) {
                    return res.status(500).json({
                        message: err.message,
                    });
                }

                if (results.length > 0) {
                    return res.status(400).json({
                        message: "User already exists",
                    });
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                db.query(
                    "INSERT INTO users (name, email, password, semester) VALUES (?, ?, ?, ?)",
                    [name, email, hashedPassword, semester],
                    (err) => {
                        if (err) {
                            return res.status(500).json({
                                message: err.message,
                            });
                        }

                        res.status(201).json({
                            message: "User registered successfully",
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message,
        });
    }
};

// ================= LOGIN USER =================

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        db.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (err, results) => {
                if (err) {
                    return res.status(500).json({
                        message: err.message,
                    });
                }

                if (results.length === 0) {
                    return res.status(400).json({
                        message: "User not found",
                    });
                }

                const user = results[0];

                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return res.status(400).json({
                        message: "Invalid password",
                    });
                }

                res.status(200).json({
                    message: "Login successful",
                    user,
                });
            }
        );
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
};