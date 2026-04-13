import 'dotenv/config';
import app from './app';
import db from './db';
import logger from './logger';

const PORT = parseInt(process.env.PORT ?? '3000', 10);

async function start(): Promise<void> {
  logger.info('Running database migrations...');
  await db.migrate.latest();
  logger.info('Migrations complete');

  const server = app.listen(PORT, () => {
    logger.info({ port: PORT }, 'Server started');
  });

  const shutdown = (signal: string): void => {
    logger.info({ signal }, 'Shutting down gracefully...');
    server.close(async () => {
      await db.destroy();
      logger.info('Server closed');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

start().catch((err: unknown) => {
  logger.fatal({ err }, 'Startup failed');
  process.exit(1);
});
