const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/index');

// test route
router.get('/test', (req, res) => {
    res.json({
        message: 'test Auth route'
    })
})

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required'})
    }

    if (password.length < 6) {
        return res.status(400).json({error: 'Password must be at least 6 characters'})
    }

    try {
        // check if user already exists
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1', [email]
        )

        if (userExists.rows.length > 0) {
            return res.status(400).json({error: 'User already exists'})
        }

        // hash password
        const password_hash = await bcrypt.hash(password, 10);

        // insert new user into database
        const newUser = await pool.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at', [email, password_hash]
        )

        // create JWT token
        const token = jwt.sign(
            { userId: newUser.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(201).json({
            token,
            user: newUser.rows[0]
        })

    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({error: 'Server error'})
    }
})

module.exports = router;