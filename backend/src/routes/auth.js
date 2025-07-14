const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');
const router = express.Router();
const bcrypt = require('bcrypt');
const validator = require('validator');
require('dotenv').config();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) return res.status(400).json({ message: 'Username, email, and password are required' });
    if (username.length < 3) return res.status(400).json({ message: 'Username must be at least 3 characters long' });
    if (username.length > 20) return res.status(400).json({ message: 'Username must be less than 20 characters long' });
    if (!validator.isAlphanumeric(username)) return res.status(400).json({ message: 'Username can only contain alphanumeric characters' });
    if (!validator.isEmail(email)) return res.status(400).json({ message: 'Please enter a valid email address' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Username already taken' });
        const existingEmail = await User.findOne({ email: email.toLowerCase() });
        if (existingEmail) return res.status(400).json({ message: 'Email already registered' });

        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ 
            username, 
            email: email.toLowerCase(), 
            password: hash 
        });
        
        res.status(201).json({ 
            message: 'User registered successfully', 
            userId: user._id 
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send({message: 'Username and password are required'});

    const existing = await User.findOne({ username });
    if (!existing) return res.status(401).send({message: 'Invalid username or password'});

    const isValid =  await bcrypt.compare(password, existing.password);
    if (!isValid) return res.status(401).send({ message: 'Wrong Password' });

    const tokenPayload = { id: existing._id, username: existing.username, email: existing.email };
    const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET);

    res.json({
        message: `Welcome back, ${existing.username}!`,
        accessToken 
    });
});


module.exports = router;
