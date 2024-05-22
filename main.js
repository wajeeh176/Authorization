require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddle = require('./auth');

const app = express();
const PORT = 3001;

app.use(express.static('./public'));
app.use(express.json());

let users = [];

app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: 'Please Provide credentials' });
    }

    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ msg: 'User already exists' });
    }

    users.push({ username, password });
    res.status(201).json({ msg: 'User registered successfully' });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: 'Please Provide credentials' });
    }

    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const id = 1; // This should be a unique user ID from your database
    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '20d' });
    res.status(200).json({ msg: 'User Success', token });
});

app.get('/api/home', authMiddle, (req, res) => {
    const quizNum = Math.floor(Math.random() * 100);
    return res.status(200).json({ msg: 'Success', valid: `Here is your Lucky number ${quizNum}, ${req.user.username}` });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
