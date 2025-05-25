// Service to handle progress persistence
const STORAGE_KEY = 'lecture_progress';

export const saveProgress = (videoId, progress) => {
  try {
    const allProgress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    allProgress[videoId] = {
      ...progress,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
    return true;
  } catch (error) {
    console.error('Error saving progress:', error);
    return false;
  }
};

export const loadProgress = (videoId) => {
  try {
    const allProgress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return allProgress[videoId] || null;
  } catch (error) {
    console.error('Error loading progress:', error);
    return null;
  }
};

export const getLastPosition = (videoId) => {
  const progress = loadProgress(videoId);
  return progress ? progress.lastPosition : 0;
};

export const getWatchedIntervals = (videoId) => {
  const progress = loadProgress(videoId);
  return progress ? progress.intervals : [];
}; 