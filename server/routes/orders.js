const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Failed to authenticate token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

// GET orders (User sees own, Admin sees all)
router.get('/', verifyToken, async (req, res) => {
    try {
        if (req.userRole === 'admin') {
            const result = await db.query('SELECT o.*, u.username FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC');
            const parsedOrders = result.rows.map(o => ({ ...o, items: JSON.parse(o.items) }));
            res.json(parsedOrders);
        } else {
            const result = await db.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [req.userId]);
            const parsedOrders = result.rows.map(o => ({ ...o, items: JSON.parse(o.items) }));
            res.json(parsedOrders);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE order
router.post('/', verifyToken, async (req, res) => {
    const { items, total_amount } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    try {
        const itemsJson = JSON.stringify(items);
        const result = await db.query(`
      INSERT INTO orders (user_id, items, total_amount)
      VALUES ($1, $2, $3) RETURNING id`,
            [req.userId, itemsJson, total_amount]
        );
        res.status(201).json({ id: result.rows[0].id, message: 'Order placed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
