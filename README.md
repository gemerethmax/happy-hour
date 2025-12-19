# Happy Hour Swipe 🍻

A Tinder-style web app for discovering happy hour deals in Atlanta. Swipe through happy hours, filter by category and day, and save your favorites to a weekly calendar view.

## Tech Stack

**PERN Stack:**
- **PostgreSQL**: Database with normalized schema
- **Express**: RESTful API with JWT authentication
- **React 19**: Frontend with React Router
- **Node.js**: Backend runtime

**Key Libraries:**
- `bcrypt`: Password hashing
- `jsonwebtoken`: Authentication tokens
- `cookie-parser`: Secure httpOnly cookies
- Vite: Fast build tool and dev server

## Features

✅ **Authentication**: Secure signup/login with JWT tokens in httpOnly cookies
✅ **Swipe Interface**: Tinder-style card UI with flip animation
✅ **Filtering**: Filter by category (wings, oysters, drinks, meal specials) and day of week
✅ **Save Favorites**: Mark happy hours as "interested" and view them grouped by day
✅ **Retro Styling**: 60s/70s inspired design with neon blue effects
✅ **Responsive**: Mobile-friendly design

## Local Development Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/happy-hour.git
cd happy-hour
```

### 2. Database Setup
```bash
# Create database
createdb happy_hour_db

# Run schema
psql -d happy_hour_db -f server/src/db/schema.sql

# Seed data
psql -d happy_hour_db -f server/src/db/seed.sql
```

### 3. Backend Setup
```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Start server
npm start
# Server runs on http://localhost:3000
```

### 4. Frontend Setup
```bash
cd client
npm install

# Create .env file (optional, defaults to localhost:3000)
cp .env.example .env

# Start dev server
npm run dev
# Client runs on http://localhost:5173
```

### 5. Test the App
- Visit http://localhost:5173
- Sign up for an account
- Start swiping through happy hours!

## Environment Variables

### Backend (`server/.env`)
```
DATABASE_URL=postgresql://username:password@localhost:5432/happy_hour_db
JWT_SECRET=your-secret-key-here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
PORT=3000
```

### Frontend (`client/.env`)
```
VITE_API_URL=http://localhost:3000/api
```

## Database Schema

**Tables:**
- `users`: User accounts with hashed passwords
- `restaurants`: Restaurant information
- `happy_hours`: Happy hour deals with scheduling and tags
- `user_interests`: Junction table for saved happy hours

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify` - Verify session

### Happy Hours
- `GET /api/happy-hours` - Get all happy hours (supports `?tag=wings&day=1` filters)
- `GET /api/happy-hours/:id` - Get single happy hour

### Interests
- `GET /api/interests` - Get user's saved happy hours
- `POST /api/interests` - Save a happy hour
- `DELETE /api/interests/:id` - Remove saved happy hour

## Deployment (Render)

### 1. Database (PostgreSQL)
1. Create PostgreSQL instance on Render
2. Run `schema.sql` and `seed.sql` in Render database shell
3. Copy the Internal Database URL

### 2. Backend (Web Service)
1. Create new Web Service on Render
2. Connect to GitHub repo
3. Build Command: `cd server && npm install`
4. Start Command: `cd server && npm start`
5. Environment Variables:
   - `DATABASE_URL`: (from step 1)
   - `JWT_SECRET`: (generate random string)
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: (add after frontend deploys)

### 3. Frontend (Static Site)
1. Create new Static Site on Render
2. Connect to GitHub repo
3. Build Command: `cd client && npm install && npm run build`
4. Publish Directory: `client/dist`
5. Environment Variable:
   - `VITE_API_URL`: `https://your-backend.onrender.com/api`

### 4. Update Backend CORS
- Add your frontend URL to backend's `CLIENT_URL` environment variable
- Redeploy backend

## Project Structure

```
happy-hour/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Route pages
│   │   ├── context/     # Auth context
│   │   ├── utils/       # API utilities
│   │   └── styles/      # CSS files
│   └── package.json
│
├── server/              # Express backend
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth middleware
│   │   └── db/          # Database config & schemas
│   └── package.json
│
└── README.md
```

## Future Enhancements

- 🗺️ Map integration for restaurant locations
- 📱 Native mobile app (React Native)
- 🏪 Restaurant owner portal for managing their own happy hours
- 📊 Analytics dashboard
- ⭐ Reviews and ratings
- 🔔 Push notifications for favorite restaurants

## License

MIT

---

Built with ❤️ as a PERN stack capstone project
