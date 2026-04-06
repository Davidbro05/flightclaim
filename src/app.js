const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const pinoHttp = require('pino-http');
const path = require('path');

const logger = require('./logger');
const db = require('./db');
const claimsRouter = require('./routes/claims');
const adminApiRouter = require('./routes/adminApi');
const documentsRouter = require('./routes/documents');

const app = express();

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
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

// Static files (frontend)
app.use(express.static(path.join(__dirname, '../public')));

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

app.use('/submit', claimsRouter);
app.use('/api/admin', adminApiRouter);
app.use('/fullmakt', documentsRouter);

// Serve React admin SPA — must come after API routes
const adminBuildDir = path.join(__dirname, '../public/admin');
app.use('/admin', express.static(adminBuildDir));
app.get(['/admin', '/admin/*splat'], (_req, res) => {
  res.sendFile(path.join(adminBuildDir, 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error({ err }, 'Unhandled error');
  res.status(500).send('Ett oväntat fel uppstod.');
});

module.exports = app;
