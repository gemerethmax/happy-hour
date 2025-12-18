const pool = require('../db/connection');

// POST /api/interests
// Save a happy hour to user's interested list (requires auth)
exports.createInterest = async (req, res, next) => {
  try {
    const userId = req.user.id; // Set by requireAuth middleware
    const { happy_hour_id } = req.body;

    // Validation
    if (!happy_hour_id) {
      return res.status(400).json({
        status: 'error',
        message: 'happy_hour_id is required',
      });
    }

    // Check if happy hour exists
    const happyHourCheck = await pool.query(
      'SELECT id FROM happy_hours WHERE id = $1',
      [happy_hour_id]
    );

    if (happyHourCheck.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Happy hour not found',
      });
    }

    // Check if already saved (UNIQUE constraint will catch this too, but better UX)
    const existingInterest = await pool.query(
      'SELECT id FROM user_interests WHERE user_id = $1 AND happy_hour_id = $2',
      [userId, happy_hour_id]
    );

    if (existingInterest.rows.length > 0) {
      return res.status(409).json({
        status: 'error',
        message: 'Happy hour already saved',
      });
    }

    // Create interest
    const result = await pool.query(
      'INSERT INTO user_interests (user_id, happy_hour_id) VALUES ($1, $2) RETURNING id, created_at',
      [userId, happy_hour_id]
    );

    const interest = result.rows[0];

    res.status(201).json({
      status: 'success',
      message: 'Happy hour saved to your interests',
      data: {
        id: interest.id,
        userId: userId,
        happyHourId: happy_hour_id,
        createdAt: interest.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/interests
// Get all of user's saved happy hours (requires auth)
exports.getUserInterests = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT
        ui.id as interest_id,
        ui.created_at as saved_at,
        hh.id as happy_hour_id,
        hh.title,
        hh.tagline,
        hh.description,
        hh.day_of_week,
        hh.specific_date,
        hh.start_time,
        hh.end_time,
        hh.tags,
        hh.image_url,
        r.id as restaurant_id,
        r.name as restaurant_name,
        r.address as restaurant_address,
        r.image_url as restaurant_image_url
      FROM user_interests ui
      JOIN happy_hours hh ON ui.happy_hour_id = hh.id
      JOIN restaurants r ON hh.restaurant_id = r.id
      WHERE ui.user_id = $1
      ORDER BY ui.created_at DESC
    `;

    const result = await pool.query(query, [userId]);

    // Format response
    const interests = result.rows.map(row => ({
      interestId: row.interest_id,
      savedAt: row.saved_at,
      happyHour: {
        id: row.happy_hour_id,
        title: row.title,
        tagline: row.tagline,
        description: row.description,
        dayOfWeek: row.day_of_week,
        specificDate: row.specific_date,
        startTime: row.start_time,
        endTime: row.end_time,
        tags: row.tags,
        imageUrl: row.image_url,
        restaurant: {
          id: row.restaurant_id,
          name: row.restaurant_name,
          address: row.restaurant_address,
          imageUrl: row.restaurant_image_url,
        },
      },
    }));

    res.status(200).json({
      status: 'success',
      count: interests.length,
      data: interests,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/interests/:id
// Remove a happy hour from user's interests (requires auth)
exports.deleteInterest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // interest ID, not happy_hour ID

    // Check if interest exists and belongs to this user
    const checkQuery = 'SELECT id FROM user_interests WHERE id = $1 AND user_id = $2';
    const checkResult = await pool.query(checkQuery, [id, userId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Interest not found or does not belong to you',
      });
    }

    // Delete the interest
    await pool.query('DELETE FROM user_interests WHERE id = $1', [id]);

    res.status(200).json({
      status: 'success',
      message: 'Interest removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
