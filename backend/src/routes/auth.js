const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });
    if (username.length < 3 || password.length < 6) return res.status(400).json({ message: 'Username must be at least 3 characters and password at least 6 characters' });
    if (!/^[a-zA-Z0-9]+$/.test(username)) return res.status(400).json({ message: 'Username can only contain alphanumeric characters' });
    
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username already taken' });

    const hash = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({ username, password: hash });
        res.status(201).json({ message: 'User registered successfully', userId: user._id });
    }
    catch (error) {
        return res.status(500).json({error: error.message});
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send({message: 'Username and password are required'});

    const existing = await User.findOne({ username });
    if (!existing) return res.status(401).send({message: 'Invalid username or password'});

    const isValid =  await bcrypt.compare(password, existing.password);
    if (!isValid) return res.status(401).send({ message: 'Wrong Password' });

    const tokenPayload = { id: existing._id, username: existing.username };
    const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET);

    res.json({
        message: `Welcome back, ${existing.username}!`,
        accessToken 
    });
});


module.exports = router;
