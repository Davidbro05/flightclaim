'use strict';

exports.up = async function (knex) {
  await knex.schema.createTable('routes', (table) => {
    table.increments('id').primary();
    table.string('slug', 100).notNullable().unique();       // stockholm-london
    table.string('dep_city', 100).notNullable();            // Stockholm
    table.string('arr_city', 100).notNullable();            // London
    table.string('dep_airport', 10).notNullable();          // ARN
    table.string('arr_airport', 100).notNullable();         // LHR/LGW/STN (may list multiple)
    table.string('distance_km', 20).nullable();             // e.g. "1 760"
    table.string('comp_amount', 10).nullable();             // e.g. "400"
    table.text('airlines').nullable();                       // JSON string array
    table.text('meta_title').nullable();
    table.text('meta_desc').nullable();
    table.boolean('published').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('routes');
};