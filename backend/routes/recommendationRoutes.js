const express = require("express");

const {
    getRecommendations
} = require("../services/recommendationService");

const router = express.Router();

router.post("/recommend", async (req, res) => {
    try {
        console.log("=================================");
        console.log("Recommendation request received");
        console.log(req.body);

        const {
            subject,
            topic,
            difficulty
        } = req.body;

        if (!subject || !topic || !difficulty) {
            return res.status(400).json({
                error: "subject, topic and difficulty are required"
            });
        }

        const result = await getRecommendations(
            subject,
            topic,
            difficulty
        );

        console.log("Recommendation generation successful");
        console.log("=================================");

        return res.json(result);

    } catch (error) {

        console.error("=================================");
        console.error("RECOMMENDATION ERROR");
        console.error(error.message);
        console.error(error.stack);
        console.error("=================================");

        return res.status(500).json({
            error: "Failed to generate recommendations",
            details: error.message
        });
    }
});

module.exports = router;