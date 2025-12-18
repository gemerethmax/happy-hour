const express = require('express');
const router = express.Router();
const happyHoursController = require('../controllers/happyHoursController');

// Public routes (no authentication required)

// GET /api/happy-hours - Get all happy hours with optional filters
// Query params: ?tag=wings&day=1&date=2025-12-22&restaurant_id=1
router.get('/', happyHoursController.getAllHappyHours);

// GET /api/happy-hours/:id - Get single happy hour by ID
router.get('/:id', happyHoursController.getHappyHourById);

module.exports = router;
