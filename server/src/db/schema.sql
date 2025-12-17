-- Happy Hour Swipe Database Schema
-- This file creates all tables needed for the MVP

-- Drop existing tables (allows re-running this file)
DROP TABLE IF EXISTS user_interests CASCADE;
DROP TABLE IF EXISTS happy_hours CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Table: users
-- Stores end-user accounts with secure password hashing
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: restaurants
-- Stores restaurant information
-- Future: Can add owner_user_id FK when implementing restaurant owner accounts
CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: happy_hours
-- Stores happy hour events/specials with scheduling and category tags
CREATE TABLE happy_hours (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  tagline TEXT,
  description TEXT,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sun, 6=Sat
  specific_date DATE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  tags TEXT[] DEFAULT '{}', -- Array for filtering: wings, oysters, drinks, meal_specials
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: user_interests
-- Junction table linking users to their saved/interested happy hours
CREATE TABLE user_interests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  happy_hour_id INTEGER NOT NULL REFERENCES happy_hours(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, happy_hour_id) -- Prevent duplicate saves
);

-- Create indexes for common queries (improves performance)
CREATE INDEX idx_happy_hours_restaurant_id ON happy_hours(restaurant_id);
CREATE INDEX idx_happy_hours_tags ON happy_hours USING GIN(tags); -- GIN index for array queries
CREATE INDEX idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX idx_user_interests_happy_hour_id ON user_interests(happy_hour_id);
