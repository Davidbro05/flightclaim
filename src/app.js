const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const pinoHttp = require('pino-http');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');

const logger = require('./logger');
const db = require('./db');
const claimsRouter = require('./routes/claims');
const adminApiRouter = require('./routes/adminApi');
const articlesApiRouter = require('./routes/articlesApi');
const navApiRouter = require('./routes/navApi');
const documentsRouter = require('./routes/documents');
const contentRouter = require('./routes/content');
const siteLocals = require('./middleware/siteLocals');

const app = express();

// EJS + layout setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(ejsLayouts);
app.set('layout', 'layout');

app.set('trust proxy', true);

// Security headers — allow CDN (signature pad) and Google Fonts used by frontend
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
        fontSrc: ["'self'", 'fonts.gstatic.com'],
        scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
      },
    },
  })
);

// HTTP request logging
app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === '/health' } }));

// Body parsing — 5 MB limit to accommodate base64 signature images
app.use(express.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

// Inject shared template locals (navItems, siteUrl, currentYear, assetVersion, currentPath)
app.use(siteLocals);

// Health check — used by Docker HEALTHCHECK and Portainer
app.get('/health', async (req, res) => {
  try {
    await db.raw('SELECT 1');
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    logger.error({ err }, 'Health check DB query failed');
    res.status(503).json({ status: 'error', db: 'disconnected', timestamp: new Date().toISOString() });
  }
});

// API + form routes
app.use('/submit', claimsRouter);
app.use('/api/admin', adminApiRouter);
app.use('/api/articles', articlesApiRouter);
app.use('/api/nav', navApiRouter);
app.use('/fullmakt', documentsRouter);

// Serve React admin SPA — must come before content catch-all
const adminBuildDir = path.join(__dirname, '../public/admin');
app.use('/admin', express.static(adminBuildDir));
app.get(['/admin', '/admin/*splat'], (_req, res) => {
  res.sendFile(path.join(adminBuildDir, 'index.html'));
});

// Public SSR pages — must come before express.static so / is not intercepted by index.html
app.use('/', contentRouter);

// Static files (CSS, JS, images) — after content router
app.use(express.static(path.join(__dirname, '../public')));

// 404 handler
app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Sidan hittades inte | FlightClaim' });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error({ err }, 'Unhandled error');
  res.status(500).send('Ett oväntat fel uppstod.');
});

module.exports = app;
