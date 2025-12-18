const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

// Public routes (no authentication required)
// POST /api/auth/signup - Create new user account
router.post('/signup', authController.signup);

// POST /api/auth/login - Authenticate user
router.post('/login', authController.login);

// POST /api/auth/logout - Clear authentication cookie
router.post('/logout', authController.logout);

// Protected route (requires authentication)
// GET /api/auth/verify - Check if user is logged in and get user data
router.get('/verify', requireAuth, authController.verify);

module.exports = router;
