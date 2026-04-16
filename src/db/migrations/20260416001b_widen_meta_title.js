// meta_title was defined as VARCHAR(60) which is too short for airline article titles.
// This migration widens it to TEXT on PostgreSQL. SQLite already ignores length constraints.
exports.up = async function (knex) {
  if (knex.client.config.client === 'pg') {
    await knex.raw('ALTER TABLE articles ALTER COLUMN meta_title TYPE TEXT');
  }
};

exports.down = async function (knex) {
  if (knex.client.config.client === 'pg') {
    await knex.raw('ALTER TABLE articles ALTER COLUMN meta_title TYPE VARCHAR(255)');
  }
};
