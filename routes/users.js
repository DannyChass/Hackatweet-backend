const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const uid2 = require("uid2");

const User = require('../models/User');

router.post('/signup', async (req, res) => {
    console.log(req.body);
    const { firstname, username, password } = req.body

    if (!firstname || !username || !password) {
        return res.status(400).json({ result: false, error: "Missing fields" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ result: false, error: "Username already exists" });
    }

    const hash = bcrypt.hashSync(password, 10);

    const token = uid2(32);

    const newUser = new User({
        firstname,
        username,
        password: hash,
        token,
    });

    await newUser.save();

    res.json({ result: true, user: { firstname, username, token } })
})

router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ result: false, error: "Missing fields" });
    }

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(404).json({ result: false, error: "User not found" });
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ result: false, error: "Invalid password" });
    }

    res.json({ result: true, user: { firsname: user.firstname, username: user.username, token: user.token } });
})

module.exports = router;