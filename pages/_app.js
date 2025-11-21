const express = require("express");
const connectDB = require("../models/connection");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

const usersRouter = require("../routes/users");
const tweetsRouter = require("../routes/tweets");
const trendsRouter = require("../routes/trends");

app.get("/", (req, res) => {
  res.send("Backend connected to MongoDB");
});

app.use("/users", usersRouter);
app.use("/tweets", tweetsRouter);
app.use("/trends", trendsRouter);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});