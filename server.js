/**
 * Express server for Render (and local dev).
 * Serves static files and mounts /api/* routes so everything runs in one service.
 */
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const createCheckout = require('./api/create-checkout');
const verifySession = require('./api/verify-session');
const createTrackerUser = require('./api/create-tracker-user');

app.get('/api/create-checkout', (req, res) => createCheckout(req, res));
app.get('/api/verify-session', (req, res) => verifySession(req, res));
app.post('/api/create-tracker-user', (req, res) => createTrackerUser(req, res));

// Block static serving of API source files (security)
app.use('/api', (req, res, next) => {
  if (path.extname(req.path)) return res.status(404).end();
  next();
});

const staticDir = path.join(__dirname);

app.get('/', (req, res) => res.sendFile(path.join(staticDir, 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(staticDir, 'index.html')));
app.get('/thank-you.html', (req, res) => res.sendFile(path.join(staticDir, 'thank-you.html')));
app.get('/ebook.html', (req, res) => res.sendFile(path.join(staticDir, 'ebook.html')));

// Alias so /images/* resolves to assets/images/* (e.g. EPUB viewer or legacy paths)
app.use('/images', express.static(path.join(staticDir, 'assets', 'images')));

app.use(express.static(staticDir));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
