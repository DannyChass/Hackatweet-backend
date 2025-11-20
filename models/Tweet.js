const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  content: { type: String, required: true },
  usersWhoLiked: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("tweets", tweetSchema);