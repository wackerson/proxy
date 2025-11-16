import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const DEFAULT_FETCH_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5'
};

const fetchWithHeaders = (url, options = {}) => {
  return fetch(url, {
    method: 'GET',
    ...options,
    headers: {
      ...DEFAULT_FETCH_HEADERS,
      ...(options.headers || {})
    }
  });
};

// Proxy endpoint for /api/sports
app.get('/api/sports', async (req, res) => {
  try {
    const response = await fetchWithHeaders('https://streamed.su/api/sports');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching sports:', error);
    res.status(500).json({ error: 'Failed to fetch sports' });
  }
});

// Proxy endpoint for /api/matches/live/popular
app.get('/api/matches/live/popular', async (req, res) => {
  try {
    const response = await fetchWithHeaders('https://streamed.su/api/matches/live/popular');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching live popular matches:', error);
    res.status(500).json({ error: 'Failed to fetch live popular matches' });
  }
});

// Proxy endpoint for /api/matches/live
app.get('/api/matches/live', async (req, res) => {
  try {
    const response = await fetchWithHeaders('https://streamed.su/api/matches/live');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching live matches:', error);
    res.status(500).json({ error: 'Failed to fetch live matches' });
  }
});

// Proxy endpoint for /api/stream/:source/:id
app.get('/api/stream/:source/:id', async (req, res) => {
  try {
    const { source, id } = req.params;
    const response = await fetchWithHeaders(`https://streamed.su/api/stream/${source}/${id}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching stream:', error);
    res.status(500).json({ error: 'Failed to fetch stream' });
  }
});

// Proxy endpoint for /api/matches/:sportId/popular
app.get('/api/matches/:sportId/popular', async (req, res) => {
  try {
    const { sportId } = req.params;
    const response = await fetchWithHeaders(`https://streamed.su/api/matches/${sportId}/popular`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching popular matches for sport:', error);
    res.status(500).json({ error: 'Failed to fetch popular matches for sport' });
  }
});

// Proxy endpoint for /api/matches/:sportId
app.get('/api/matches/:sportId', async (req, res) => {
  try {
    const { sportId } = req.params;
    const response = await fetchWithHeaders(`https://streamed.su/api/matches/${sportId}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching matches for sport:', error);
    res.status(500).json({ error: 'Failed to fetch matches for sport' });
  }
});

// Proxy endpoint for badge images
app.get('/api/images/badge/:badgeId', async (req, res) => {
  try {
    const { badgeId } = req.params;
    const response = await fetchWithHeaders(`https://streamed.su/api/images/badge/${badgeId}`);
    const buffer = await response.buffer();
    res.set('Content-Type', response.headers.get('content-type'));
    res.send(buffer);
  } catch (error) {
    console.error('Error fetching badge image:', error);
    res.status(500).json({ error: 'Failed to fetch badge image' });
  }
});

const PORT = process.env.PROXY_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});

