'use strict';

exports.up = async function (knex) {
  await knex.schema.createTable('authors', (table) => {
    table.increments('id').primary();
    table.string('slug').notNullable().unique();
    table.string('name').notNullable();
    table.string('role').nullable();
    table.string('credentials').nullable();
    table.text('bio').nullable();
    table.string('image_url').nullable();
    table.string('email').nullable();
    table.string('linkedin_url').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index('slug');
  });

  await knex.schema.alterTable('articles', (table) => {
    table.integer('author_id').unsigned().nullable().references('id').inTable('authors').onDelete('SET NULL');
    table.index('author_id');
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable('articles', (table) => {
    table.dropColumn('author_id');
  });
  await knex.schema.dropTableIfExists('authors');
};
