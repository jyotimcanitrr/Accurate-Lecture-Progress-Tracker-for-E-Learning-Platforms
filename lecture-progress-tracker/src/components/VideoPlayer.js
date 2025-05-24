import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Box, LinearProgress, Typography } from '@mui/material';
import axios from 'axios';

const VideoPlayer = ({ videoUrl, userId, videoId }) => {
  const [watchedIntervals, setWatchedIntervals] = useState([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [lastPosition, setLastPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);
  const currentIntervalRef = useRef(null);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        console.log('Loading progress for:', userId, videoId);
        const response = await axios.get(`http://localhost:5000/api/progress/${userId}/${videoId}`);
        console.log('Loaded progress:', response.data);
        if (response.data) {
          setWatchedIntervals(response.data.watchedIntervals || []);
          setLastPosition(response.data.lastPosition || 0);
          setCurrentProgress(response.data.totalProgress || 0);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };
    loadProgress();
  }, [userId, videoId]);

  useEffect(() => {
    const saveProgress = async () => {
      try {
        console.log('Saving progress:', {
          userId,
          videoId,
          watchedIntervals,
          lastPosition,
          totalProgress: currentProgress
        });
        await axios.post('http://localhost:5000/api/progress', {
          userId,
          videoId,
          watchedIntervals,
          lastPosition,
          totalProgress: currentProgress
        });
        console.log('Progress saved successfully');
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    };

    const interval = setInterval(saveProgress, 5000); // Save every 5 seconds
    return () => clearInterval(interval);
  }, [userId, videoId, watchedIntervals, lastPosition, currentProgress]);

  const mergeIntervals = (intervals) => {
    if (intervals.length === 0) return [];
    
    intervals.sort((a, b) => a.start - b.start);
    const merged = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
      const current = intervals[i];
      const previous = merged[merged.length - 1];
      
      if (current.start <= previous.end) {
        previous.end = Math.max(previous.end, current.end);
      } else {
        merged.push(current);
      }
    }
    
    return merged;
  };

  const calculateProgress = (intervals, duration) => {
    if (!duration) return 0;
    const totalWatched = intervals.reduce((acc, interval) => acc + (interval.end - interval.start), 0);
    const progress = (totalWatched / duration) * 100;
    console.log('Calculated progress:', progress, '%');
    return progress;
  };

  const handlePlay = () => {
    console.log('Video started playing');
    setIsPlaying(true);
    currentIntervalRef.current = {
      start: playerRef.current.getCurrentTime(),
      end: playerRef.current.getCurrentTime()
    };
  };

  const handlePause = () => {
    console.log('Video paused');
    setIsPlaying(false);
    if (currentIntervalRef.current) {
      currentIntervalRef.current.end = playerRef.current.getCurrentTime();
      console.log('Current interval:', currentIntervalRef.current);
      const newIntervals = mergeIntervals([...watchedIntervals, currentIntervalRef.current]);
      console.log('Merged intervals:', newIntervals);
      setWatchedIntervals(newIntervals);
      setCurrentProgress(calculateProgress(newIntervals, playerRef.current.getDuration()));
    }
  };

  const handleProgress = (state) => {
    if (isPlaying && currentIntervalRef.current) {
      currentIntervalRef.current.end = state.playedSeconds;
    }
    setLastPosition(state.playedSeconds);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 2 }}>
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        width="100%"
        height="auto"
        controls
        onPlay={handlePlay}
        onPause={handlePause}
        onProgress={handleProgress}
        progressInterval={1000}
        playing={isPlaying}
        initialTime={lastPosition}
      />
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Progress: {currentProgress.toFixed(1)}%
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={currentProgress} 
          sx={{ mt: 1, height: 10, borderRadius: 5 }}
        />
      </Box>
    </Box>
  );
};

export default VideoPlayer; 