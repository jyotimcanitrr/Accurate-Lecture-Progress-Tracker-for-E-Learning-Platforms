import React, { useState } from 'react';
import './VideoInput.css';

const VideoInput = ({ onSubmit }) => {
  const [videoUrl, setVideoUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (videoUrl.trim()) {
      onSubmit(videoUrl);
    }
  };

  return (
    <div className="video-input">
      <form onSubmit={handleSubmit}>
        <h2>Enter Video URL</h2>
        <div className="input-group">
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter video URL (e.g., https://example.com/video.mp4)"
            required
          />
          <button type="submit">Load Video</button>
        </div>
      </form>
    </div>
  );
};

export default VideoInput; 