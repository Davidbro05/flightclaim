exports.up = async function (knex) {
  await knex.schema.createTable('nav_items', (table) => {
    table.increments('id').primary();
    table.string('label').notNullable();
    table.string('url').notNullable();
    table.integer('parent_id').unsigned().nullable().references('id').inTable('nav_items').onDelete('CASCADE');
    table.integer('sort_order').notNullable().defaultTo(0);

    table.index('parent_id');
    table.index('sort_order');
  });

  // Seed default nav structure
  // insert() returns [id] on SQLite but rowCount on PostgreSQL — query back to get id safely
  async function insertAndGetId(row) {
    await knex('nav_items').insert(row);
    const inserted = await knex('nav_items').where({ url: row.url }).first();
    return inserted.id;
  }

  // Top-level items first (no parent)
  const forseningId = await insertAndGetId({ label: 'Försenat flyg', url: '/forsening', sort_order: 1 });
  const installtId  = await insertAndGetId({ label: 'Inställt flyg', url: '/installda-flyg', sort_order: 2 });
  const flygbolagId = await insertAndGetId({ label: 'Flygbolag', url: '/flygbolag', sort_order: 3 });
  await knex('nav_items').insert({ label: 'Blogg', url: '/blogg', sort_order: 4 });
  await knex('nav_items').insert({ label: 'Ansök nu', url: '/anmalan', sort_order: 5 });

  // Försenat flyg — children
  await knex('nav_items').insert([
    { label: 'Hur mycket har du rätt till?', url: '/forsening/hur-mycket',       parent_id: forseningId, sort_order: 1 },
    { label: 'Hur lång försening krävs?',    url: '/forsening/tidsgrans',         parent_id: forseningId, sort_order: 2 },
    { label: 'Extraordinära omständigheter', url: '/forsening/anmarkningsvarda',  parent_id: forseningId, sort_order: 3 },
    { label: 'Vad behöver du spara?',        url: '/forsening/bevisning',         parent_id: forseningId, sort_order: 4 },
  ]);

  // Inställt flyg — children
  await knex('nav_items').insert([
    { label: 'Ombokning och rättigheter',    url: '/installda-flyg/ombokat',       parent_id: installtId, sort_order: 1 },
    { label: 'Sent besked — tappar du rätten?', url: '/installda-flyg/sent-besked', parent_id: installtId, sort_order: 2 },
    { label: 'Mat, hotell och transport',    url: '/installda-flyg/mat-hotell',    parent_id: installtId, sort_order: 3 },
    { label: 'Force majeure och undantag',   url: '/installda-flyg/force-majeure', parent_id: installtId, sort_order: 4 },
  ]);

  // Flygbolag — children
  await knex('nav_items').insert([
    { label: 'SAS',       url: '/flygbolag/sas',      parent_id: flygbolagId, sort_order: 1 },
    { label: 'Ryanair',   url: '/flygbolag/ryanair',  parent_id: flygbolagId, sort_order: 2 },
    { label: 'Norwegian', url: '/flygbolag/norwegian', parent_id: flygbolagId, sort_order: 3 },
    { label: 'Wizz Air',  url: '/flygbolag/wizz-air', parent_id: flygbolagId, sort_order: 4 },
  ]);
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('nav_items');
};
