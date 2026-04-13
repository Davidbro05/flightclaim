exports.up = function (knex) {
  return knex('nav_items')
    .where({ url: '/#ansokan' })
    .update({ url: '/anmalan' });
};

exports.down = function (knex) {
  return knex('nav_items')
    .where({ url: '/anmalan', label: 'Ansök nu' })
    .update({ url: '/#ansokan' });
};
