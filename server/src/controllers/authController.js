const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/connection');

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, // Payload - data stored in token
    process.env.JWT_SECRET, // Secret key for signing
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } // Token expires in 7 days
  );
};

// Helper function to set JWT cookie
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true, // Cannot be accessed by JavaScript (XSS protection)
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'lax', // Same-domain cookies (works with Safari)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

// POST /api/auth/signup
// Create new user account
exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 6 characters',
      });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        status: 'error',
        message: 'Email already registered',
      });
    }

    // Hash password (10 salt rounds is standard)
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, passwordHash]
    );

    const newUser = result.rows[0];

    // Generate JWT token
    const token = generateToken(newUser.id);

    // Set httpOnly cookie
    setTokenCookie(res, token);

    // Send response (do NOT send password_hash!)
    res.status(201).json({
      status: 'success',
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        createdAt: newUser.created_at,
      },
    });
  } catch (error) {
    next(error); // Pass to error handler middleware
  }
};

// POST /api/auth/login
// Authenticate existing user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required',
      });
    }

    // Find user by email
    const result = await pool.query(
      'SELECT id, email, password_hash, created_at FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    const user = result.rows[0];

    // Compare password with hashed password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Set httpOnly cookie
    setTokenCookie(res, token);

    // Send response (do NOT send password_hash!)
    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully',
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout
// Clear authentication cookie
exports.logout = async (req, res, next) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/verify
// Check if user is authenticated and return user data
exports.verify = async (req, res, next) => {
  try {
    // At this point, req.user is set by auth middleware
    // If we reach here, the user is authenticated
    res.status(200).json({
      status: 'success',
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};
