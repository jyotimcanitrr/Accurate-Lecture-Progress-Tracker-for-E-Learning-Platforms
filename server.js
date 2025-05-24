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
  totalProgress: Number,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const Progress = mongoose.model('Progress', progressSchema);

app.post('/api/progress', async (req, res) => {
  try {
    const { userId, videoId, watchedIntervals, lastPosition, totalProgress } = req.body;
    
    const progress = await Progress.findOneAndUpdate(
      { userId, videoId },
      {
        watchedIntervals,
        lastPosition,
        totalProgress,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/progress/:userId/:videoId', async (req, res) => {
  try {
    const { userId, videoId } = req.params;
    const progress = await Progress.findOne({ userId, videoId });
    res.json(progress || { watchedIntervals: [], lastPosition: 0, totalProgress: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 