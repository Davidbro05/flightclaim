import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import path from 'path';

import ejsLayouts from 'express-ejs-layouts';

import logger from './logger';
import db from './db';
import claimsRouter from './routes/claims';
import adminRouter from './routes/admin';
import adminApiRouter from './routes/adminApi';
import articlesApiRouter from './routes/articlesApi';
import navApiRouter from './routes/navApi';
import documentsRouter from './routes/documents';
import contentRouter from './routes/content';
import siteLocals from './middleware/siteLocals';

const app = express();

// EJS + layout setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(ejsLayouts);
app.set('layout', 'layout');

app.set('trust proxy', true);

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

app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === '/health' } }));

app.use(express.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

app.use(siteLocals);

app.get('/health', async (_req, res) => {
  try {
    await db.raw('SELECT 1');
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    logger.error({ err }, 'Health check DB query failed');
    res.status(503).json({ status: 'error', db: 'disconnected', timestamp: new Date().toISOString() });
  }
});

app.use('/submit', claimsRouter);
app.use('/admin', adminRouter);
app.use('/api/admin', adminApiRouter);
app.use('/api/articles', articlesApiRouter);
app.use('/api/nav', navApiRouter);
app.use('/fullmakt', documentsRouter);

const adminBuildDir = path.join(__dirname, '../public/admin');
app.use('/admin', express.static(adminBuildDir));
app.get(['/admin', '/admin/*splat'], (_req, res) => {
  res.sendFile(path.join(adminBuildDir, 'index.html'));
});

app.use(express.static(path.join(__dirname, '../public')));
app.use('/', contentRouter);

app.use((_req, res) => {
  res.status(404).render('pages/404', { title: 'Sidan hittades inte | FlightClaim' });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ err }, 'Unhandled error');
  res.status(500).send('Ett oväntat fel uppstod.');
});

export default app;
