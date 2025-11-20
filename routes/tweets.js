const express = require("express");
const router = express.Router();

const Tweet = require("../models/Tweet");
const User = require("../models/User");

router.post("/new", async (req, res) => {
    const { token, content } = req.body;

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

    res.json({ result: true, tweet: { id: newTweet._id, author: user.username, content: newTweet.content, data: newTweet.date } });
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

    await Tweet.findByIdAndDelete(tweetid);

    res.json({ result: true, message: "Tweet deleted successfully" });
});

module.exports = router;