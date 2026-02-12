const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to check admin role
const isAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Failed to authenticate token' });
        if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
        req.userId = decoded.id;
        next();
    });
};

// GET all products
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD product
router.post('/', isAdmin, async (req, res) => {
    const { name, image_url, description, price, stock, is_vegetarian, calories, protein, sugar, warnings } = req.body;

    try {
        const result = await db.query(`
      INSERT INTO products (name, image_url, description, price, stock, is_vegetarian, calories, protein, sugar, warnings)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
            [name, image_url, description, price, stock, is_vegetarian, calories, protein, sugar, warnings]
        );
        res.status(201).json({ id: result.rows[0].id, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE product
router.put('/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, image_url, description, price, stock, is_vegetarian, calories, protein, sugar, warnings } = req.body;

    try {
        const result = await db.query(`
      UPDATE products SET name=$1, image_url=$2, description=$3, price=$4, stock=$5, is_vegetarian=$6, calories=$7, protein=$8, sugar=$9, warnings=$10
      WHERE id = $11`,
            [name, image_url, description, price, stock, is_vegetarian, calories, protein, sugar, warnings, id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE product
router.delete('/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM products WHERE id = $1', [id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
