# CRUD Application

A full-stack CRUD (Create, Read, Update, Delete) application built with React.js on the frontend and Express.js with MongoDB on the backend.

## Project Structure
```
.
├── backend/           # Express.js API server
└── forntend-react/    # React.js frontend with Tailwind CSS
```

## Features
- User management (Create, Read, Update, Delete)
- Responsive UI with Tailwind CSS
- Form validation
- RESTful API design
- MongoDB integration

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or cloud instance)
- npm or yarn package manager

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with your MongoDB URI:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm run server
   ```

   The server will start on `http://localhost:5000` by default.

   Available endpoints:
   - `GET /` - API root
   - `GET /health` - Health check
   - `GET /api/users` - Get all users
   - `GET /api/users/:id` - Get user by ID
   - `POST /api/users` - Create new user
   - `PUT /api/users/:id` - Update user
   - `DELETE /api/users/:id` - Delete user

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd forntend-react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000` by default.

## Usage

1. Make sure both backend and frontend servers are running
2. Open your browser and navigate to `http://localhost:3000`
3. Use the application to manage users through the intuitive UI

## Development

### Backend Scripts
- `npm run server` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Run seed script to populate database with sample data

### Frontend Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests