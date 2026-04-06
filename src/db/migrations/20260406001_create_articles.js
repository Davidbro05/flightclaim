exports.up = async function (knex) {
  await knex.schema.createTable('articles', (table) => {
    table.increments('id').primary();
    table.enu('type', ['guide', 'airline', 'blog']).notNullable();
    table.enu('status', ['draft', 'published']).notNullable().defaultTo('draft');
    table.string('slug').notNullable().unique();
    table.string('parent_slug').nullable();
    table.string('title').notNullable();
    table.string('meta_title', 60).nullable();
    table.string('meta_desc', 160).nullable();
    table.text('content').nullable();
    table.enu('schema_type', ['FAQPage', 'Article', 'none']).notNullable().defaultTo('none');
    table.json('faq_json').nullable();
    table.string('affiliate_ref').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index('slug');
    table.index('status');
    table.index('type');
    table.index('parent_slug');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('articles');
};
