exports.up = async function (knex) {
  // Skip if the table was created by the legacy server.js setup
  const exists = await knex.schema.hasTable('claims');
  if (exists) return;

  return knex.schema.createTable('claims', (table) => {
    table.increments('id').primary();
    table.string('namn').notNullable();
    table.string('street').notNullable();
    table.string('zip').notNullable();
    table.string('city').notNullable();
    table.string('email').notNullable();
    table.string('phone').notNullable();
    table.string('flightNumber').notNullable();
    table.string('airline').notNullable();
    table.string('bookingReference');
    table.string('departureAirport').notNullable();
    table.string('arrivalAirport').notNullable();
    table.string('flightDate').notNullable();
    table.string('issue').notNullable();
    table.text('signature');
    table.string('ip_address');
    table.boolean('terms_accepted').defaultTo(false);
    table.string('affiliate_code').defaultTo('main');
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index('affiliate_code');
    table.index('created_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('claims');
};
