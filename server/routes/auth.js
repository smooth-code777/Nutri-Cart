const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Register
router.post('/register', (req, res) => {
    const { username, password, diet_preference, health_conditions } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const stmt = db.prepare(`
      INSERT INTO users (username, password, diet_preference, health_conditions)
      VALUES (?, ?, ?, ?)
    `);
        const info = stmt.run(username, hashedPassword, diet_preference, health_conditions);

        res.status(201).json({ id: info.lastInsertRowid, username, role: 'user' });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(400).json({ error: 'Username already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    try {
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, username: user.username, role: user.role, diet_preference: user.diet_preference, health_conditions: user.health_conditions } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
