const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');
const router = express.Router();
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send('Username and password are required');
    if (username.length < 3 || password.length < 6) return res.status(400).send('Username must be at least 3 characters and password at least 6 characters');
    if (!/^[a-zA-Z0-9]+$/.test(username)) return res.status(400).send('Username can only contain alphanumeric characters');
    
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).send('Username already taken');

    try {
        const user = await User.create(req.body);
        res.status(200).send('User registered successfully');
    }
    catch (error) {
        return res.status(500).json({error: error.message});
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send('Username and password are required');

    const existing = await User.findOne({ username });
    if (existing?.password !== password) return res.status(401).send('Invalid username or password');

    const accessToken = jwt.sign(
        { id: existing._id, username: existing.username },
        process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
        message: `Welcome back, ${existing.username}!`,
        accessToken 
    });
});

router.get('/main', authenticateToken, async (req, res) => { 
    const { username } = req.user; // Extract username from the token
    const existing = await User.findOne({ username });
    if (!existing) return res.status(404).json({ message: 'User not found' });
    res.json({
        id: existing._id,
        username: existing.username,
    });
})

module.exports = router;
