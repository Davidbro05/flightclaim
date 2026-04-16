exports.up = function (knex) {
  return knex.schema.alterTable('articles', (table) => {
    table.string('category').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('articles', (table) => {
    table.dropColumn('category');
  });
};
