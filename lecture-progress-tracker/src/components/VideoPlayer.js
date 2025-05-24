import React, { useState, useEffect, useRef } from 'react';
import './VideoPlayer.css';

const VideoPlayer = ({ videoUrl, onProgressUpdate, onDurationUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [watchingIntervals, setWatchingIntervals] = useState([]);
  const [error, setError] = useState(null);
  const playerRef = useRef(null);
  const intervalStartRef = useRef(null);
  const timeUpdateIntervalRef = useRef(null);

  // Function to extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Initialize YouTube player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      const videoId = getYouTubeVideoId(videoUrl);
      if (!videoId) {
        setError('Invalid YouTube URL. Please provide a valid YouTube video URL.');
        return;
      }

      playerRef.current = new window.YT.Player('youtube-player', {
        height: '360',
        width: '640',
        videoId: videoId,
        playerVars: {
          'playsinline': 1,
          'controls': 1
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange,
          'onError': onPlayerError
        }
      });
    };

    return () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoUrl]);

  const onPlayerReady = (event) => {
    const duration = event.target.getDuration();
    setDuration(duration);
    onDurationUpdate(duration); // Notify parent component about duration
    console.log('Video duration:', duration);
  };

  const onPlayerStateChange = (event) => {
    // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      intervalStartRef.current = event.target.getCurrentTime();
      
      // Start time update interval
      timeUpdateIntervalRef.current = setInterval(() => {
        if (playerRef.current && playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING) {
          const currentTime = playerRef.current.getCurrentTime();
          setCurrentTime(currentTime);
          console.log('Current time:', currentTime);
        }
      }, 1000);
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }
      
      if (intervalStartRef.current !== null) {
        const newInterval = {
          start: intervalStartRef.current,
          end: event.target.getCurrentTime()
        };
        setWatchingIntervals(prev => [...prev, newInterval]);
        onProgressUpdate([...watchingIntervals, newInterval]);
      }
    } else if (event.data === window.YT.PlayerState.ENDED) {
      setIsPlaying(false);
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }
      
      if (intervalStartRef.current !== null) {
        const newInterval = {
          start: intervalStartRef.current,
          end: event.target.getDuration()
        };
        setWatchingIntervals(prev => [...prev, newInterval]);
        onProgressUpdate([...watchingIntervals, newInterval]);
      }
    }
  };

  const onPlayerError = (event) => {
    let errorMessage = 'Error loading video. ';
    switch (event.data) {
      case 2:
        errorMessage += 'Invalid video ID.';
        break;
      case 5:
        errorMessage += 'HTML5 player error.';
        break;
      case 100:
        errorMessage += 'Video not found or has been removed.';
        break;
      case 101:
      case 150:
        errorMessage += 'Video embedding not allowed.';
        break;
      default:
        errorMessage += 'Please check if the video URL is correct and accessible.';
    }
    setError(errorMessage);
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  if (error) {
    return (
      <div className="video-error">
        <p>{error}</p>
        <p className="error-tip">Tips:</p>
        <ul>
          <li>Make sure the YouTube video URL is correct</li>
          <li>Check if the video is publicly accessible</li>
          <li>Try using a different YouTube video URL</li>
          <li>Make sure the video allows embedding</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="video-player">
      <div id="youtube-player"></div>
      <div className="video-controls">
        <button onClick={togglePlay}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <div className="progress-info">
          <span>Current Time: {Math.floor(currentTime)}s</span>
          <span>Duration: {Math.floor(duration)}s</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 