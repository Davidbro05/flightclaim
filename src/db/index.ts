import knex from 'knex';
import path from 'path';

const migrationsDir = path.join(__dirname, 'migrations');

const db = knex(
  process.env.NODE_ENV === 'test'
    ? {
        client: 'sqlite3',
        connection: ':memory:',
        useNullAsDefault: true,
        migrations: { directory: migrationsDir },
      }
    : process.env.DATABASE_URL
    ? {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        pool: { min: 2, max: 10 },
        migrations: { directory: migrationsDir },
      }
    : {
        client: 'sqlite3',
        connection: { filename: path.join(__dirname, '../../database.db') },
        useNullAsDefault: true,
        migrations: { directory: migrationsDir },
      }
);

export default db;
