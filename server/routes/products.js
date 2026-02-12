const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware to check admin role
const isAdmin = (req, res, next) => {
    // In a real app, verify token and check role here. 
    // For simplicity, we assume the token is verified in a previous middleware or checking headers simply here for now setup.
    // Actually, let's implement a simple verifyToken middleware or just trust the frontend for this demo if not strict, 
    // BUT safer to implement middleware. I'll add a simple verification here.
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    // validation logic would happen here with jwt.verify
    // for strictness we should import jwt. allowing loose check for demo speed if needed, but better to be safe.
    const jwt = require('jsonwebtoken');
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
router.get('/', (req, res) => {
    try {
        const products = db.prepare('SELECT * FROM products').all();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD product
router.post('/', isAdmin, (req, res) => {
    const { name, image_url, description, price, stock, is_vegetarian, calories, protein, sugar, warnings } = req.body;

    try {
        const stmt = db.prepare(`
      INSERT INTO products (name, image_url, description, price, stock, is_vegetarian, calories, protein, sugar, warnings)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        const info = stmt.run(name, image_url, description, price, stock, is_vegetarian, calories, protein, sugar, warnings);
        res.status(201).json({ id: info.lastInsertRowid, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE product
router.put('/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    const { name, image_url, description, price, stock, is_vegetarian, calories, protein, sugar, warnings } = req.body;

    try {
        const stmt = db.prepare(`
      UPDATE products SET name=?, image_url=?, description=?, price=?, stock=?, is_vegetarian=?, calories=?, protein=?, sugar=?, warnings=?
      WHERE id = ?
    `);
        const info = stmt.run(name, image_url, description, price, stock, is_vegetarian, calories, protein, sugar, warnings, id);
        if (info.changes === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE product
router.delete('/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare('DELETE FROM products WHERE id = ?');
        const info = stmt.run(id);
        if (info.changes === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
