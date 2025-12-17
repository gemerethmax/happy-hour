// Import dependencies
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Parse JSON request bodies
app.use(express.json());

// Parse cookies from requests
app.use(cookieParser());

// Enable CORS for our React client
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, // Allow cookies to be sent
}));

// Test route to confirm server is running
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Happy Hour API is running!',
    timestamp: new Date().toISOString(),
  });
});

// Placeholder routes (we'll build these in Phase 4 & 5)
// app.use('/api/auth', authRoutes);
// app.use('/api/happy-hours', happyHoursRoutes);
// app.use('/api/interests', interestsRoutes);

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