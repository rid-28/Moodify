const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // Allow all origins; restrict in production!
const PORT = process.env.PORT || 3020;

// Secure YT API proxy route
app.get('/yt', async (req, res) => {
  const { q } = req.query; // Example: /yt?q=chill+lofi+playlist
  const YT_API_KEY = process.env.YT_API_KEY;
  if (!q) return res.status(400).json({error: 'Missing search query'});

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist&q=${encodeURIComponent(q)}&maxResults=5&key=${YT_API_KEY}`;
  try {
    const ytRes = await fetch(url);
    const data = await ytRes.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({error: 'YouTube API error'});
  }
});

app.listen(PORT, () => {
  console.log(`Moodify API backend running on http://localhost:${PORT}`);
});
