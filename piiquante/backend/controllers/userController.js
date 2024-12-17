const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { hasSubscribers } = require("diagnostics_channel");

router.post("/auth/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User signed up successfully" });
    } 
    catch (error) {
        res.status(500).json({ error: "Sign up failed" });
    }
});

router.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Authentication failed" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Authentication failed" });
        }
        const token = jwt.sign({ userId: user._id }, "piiquante-secret-key", {
            expiresIn: "1h",
        });
        res.status(200).json({ token });
    } 
    catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});

module.exports = router;
