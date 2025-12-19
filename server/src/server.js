// Import dependencies
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import database connection
const pool = require('./db/connection');

// Import routes
const authRoutes = require('./routes/auth');
const happyHoursRoutes = require('./routes/happyHours');
const interestsRoutes = require('./routes/interests');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Parse JSON request bodies
app.use(express.json());

// Parse cookies from requests
app.use(cookieParser());

// Enable CORS for our React client (only needed in development)
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // Allow cookies to be sent
  }));
}

// Test route to confirm server is running
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Happy Hour API is running!',
    timestamp: new Date().toISOString(),
  });
});

// Test route to confirm database connection
app.get('/api/db-test', async (req, res, next) => {
  try {
    // Query PostgreSQL version to test connection
    const result = await pool.query('SELECT version()');
    res.json({
      status: 'success',
      message: 'Database connection successful!',
      database: result.rows[0].version,
    });
  } catch (error) {
    next(error); // Pass error to error handler
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/happy-hours', happyHoursRoutes);
app.use('/api/interests', interestsRoutes);

// Serve static files from React build (in production)
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app build directory
  app.use(express.static(path.join(__dirname, '../../client/dist')));

  // Catch-all route: serve index.html for any non-API routes (React Router)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
  });
}

// Error handling middleware (catches any errors and formats response)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});