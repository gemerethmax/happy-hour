const { Pool } = require('pg');

// Create a connection pool using environment variables
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || undefined, // undefined if no password
});

// Log when a new client connects (helpful for debugging)
pool.on('connect', () => {
  console.log('💾 Connected to PostgreSQL database');
});

// Log errors
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Export the pool so other files can use it
module.exports = pool;