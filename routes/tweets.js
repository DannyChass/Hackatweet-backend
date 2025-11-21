const express = require("express");
const router = express.Router();

const Tweet = require("../models/Tweet");
const User = require("../models/User");
const Trend = require("../models/Trend");

router.post("/new", async (req, res) => {
    const { token, content, trends } = req.body;

    if (!token || !content) {
        return res.status(400).json({ result: false, error: "Missing fields" });
    }

    const user = await User.findOne({ token });
    if (!user) {
        return res.status(404).json({ result: false, error: "User not found" });
    }

    const newTweet = new Tweet({
        author: user._id,
        content,
        usersWhoLiked: [],
    });

    await newTweet.save();

    if ((trends)) {
        for (let t of trends) {
            const trendName = t.trim().toLowerCase();

            if (!trendName) continue;

            let trend = await Trend.findOne({ name: trendName });

            if (!trend) {
                trend = new Trend({
                    name: trendName, tweets: []
                })
            }

            if (!trend.tweets.includes(newTweet._id)) {
                trend.tweets.push(newTweet._id);
            }

            await trend.save();
        }
    }

    res.json({ result: true, tweet: { id: newTweet._id, firstname : user.firstname, author: user.username,  content: newTweet.content, date: newTweet.date } });
});

router.delete("/delete/:tweetid", async (req, res) => {
    const { token } = req.body;
    const { tweetid } = req.params;

    if (!token) {
        return res.status(400).json({ result: false, error: "Missing token" });
    }

    const user = await User.findOne({ token });

    if (!user) {
        return res.status(400).json({ result: false, error: "User not found" });
    }

    const tweet = await Tweet.findById(tweetid);
    if (!tweet) {
        return res.status(404).json({ result: false, error: "Tweet not found" });
    }

    if (tweet.author.toString() !== user._id.toString()) {
        return res.status(401).json({ result: false, error: "Unauthorized: not your tweet" });
    }

    const trends = await Trend.find({ tweets: tweetid });

    for (let trend of trends) {
        trend.tweets = trend.tweets.filter(id => id.toString() != tweetid);

        await trend.save();

        if (trend.tweet.length == 0) {
            await Trend.findByIdAndDelete(trend._id);
        }
    }

    await Tweet.findByIdAndDelete(tweetid);

    res.json({
        result: true,
        message: "Tweet deleted successfully",
        deletedTweetId: tweetid
    });
});

router.get('/all', async (req, res) => {
    try {
        const tweets = await Tweet.find()
            .populate("author", "username firstname")
            .sort({ date: -1 });

        const formattedTweets = tweets.map(t => ({
            id: t._id,
            firstname: t.author.firstname,
            author: t.author.username,
            content: t.content,
            date: t.date,
            likes: t.usersWhoLiked.length,
        }));

        res.json({ result: true, tweets: formattedTweets });
    } catch (error) {
        res.status(500).json({ result: false, error: "Server error" });
    }
});

module.exports = router;