import React, { useState } from 'react';
import VideoPlayer from './components/VideoPlayer';
import ProgressTracker from './components/ProgressTracker';
import VideoInput from './components/VideoInput';
import './App.css';

function App() {
  const [watchingIntervals, setWatchingIntervals] = useState([]);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const handleProgressUpdate = (intervals) => {
    setWatchingIntervals(intervals);
  };

  const handleDurationUpdate = (duration) => {
    setVideoDuration(duration);
  };

  const handleVideoSubmit = (url) => {
    setVideoUrl(url);
    setIsVideoLoaded(true);
    // Reset progress when loading new video
    setWatchingIntervals([]);
    setVideoDuration(0);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Lecture Progress Tracker</h1>
      </header>
      <main>
        {!isVideoLoaded ? (
          <VideoInput onSubmit={handleVideoSubmit} />
        ) : (
          <>
            <VideoPlayer 
              videoUrl={videoUrl}
              onProgressUpdate={handleProgressUpdate}
              onDurationUpdate={handleDurationUpdate}
            />
            <ProgressTracker 
              intervals={watchingIntervals}
              duration={videoDuration}
            />
            <button 
              className="change-video-btn"
              onClick={() => setIsVideoLoaded(false)}
            >
              Change Video
            </button>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
