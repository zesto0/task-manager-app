const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/index');

const authMiddleware = require('../middleware/auth');

// POST /api/auth/register endpoint for user registration
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required'})
    }

    // validate password length
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

        // send response with token and user info (excluding password)
        res.status(201).json({
            token,
            user: newUser.rows[0]
        })

    // catch any errors and send 500 response
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({error: 'Server error'})
    }
})

// 4.3. POST /api/auth/login — find user by email, compare password hash, return JWT on match
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({error: 'Provide email and password.'})
    }

    if (password.length < 6) {
        return res.status(400).json({error: 'Password must be atleast 6 characters.'})
    }

    try {
        const userAcc = await pool.query(
            'SELECT id, email, password_hash FROM users WHERE email = $1', [email]
        )

        // checks if there's a user with the provided email
        if (userAcc.rows.length === 0) {
            return res.status(401).json({error: 'No user found.'})
        }
        
        const comparedPass = await bcrypt.compare(password, userAcc.rows[0].password_hash)

        // checks if the password match
        if (!comparedPass) {
            return res.status(401).json({error: 'Invalid credentials!'})
        }

        const token = jwt.sign(
            { userId: userAcc.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        if (comparedPass) {
            return res.status(200).json({
                token
            })
        }
    } catch (err) {
        console.error('Error logging user:', err);
        res.status(500).json({error: 'Server error'})
    }
})

// 4.5. Add a protected GET /api/auth/me route that returns the logged-in user's info
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await pool.query(
            'SELECT id, email, created_at FROM users WHERE id = $1', [req.user.userId]
        )

        if (user.rows.length === 0) {
            return res.status(404).json({message: 'No users found!'})
        }

        return res.status(200).json(user.rows[0]);
    } catch (err) {
        return res.status(500).json({error: 'Internal server error'})
    }
})


// GET api/auth/users
router.get('/users', async (req, res) => {
    try {
        // just return all users. Return [] if no users exist. Empty is not an error
        const users = await pool.query(
            'SELECT * FROM users'
        )
        return res.status(200).json(users.rows)

    } catch (err) {
        res.status(500).json({error: 'internal error'})
    }
})

// GET api/auth/tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await pool.query(
            'SELECT * FROM tasks'
        )

        return res.status(200).json(tasks.rows)
    } catch (err) {
        res.status(500).json({error: 'internal error'})
    }
})


module.exports = router;