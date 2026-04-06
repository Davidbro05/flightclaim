require('dotenv').config();

const app = require('./app');
const db = require('./db');
const logger = require('./logger');

const PORT = process.env.PORT || 3000;

async function start() {
  // Run pending migrations on startup
  logger.info('Running database migrations...');
  await db.migrate.latest();
  logger.info('Migrations complete');

  const server = app.listen(PORT, () => {
    logger.info({ port: PORT }, 'Server started');
  });

  const shutdown = (signal) => {
    logger.info({ signal }, 'Shutting down gracefully...');
    server.close(async () => {
      await db.destroy();
      logger.info('Server closed');
      process.exit(0);
    });

    // Force exit if graceful shutdown takes too long
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start().catch((err) => {
  logger.fatal({ err }, 'Startup failed');
  process.exit(1);
});
