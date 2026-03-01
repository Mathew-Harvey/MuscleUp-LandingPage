/**
 * Express server for Render (and local dev).
 * Serves static files and proxies thank-you API calls to the Muscle Up API
 * (same pattern as Handstand landing: /api/verify-session, /api/create-tracker-user).
 * See LANDING_PAGE_DEVELOPER_PROMPT.md.
 */
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Frontend config: API base URL (and optional Tracker app URL for "Already bought?" link)
const apiBaseUrl = (process.env.MUSCLEUP_API_URL || process.env.API_BASE_URL || '').replace(/\/$/, '');
const trackerAppUrl = (process.env.TRACKER_APP_URL || process.env.TRACKER_LOGIN_URL || '').replace(/\/$/, '');

app.get('/config.js', (req, res) => {
  res.type('application/javascript');
  const escape = (s) => (s || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
  res.send(
    'window.MUSCLEUP_API_URL="' + escape(apiBaseUrl) + '";' +
    'window.TRACKER_APP_URL="' + escape(trackerAppUrl) + '";'
  );
});

// Proxy thank-you API to Muscle Up API (Handstand-style relative URLs)
app.get('/api/verify-session', (req, res) => {
  if (!apiBaseUrl) {
    return res.status(503).json({ error: 'API not configured' });
  }
  const sessionId = req.query.session_id;
  if (!sessionId) {
    return res.status(400).json({ error: 'Missing session_id' });
  }
  const url = apiBaseUrl + '/api/stripe/verify-session?session_id=' + encodeURIComponent(sessionId);
  fetch(url)
    .then((r) => r.json().then((data) => ({ ok: r.ok, status: r.status, data })).catch(() => ({ ok: false, status: r.status, data: {} })))
    .then((result) => {
      res.status(result.ok ? 200 : result.status).json(result.data);
    })
    .catch((err) => {
      console.error('verify-session proxy error:', err);
      res.status(502).json({ error: 'Could not verify session' });
    });
});

app.post('/api/create-tracker-user', express.json(), (req, res) => {
  if (!apiBaseUrl) {
    return res.status(503).json({ error: 'API not configured' });
  }
  const { sessionId, name, email } = req.body || {};
  if (!sessionId || !name || !email) {
    return res.status(400).json({ error: 'Missing sessionId, name, or email' });
  }
  const url = apiBaseUrl + '/api/stripe/complete-signup';
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, name, email }),
  })
    .then((r) => r.text().then((text) => {
      let data;
      try { data = text ? JSON.parse(text) : {}; } catch (e) { data = {}; }
      return { ok: r.ok, status: r.status, data };
    }))
    .then((result) => {
      res.status(result.ok ? 200 : result.status).json(result.data);
    })
    .catch((err) => {
      console.error('create-tracker-user proxy error:', err);
      res.status(502).json({ error: 'Could not create tracker user' });
    });
});

const staticDir = path.join(__dirname);

app.get('/', (req, res) => res.sendFile(path.join(staticDir, 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(staticDir, 'index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(staticDir, 'about.html')));
app.get('/about.html', (req, res) => res.sendFile(path.join(staticDir, 'about.html')));
app.get('/thank-you', (req, res) => res.sendFile(path.join(staticDir, 'thank-you.html')));
app.get('/thank-you.html', (req, res) => res.sendFile(path.join(staticDir, 'thank-you.html')));
app.get('/ebook.html', (req, res) => res.sendFile(path.join(staticDir, 'ebook.html')));

// Alias so /images/* resolves to assets/images/* (e.g. EPUB viewer or legacy paths)
app.use('/images', express.static(path.join(staticDir, 'assets', 'images')));

app.use(express.static(staticDir));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
