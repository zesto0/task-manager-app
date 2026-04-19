// imports
const { Pool } = require('pg');
const dotenv = require('dotenv');

// loads .env file
dotenv.config();

// creates DB connection from DB_URL
const pool = new Pool({
    connectionString: process.env.DB_URL
});

// export so that it can be used
module.exports = pool;