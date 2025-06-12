/* // quickmark-auth-backend/db.js
const { Pool } = require('pg');

require('dotenv').config(); // Load environment variables from .env

// Create a new PostgreSQL connection pool
// The connection string is read from your .env file
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Event listener for database connection errors
pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
    // If a critical database error occurs, it's often best to terminate the process
    process.exit(-1);
});

console.log('PostgreSQL pool initialized and connected.');

module.exports = pool; // Export the pool for use in other files */

// config/db.js
const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

// Test the connection
pool.connect((err, client, done) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Successfully connected to PostgreSQL database!');
    client.release(); // Release the client back to the pool
});

module.exports = pool;