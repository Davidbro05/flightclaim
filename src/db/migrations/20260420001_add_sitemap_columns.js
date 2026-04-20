'use strict';

exports.up = async function (knex) {
  await knex.schema.table('articles', (table) => {
    table.string('sitemap_priority').nullable();
    table.string('sitemap_changefreq').nullable();
  });
};

exports.down = async function (knex) {
  await knex.schema.table('articles', (table) => {
    table.dropColumn('sitemap_priority');
    table.dropColumn('sitemap_changefreq');
  });
};
