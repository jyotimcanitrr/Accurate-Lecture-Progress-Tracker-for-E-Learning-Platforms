import React, { useEffect, useState, useRef } from 'react';
import './ProgressTracker.css';

const ProgressTracker = ({ intervals, duration }) => {
  const [progress, setProgress] = useState(0);
  const [totalWatched, setTotalWatched] = useState(0);
  const previousTotalRef = useRef(0);

  useEffect(() => {
    // Calculate new watch duration from the latest interval
    const newWatchDuration = intervals.length > 0 
      ? intervals[intervals.length - 1].end - intervals[intervals.length - 1].start 
      : 0;

    // Add new watch duration to previous total
    const newTotal = previousTotalRef.current + newWatchDuration;
    previousTotalRef.current = newTotal;
    
    setTotalWatched(newTotal);
    
    // Calculate progress percentage based on cumulative watched time
    const progressPercentage = duration ? (newTotal / duration) * 100 : 0;
    setProgress(progressPercentage);
  }, [intervals, duration]);

  return (
    <div className="progress-tracker">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="progress-stats">
        <div className="stat">
          <span className="label">Progress:</span>
          <span className="value">{progress.toFixed(1)}%</span>
        </div>
        <div className="stat">
          <span className="label">Total Watched:</span>
          <span className="value">{Math.floor(totalWatched)}s</span>
        </div>
        <div className="stat">
          <span className="label">Total Duration:</span>
          <span className="value">{Math.floor(duration)}s</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker; 