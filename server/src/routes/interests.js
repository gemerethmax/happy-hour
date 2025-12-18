const express = require('express');
const router = express.Router();
const interestsController = require('../controllers/interestsController');
const { requireAuth } = require('../middleware/authMiddleware');

// All interests routes require authentication
// User must be logged in to save, view, or delete interests

// POST /api/interests - Save a happy hour to user's interests
router.post('/', requireAuth, interestsController.createInterest);

// GET /api/interests - Get user's saved happy hours
router.get('/', requireAuth, interestsController.getUserInterests);

// DELETE /api/interests/:id - Remove a happy hour from interests
router.delete('/:id', requireAuth, interestsController.deleteInterest);

module.exports = router;
