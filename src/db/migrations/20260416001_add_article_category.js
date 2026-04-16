exports.up = async function (knex) {
  const hasCol = await knex.schema.hasColumn('articles', 'category');
  if (!hasCol) {
    await knex.schema.alterTable('articles', (table) => {
      table.string('category').nullable();
    });
  }
};

exports.down = function (knex) {
  return knex.schema.alterTable('articles', (table) => {
    table.dropColumn('category');
  });
};
