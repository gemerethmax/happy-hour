const jwt = require('jsonwebtoken');
const pool = require('../db/connection');

// Middleware to verify JWT token and attach user to request
exports.requireAuth = async (req, res, next) => {
  try {
    // 1. Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required. Please log in.',
      });
    }

    // 2. Verify token signature and decode payload
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Token is invalid or expired
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token. Please log in again.',
      });
    }

    // 3. Get user from database
    const result = await pool.query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      // User was deleted after token was issued
      return res.status(401).json({
        status: 'error',
        message: 'User not found. Please log in again.',
      });
    }

    // 4. Attach user to request object (available in route handlers)
    req.user = {
      id: result.rows[0].id,
      email: result.rows[0].email,
      createdAt: result.rows[0].created_at,
    };

    // 5. Continue to next middleware/route handler
    next();
  } catch (error) {
    next(error); // Pass to error handler
  }
};

// Optional middleware to check auth but don't require it
// Useful for routes that behave differently for logged-in users
exports.optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      // No token, but that's okay - just continue without user
      req.user = null;
      return next();
    }

    // Try to verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Invalid token, but that's okay for optional auth
      req.user = null;
      return next();
    }

    // Get user from database
    const result = await pool.query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length > 0) {
      req.user = {
        id: result.rows[0].id,
        email: result.rows[0].email,
        createdAt: result.rows[0].created_at,
      };
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    next(error);
  }
};
