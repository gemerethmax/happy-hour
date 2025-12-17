-- Seed data for Happy Hour Swipe MVP
-- This provides sample restaurants and happy hours for development

-- Clear existing data (in correct order to respect foreign keys)
TRUNCATE user_interests, happy_hours, restaurants, users RESTART IDENTITY CASCADE;

-- Insert sample restaurants
INSERT INTO restaurants (name, address, description, image_url) VALUES
('The Wing Stop', '123 Main St, San Francisco, CA', 'Best wings in the city with 20+ flavors', 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400'),
('Oyster Bay', '456 Harbor Blvd, San Francisco, CA', 'Fresh oysters daily from local waters', 'https://images.unsplash.com/photo-1559702248-2e5b6c7d9d6f?w=400'),
('Sunset Cocktail Lounge', '789 Beach Ave, San Francisco, CA', 'Craft cocktails with ocean views', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400'),
('The Burger Joint', '321 Park St, San Francisco, CA', 'Gourmet burgers and craft beers', 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400'),
('Taco Tuesday HQ', '654 Mission St, San Francisco, CA', 'Authentic street tacos and margaritas', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400');

-- Insert sample happy hours
-- Note: day_of_week: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday

-- The Wing Stop happy hours
INSERT INTO happy_hours (restaurant_id, title, tagline, description, day_of_week, start_time, end_time, tags, image_url) VALUES
(1, 'Monday Wing Madness', '50% off all wings', 'Every Monday enjoy half-price wings! Choose from 20+ flavors including Buffalo, BBQ, Teriyaki, and our signature Honey Sriracha. Perfect for game nights!', 1, '16:00', '19:00', ARRAY['wings', 'meal_specials'], 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600'),
(1, 'Thirsty Thursday', '$3 drafts with wing purchase', 'Ice-cold draft beers for just $3 when you order any wing platter. Featuring local craft breweries and classic domestics.', 4, '17:00', '21:00', ARRAY['drinks', 'wings'], 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600');

-- Oyster Bay happy hours
INSERT INTO happy_hours (restaurant_id, title, tagline, description, day_of_week, start_time, end_time, tags, image_url) VALUES
(2, 'Daily Dollar Oysters', '$1 oysters every weekday', 'Fresh local oysters for just $1 each during happy hour. Pair with our selection of white wines and champagnes. Raw, grilled, or Rockefeller style!', NULL, '15:00', '18:00', ARRAY['oysters', 'meal_specials'], 'https://images.unsplash.com/photo-1559702248-2e5b6c7d9d6f?w=600'),
(2, 'Wine Down Wednesday', 'Half-price wine bottles', 'Every Wednesday, enjoy 50% off all wine bottles with purchase of any appetizer. Perfect for date night!', 3, '16:00', '20:00', ARRAY['drinks'], 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600');

-- Sunset Cocktail Lounge happy hours
INSERT INTO happy_hours (restaurant_id, title, tagline, description, day_of_week, start_time, end_time, tags, image_url) VALUES
(3, 'Sunset Specials', '$5 craft cocktails during golden hour', 'Watch the sunset with our signature cocktails: Mai Tai, Old Fashioned, Margarita, and seasonal specials. All just $5!', NULL, '17:00', '19:00', ARRAY['drinks'], 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600'),
(3, 'Friday Wind Down', 'Half-price appetizers all night', 'TGIF! Enjoy 50% off all small plates: truffle fries, calamari, bruschetta, cheese board, and more.', 5, '16:00', '22:00', ARRAY['meal_specials'], 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=600');

-- The Burger Joint happy hours
INSERT INTO happy_hours (restaurant_id, title, tagline, description, day_of_week, start_time, end_time, tags, image_url) VALUES
(4, 'Burger & Beer Bash', '$10 burger + beer combo', 'Choose any burger and get a draft beer for just $10 total. Includes our famous truffle burger, BBQ bacon burger, and veggie burger.', NULL, '15:00', '18:00', ARRAY['meal_specials', 'drinks'], 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600'),
(4, 'Weekend Brunch Happy Hour', 'Bottomless mimosas', 'Saturday and Sunday brunch with unlimited mimosas for $20. Pair with our breakfast burgers and loaded hash browns.', 6, '10:00', '14:00', ARRAY['drinks'], 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600'),
(4, 'Weekend Brunch Happy Hour', 'Bottomless mimosas', 'Saturday and Sunday brunch with unlimited mimosas for $20. Pair with our breakfast burgers and loaded hash browns.', 0, '10:00', '14:00', ARRAY['drinks'], 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600');

-- Taco Tuesday HQ happy hours
INSERT INTO happy_hours (restaurant_id, title, tagline, description, day_of_week, start_time, end_time, tags, image_url) VALUES
(5, 'Taco Tuesday', '$2 tacos all day', 'The original! Every Tuesday, enjoy street-style tacos for just $2 each. Carnitas, carne asada, chicken, fish, and veggie options. Add unlimited chips & salsa!', 2, '11:00', '22:00', ARRAY['meal_specials'], 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600'),
(5, 'Margarita Madness', '$6 margaritas every evening', 'Daily happy hour featuring classic, strawberry, mango, and jalapeño margaritas. Available frozen or on the rocks with salt rim.', NULL, '16:00', '19:00', ARRAY['drinks'], 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600');

-- Add a future one-time event for testing specific_date functionality
INSERT INTO happy_hours (restaurant_id, title, tagline, description, specific_date, start_time, end_time, tags, image_url) VALUES
(3, 'New Year''s Eve Champagne Special', 'Champagne toast at midnight', 'Ring in the new year with complimentary champagne at midnight! Live DJ, premium cocktails, and rooftop fireworks viewing.', '2025-12-31', '21:00', '02:00', ARRAY['drinks'], 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=600');

-- Optional: Insert a test user (password: "password123" hashed with bcrypt)
-- You can use this to test authentication later
-- Password hash generated with: bcrypt.hash('password123', 10)
INSERT INTO users (email, password_hash) VALUES
('test@example.com', '$2b$10$rKjHELQXQ5Z.5v3FvZ4zxO7F5KKN1XpYLLvL4y4O5pN5HqBjW5B6C');
