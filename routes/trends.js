const express = require('express');
const router = express.Router();

const Trend = require("../models/Trend");

router.get("/all", async (req, res) => {
    try {
        let trends = await Trend.find().lean();

        trends.sort((a, b) => b.tweets.length - a.tweets.length);

        const formatted = trends.map(t => ({
            name: t.name,
            tweetCount: t.tweets.length
        }));

        res.json({ result: true, trends: formatted });

    } catch (error) {
        console.error(error);
        res.status(500).json({ result: false, error: "Server error" });
    }
})

module.exports = router;