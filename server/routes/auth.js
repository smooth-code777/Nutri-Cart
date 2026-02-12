const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Register
router.post('/register', async (req, res) => {
    const { username, password, diet_preference, health_conditions } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const result = await db.query(
            `INSERT INTO users (username, password, diet_preference, health_conditions)
       VALUES ($1, $2, $3, $4) RETURNING id`,
            [username, hashedPassword, diet_preference, health_conditions]
        );

        res.status(201).json({ id: result.rows[0].id, username, role: 'user' });
    } catch (err) {
        if (err.code === '23505') { // Unique violation code for Postgres
            return res.status(400).json({ error: 'Username already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

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
