// imports
const { Pool } = require('pg');
const dotenv = require('dotenv');

// loads .env file
dotenv.config();

// creates DB connection from DB_URL
const pool = new Pool({
    connectionString: process.env.DB_URL
});

/* the same as above but with individual parameters instead of connectionString
const pool = new Pool({
    user: 'postgres',
    password: 'postgresql',
    host: 'localhost',
    port: 5432,
    database: 'taskflow_db'
});
*/

// export so that it can be used
module.exports = pool;