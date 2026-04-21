exports.up = async function (knex) {
  await knex.schema.createTable('contact_messages', (t) => {
    t.increments('id').primary();
    t.string('name', 255).notNullable();
    t.string('email', 255).notNullable();
    t.text('message').notNullable();
    t.string('created_at', 30).notNullable();
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('contact_messages');
};
