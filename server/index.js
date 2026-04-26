// imports
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db/index');

// routes
const authRoutes = require('./routes/auth');
const testRoute = require('./routes/test_route');

// load .env file
dotenv.config();

// creates the backend server
const app = express();

// middleware
app.use(cors()); // connect frontend to backend
app.use(express.json()); // read frontend JSON

// routes
app.use('/api/auth', authRoutes); // mount auth routes at /api/auth
app.use('/', testRoute); // separate test route for testing purposes

// reads PORT from .env
const port = process.env.PORT || 5000;

// test query to connect to the database
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Database connection successful:', res.rows[0].now);
    }
});

// test route
app.get('/', (req, res) => {
    res.send('Hello from backend!');
})

// starts server and listen for requests
app.listen(port, () => {
    console.log('Server is running on port ' + port);
})

