const pool = require('../db/connection');

// Helper function to get day of week from date string
// JavaScript: 0=Sunday, 1=Monday, ..., 6=Saturday (matches our DB schema)
const getDayOfWeek = (dateString) => {
  return new Date(dateString).getDay();
};

// GET /api/happy-hours
// Fetch happy hours with optional filters: tags, day, date
exports.getAllHappyHours = async (req, res, next) => {
  try {
    const { tag, day, date, restaurant_id } = req.query;

    // Start building the query
    let query = `
      SELECT
        hh.id,
        hh.title,
        hh.tagline,
        hh.description,
        hh.day_of_week,
        hh.specific_date,
        hh.start_time,
        hh.end_time,
        hh.tags,
        hh.image_url,
        hh.created_at,
        r.id as restaurant_id,
        r.name as restaurant_name,
        r.address as restaurant_address,
        r.description as restaurant_description,
        r.image_url as restaurant_image_url
      FROM happy_hours hh
      JOIN restaurants r ON hh.restaurant_id = r.id
    `;

    const conditions = [];
    const values = [];
    let paramCount = 1;

    // Filter by tag (e.g., "wings", "oysters", "drinks")
    if (tag) {
      conditions.push(`$${paramCount} = ANY(hh.tags)`);
      values.push(tag);
      paramCount++;
    }

    // Filter by day of week (0-6, where 0=Sunday)
    // This shows happy hours that occur on that specific day
    if (day !== undefined) {
      const dayNum = parseInt(day);
      if (dayNum >= 0 && dayNum <= 6) {
        conditions.push(`hh.day_of_week = $${paramCount}`);
        values.push(dayNum);
        paramCount++;
      }
    }

    // Filter by specific date
    // Shows happy hours with matching specific_date OR matching day_of_week
    if (date) {
      const dayOfWeek = getDayOfWeek(date);
      conditions.push(`(hh.specific_date = $${paramCount} OR hh.day_of_week = $${paramCount + 1})`);
      values.push(date, dayOfWeek);
      paramCount += 2;
    }

    // Filter by restaurant
    if (restaurant_id) {
      conditions.push(`hh.restaurant_id = $${paramCount}`);
      values.push(restaurant_id);
      paramCount++;
    }

    // Add WHERE clause if there are conditions
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Order by start time
    query += ' ORDER BY hh.start_time ASC';

    // Execute query
    const result = await pool.query(query, values);

    // Format response to nest restaurant data
    const happyHours = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      tagline: row.tagline,
      description: row.description,
      dayOfWeek: row.day_of_week,
      specificDate: row.specific_date,
      startTime: row.start_time,
      endTime: row.end_time,
      tags: row.tags,
      imageUrl: row.image_url,
      createdAt: row.created_at,
      restaurant: {
        id: row.restaurant_id,
        name: row.restaurant_name,
        address: row.restaurant_address,
        description: row.restaurant_description,
        imageUrl: row.restaurant_image_url,
      },
    }));

    res.status(200).json({
      status: 'success',
      count: happyHours.length,
      data: happyHours,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/happy-hours/:id
// Fetch single happy hour by ID
exports.getHappyHourById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT
        hh.id,
        hh.title,
        hh.tagline,
        hh.description,
        hh.day_of_week,
        hh.specific_date,
        hh.start_time,
        hh.end_time,
        hh.tags,
        hh.image_url,
        hh.created_at,
        r.id as restaurant_id,
        r.name as restaurant_name,
        r.address as restaurant_address,
        r.description as restaurant_description,
        r.image_url as restaurant_image_url
      FROM happy_hours hh
      JOIN restaurants r ON hh.restaurant_id = r.id
      WHERE hh.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Happy hour not found',
      });
    }

    const row = result.rows[0];
    const happyHour = {
      id: row.id,
      title: row.title,
      tagline: row.tagline,
      description: row.description,
      dayOfWeek: row.day_of_week,
      specificDate: row.specific_date,
      startTime: row.start_time,
      endTime: row.end_time,
      tags: row.tags,
      imageUrl: row.image_url,
      createdAt: row.created_at,
      restaurant: {
        id: row.restaurant_id,
        name: row.restaurant_name,
        address: row.restaurant_address,
        description: row.restaurant_description,
        imageUrl: row.restaurant_image_url,
      },
    };

    res.status(200).json({
      status: 'success',
      data: happyHour,
    });
  } catch (error) {
    next(error);
  }
};
