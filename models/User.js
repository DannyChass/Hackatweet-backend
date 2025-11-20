const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("users", userSchema);