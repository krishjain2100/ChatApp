const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
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

const router = express.Router();
const usersFilePath = path.join(__dirname, '../users.json');

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }
    if (username.length < 3 || password.length < 6) {
        return res.status(400).send('Username must be at least 3 characters and password at least 6 characters');
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return res.status(400).send('Username can only contain alphanumeric characters');
    }
    let users = [];
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        users = JSON.parse(data);
    } 
    catch (err) {
        users = [];
    }
    if (users.some(u => u.username === username)) {
        return res.status(400).send('Username already exists');
    }
    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        username: username,
        password: password
    };
    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.send('User registered successfully');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }
    let users = [];
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        users = JSON.parse(data);
    } 
    catch (err) {
        return res.status(500).send('Error reading users file');
    }
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).send('Invalid username or password');
    }
    
    const accessToken = jwt.sign(
        { id: user.id, username: user.username },
        process.env.ACCESS_TOKEN_SECRET
    );
    res.json({ 
        message: `Welcome back, ${user.username}!`,
        accessToken 
    });
});

router.get('/main', authenticateToken, (req, res) => { 
    let users = [];
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        users = JSON.parse(data);
    } 
    catch (err) {
        return res.status(500).json({ message: 'Error reading users file' });
    }
    
    const user = users.find(u => u.username === req.user.username);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
        id: user.id,
        username: user.username,
        data: user.data
    });
})

module.exports = router;
