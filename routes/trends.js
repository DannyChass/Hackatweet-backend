const express = require('express');
const router = express.Router();

const Trend = require("../models/Trend");
const Tweet = require("../models/Tweet");

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

router.get("/tweets/:name", async (req, res) => {
    try {
        const trendName = req.params.name;
        const trend = await Trend.findOne({ name: trendName })

        if (!trend) {
            return res.json({ result: false, error: "Trend not found" });
        }

        const tweets = await Tweet.find({ _id: { $in: trend.tweets } }).populate("author", "username firstname").sort({ date: -1 });

        const formattedTweets = tweets.map(t => ({
            id: t._id,
            content: t.content,
            date: t.date,
            author: t.author.username,
            firstname: t.author.firstname,
        }));

        res.json({ result: true, tweets: formattedTweets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: false, error: "Server error" });
    }
})

module.exports = router;