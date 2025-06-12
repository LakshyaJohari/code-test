const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

pool.connect((err, client, done) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Successfully connected to PostgreSQL database!');
    client.release();
});

module.exports = pool;