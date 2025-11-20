const express = require("express");
const connectDB = require("../models/connection");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

const usersRouter = require("../routes/users");
const tweetsRouter = require("../routes/tweets");

app.get("/", (req, res) => {
  res.send("Backend connected to MongoDB");
});

app.use("/users", usersRouter);
app.use("/tweets", tweetsRouter);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});