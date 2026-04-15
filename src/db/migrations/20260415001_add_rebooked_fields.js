exports.up = function (knex) {
  return knex.schema.alterTable('claims', (table) => {
    table.string('original_route').nullable();
    table.string('new_route').nullable();
    table.string('change_notice').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('claims', (table) => {
    table.dropColumn('original_route');
    table.dropColumn('new_route');
    table.dropColumn('change_notice');
  });
};
