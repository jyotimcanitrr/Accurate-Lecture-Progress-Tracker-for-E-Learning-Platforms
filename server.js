const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lecture-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const progressSchema = new mongoose.Schema({
  userId: String,
  videoId: String,
  watchedIntervals: [{
    start: Number,
    end: Number
  }],
  lastPosition: Number,
  totalProgress: Number
});

const Progress = mongoose.model('Progress', progressSchema);

app.post('/api/progress', async (req, res) => {
  try {
    const { userId, videoId, watchedIntervals, lastPosition, totalProgress } = req.body;
    
    let progress = await Progress.findOne({ userId, videoId });
    
    if (progress) {
      progress.watchedIntervals = watchedIntervals;
      progress.lastPosition = lastPosition;
      progress.totalProgress = totalProgress;
    } else {
      progress = new Progress({
        userId,
        videoId,
        watchedIntervals,
        lastPosition,
        totalProgress
      });
    }
    
    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/progress/:userId/:videoId', async (req, res) => {
  try {
    const progress = await Progress.findOne({
      userId: req.params.userId,
      videoId: req.params.videoId
    });
    res.json(progress || { watchedIntervals: [], lastPosition: 0, totalProgress: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 