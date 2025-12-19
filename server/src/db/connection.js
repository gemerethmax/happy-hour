const { Pool } = require('pg');

// Create a connection pool using DATABASE_URL (for production) or individual vars (for local dev)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
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