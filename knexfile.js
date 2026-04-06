require('dotenv').config();
const path = require('path');

/** @type {Object.<string, import('knex').Knex.Config>} */
module.exports = {
  development: {
    client: 'sqlite3',
    connection: { filename: './database.db' },
    migrations: { directory: path.join(__dirname, 'src/db/migrations') },
    useNullAsDefault: true,
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: { min: 2, max: 10 },
    migrations: { directory: path.join(__dirname, 'src/db/migrations') },
  },
};
