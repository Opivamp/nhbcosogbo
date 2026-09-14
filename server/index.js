const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse JSON and form bodies
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve static uploads
const uploadsDir = path.resolve('C:/Users/Acer/.gemini/antigravity/scratch/nhbc-osogbo/public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Mount Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api', require('./routes/public'));
app.use('/api', require('./routes/prayer'));
app.use('/api', require('./routes/contact'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'New Heritage Baptist Church (NHBC Osogbo) API',
    timestamp: new Date().toISOString()
  });
});

// Serve client production build if present
const clientDist = path.resolve('C:/Users/Acer/.gemini/antigravity/scratch/nhbc-osogbo/client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(clientDist, 'index.html'));
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected server error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`NHBC Osogbo Server running on http://localhost:${PORT}`);
});
