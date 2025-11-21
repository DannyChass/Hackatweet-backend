const mongoose = require("mongoose");

const trendSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "tweets" }],
});

module.exports = mongoose.model("trends", trendSchema);