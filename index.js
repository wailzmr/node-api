const express = require('express');
const path = require('path');
require('./src/db');

const usersRouter = require('./src/routes/users');
const postsRouter = require('./src/routes/posts');

const app = express();
app.use(express.json());

// Routes
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

// Root documentation page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});