import React, { useEffect, useState, useRef } from 'react';
import { saveProgress, loadProgress, getLastPosition } from '../services/progressService';
import './ProgressTracker.css';

const ProgressTracker = ({ videoId = 'lecture1' }) => {
  const [intervals, setIntervals] = useState([]);
  const [progress, setProgress] = useState(0);
  const [totalWatched, setTotalWatched] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const lastTimeRef = useRef(0);
  const watchStartTimeRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Hardcoded video URL (using a sample video)
  const videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  // Function to merge overlapping intervals
  const mergeIntervals = (intervals) => {
    if (intervals.length === 0) return [];
    
    // Sort intervals by start time
    const sortedIntervals = [...intervals].sort((a, b) => a.start - b.start);
    const merged = [sortedIntervals[0]];
    
    for (let i = 1; i < sortedIntervals.length; i++) {
      const current = sortedIntervals[i];
      const previous = merged[merged.length - 1];
      
      if (current.start <= previous.end) {
        // Intervals overlap, merge them
        previous.end = Math.max(previous.end, current.end);
      } else {
        // No overlap, add new interval
        merged.push(current);
      }
    }
    
    return merged;
  };

  // Function to calculate total unique watch time
  const calculateTotalWatchTime = (intervals) => {
    const merged = mergeIntervals(intervals);
    return Math.max(0, merged.reduce((total, interval) => {
      // Ensure interval duration is not negative
      const duration = Math.max(0, interval.end - interval.start);
      return total + duration;
    }, 0));
  };

  // Load saved progress when component mounts
  useEffect(() => {
    const savedProgress = loadProgress(videoId);
    if (savedProgress) {
      setIntervals(savedProgress.intervals || []);
      if (videoRef.current) {
        videoRef.current.currentTime = savedProgress.lastPosition || 0;
      }
    }
  }, [videoId]);

  // Save progress periodically
  const saveProgressToStorage = () => {
    if (videoRef.current) {
      saveProgress(videoId, {
        intervals,
        lastPosition: videoRef.current.currentTime,
        progress,
        totalWatched
      });
    }
  };

  // Handle video play
  const handlePlay = () => {
    setIsPlaying(true);
    watchStartTimeRef.current = videoRef.current.currentTime;
  };

  // Handle video pause
  const handlePause = () => {
    if (watchStartTimeRef.current !== null) {
      const endTime = videoRef.current.currentTime;
      // Ensure start time is not greater than end time
      const startTime = Math.min(watchStartTimeRef.current, endTime);
      const newInterval = {
        start: startTime,
        end: endTime
      };
      
      setIntervals(prev => [...prev, newInterval]);
      watchStartTimeRef.current = null;
      saveProgressToStorage();
    }
    setIsPlaying(false);
  };

  // Handle video seeking
  const handleSeeked = () => {
    if (isPlaying && watchStartTimeRef.current !== null) {
      const endTime = lastTimeRef.current;
      // Ensure start time is not greater than end time
      const startTime = Math.min(watchStartTimeRef.current, endTime);
      const newInterval = {
        start: startTime,
        end: endTime
      };
      
      setIntervals(prev => [...prev, newInterval]);
      watchStartTimeRef.current = videoRef.current.currentTime;
      saveProgressToStorage();
    }
  };

  // Update progress and total watched time
  useEffect(() => {
    const uniqueWatchTime = calculateTotalWatchTime(intervals);
    setTotalWatched(uniqueWatchTime);
    
    if (videoRef.current) {
      const progressPercentage = (uniqueWatchTime / videoRef.current.duration) * 100;
      // Ensure progress is between 0 and 100
      setProgress(Math.min(100, Math.max(0, progressPercentage)));
    }

    // Debounce saving progress
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(saveProgressToStorage, 1000);
  }, [intervals]);

  // Update last known time
  useEffect(() => {
    const updateTime = () => {
      if (videoRef.current) {
        lastTimeRef.current = videoRef.current.currentTime;
      }
    };

    const interval = setInterval(updateTime, 1000);
    return () => {
      clearInterval(interval);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="progress-tracker">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        onPlay={handlePlay}
        onPause={handlePause}
        onSeeked={handleSeeked}
        className="video-player"
      />
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${Math.max(0, progress)}%` }}
        />
      </div>
      <div className="progress-stats">
        <div className="stat">
          <span className="label">Progress:</span>
          <span className="value">{Math.max(0, progress).toFixed(1)}%</span>
        </div>
        <div className="stat">
          <span className="label">Unique Watch Time:</span>
          <span className="value">{Math.max(0, Math.floor(totalWatched))}s</span>
        </div>
        <div className="stat">
          <span className="label">Total Duration:</span>
          <span className="value">{videoRef.current ? Math.max(0, Math.floor(videoRef.current.duration)) : 0}s</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;