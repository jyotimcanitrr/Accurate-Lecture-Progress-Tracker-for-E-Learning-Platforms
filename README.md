# Lecture Progress Tracker

An accurate lecture progress tracking system for e-learning platforms that tracks unique video viewing segments and prevents progress inflation from skipping or rewatching.

## Features

- Tracks unique video segments watched by users
- Prevents progress inflation from skipping or rewatching
- Saves and resumes video progress
- Real-time progress updates
- Persistent storage of viewing history

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd lecture-progress-tracker
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
```

4. Create a `.env` file in the root directory with the following content:
```
MONGODB_URI=mongodb://localhost:27017/lecture-tracker
PORT=5000
```

5. Start MongoDB service on your machine

## Running the Application

1. Start the backend server:
```bash
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd client
npm start
```

The application will be available at `http://localhost:3000`

## How It Works

1. The system tracks video segments watched by users using start and end timestamps
2. When a user watches a video:
   - New segments are recorded
   - Overlapping segments are merged
   - Progress is calculated based on unique segments watched
3. Progress is saved periodically and can be resumed when the user returns

## Technical Details

- Frontend: React with Material-UI
- Backend: Node.js with Express
- Database: MongoDB
- Video Player: ReactPlayer

## Contributing

Feel free to submit issues and enhancement requests!