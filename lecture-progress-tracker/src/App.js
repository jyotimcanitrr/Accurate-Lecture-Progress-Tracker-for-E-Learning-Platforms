import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import VideoPlayer from './components/VideoPlayer';

function App() {
  // For demo purposes, we're using hardcoded values
  // In a real application, these would come from your authentication system
  const userId = 'user123';
  const videoId = 'video123';
  const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Example video URL

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Lecture Progress Tracker
        </Typography>
        <VideoPlayer
          videoUrl={videoUrl}
          userId={userId}
          videoId={videoId}
        />
      </Box>
    </Container>
  );
}

export default App;
