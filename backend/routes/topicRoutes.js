const express = require("express");
const db = require("../config/db");

const router = express.Router();

router.get("/", (req, res) => {
    const subjectId = req.query.subjectId;

    db.query(
        "SELECT * FROM topics WHERE subject_id = ?",
        [subjectId],
        (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json(results);
        }
    );
});

module.exports = router;