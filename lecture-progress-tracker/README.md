# Lecture Progress Tracker

A React-based application that accurately tracks video lecture progress by monitoring unique watch time. This tool ensures that only genuinely watched content is counted towards progress, preventing false progress indicators from skipping or re-watching content.

## Features

### Accurate Progress Tracking
- **Unique Watch Time**: Only counts new content watched, not re-watched segments
- **Interval Merging**: Automatically merges overlapping watch intervals
- **Skip Prevention**: Doesn't count progress for skipped segments
- **Non-negative Values**: Ensures progress and watch time are never negative

### Progress Persistence
- Saves watch intervals and progress to localStorage
- Resumes from last watched position
- Maintains progress across browser sessions

### User Interface
- Clean, modern design with progress bar
- Real-time progress updates
- Displays:
  - Progress percentage
  - Unique watch time in seconds
  - Total video duration

## Technical Implementation

### Core Functionality
1. **Watch Interval Tracking**
   - Records start and end times of watched segments
   - Handles play, pause, and seek events
   - Prevents double-counting of watched content

2. **Progress Calculation**
   - Merges overlapping intervals
   - Calculates total unique watch time
   - Converts to percentage based on video duration

3. **Edge Case Handling**
   - Manages seeking and skipping
   - Handles re-watching of content
   - Ensures non-negative progress values

### Key Components
- `ProgressTracker.js`: Main component handling video playback and progress tracking
- `progressService.js`: Manages progress persistence using localStorage

## Usage

```jsx
import ProgressTracker from './components/ProgressTracker';

// In your app
<ProgressTracker videoId="unique-video-id" />
```

## Dependencies
- React
- No additional external dependencies required

## Browser Support
- Works in all modern browsers that support HTML5 video and localStorage

## Note
This implementation focuses on accurate progress tracking and does not include video hosting or streaming functionality. It uses a sample video URL for demonstration purposes.
