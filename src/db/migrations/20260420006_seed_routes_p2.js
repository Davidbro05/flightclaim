// 20 additional Swedish flight routes — covering Göteborg, Malmö, and long-haul from ARN.

const NOW = new Date().toISOString();

function route(fields) {
  return Object.assign(
    {
      published: true,
      created_at: NOW,
      updated_at: NOW,
    },
    {
      ...fields,
      airlines: JSON.stringify(fields.airlines),
      meta_title: `Försenat flyg ${fields.dep_city}–${fields.arr_city}? Kräv upp till ${fields.comp_amount === '600' ? '600€' : fields.comp_amount === '400' ? '400€' : '250€'} ersättning | FlightClaim`,
      meta_desc: `Drabbad av försenat eller inställt flyg ${fields.dep_city}–${fields.arr_city}? Du kan ha rätt till upp till ${fields.comp_amount}€ per person enligt EU 261/2004. Vi driver ärendet gratis.`,
    }
  );
}

const ROUTES = [
  // ── Long-haul från Stockholm ───────────────────────────────────────────────
  route({ slug: 'stockholm-new-york',     dep_city: 'Stockholm', arr_city: 'New York',       dep_airport: 'ARN', arr_airport: 'JFK/EWR',  distance_km: '6 650', comp_amount: '600', airlines: ['SAS','Norwegian','United','Delta'] }),
  route({ slug: 'stockholm-dubai',        dep_city: 'Stockholm', arr_city: 'Dubai',          dep_airport: 'ARN', arr_airport: 'DXB',       distance_km: '5 180', comp_amount: '600', airlines: ['Emirates','Finnair','SAS'] }),
  route({ slug: 'stockholm-bangkok',      dep_city: 'Stockholm', arr_city: 'Bangkok',        dep_airport: 'ARN', arr_airport: 'BKK/DMK',  distance_km: '8 650', comp_amount: '600', airlines: ['Finnair','SAS','Thai Airways'] }),
  route({ slug: 'stockholm-tokyo',        dep_city: 'Stockholm', arr_city: 'Tokyo',          dep_airport: 'ARN', arr_airport: 'HND/NRT',  distance_km: '8 650', comp_amount: '600', airlines: ['Finnair','ANA','Japan Airlines'] }),
  route({ slug: 'stockholm-los-angeles',  dep_city: 'Stockholm', arr_city: 'Los Angeles',    dep_airport: 'ARN', arr_airport: 'LAX',       distance_km: '9 100', comp_amount: '600', airlines: ['SAS','Norwegian','United'] }),
  route({ slug: 'stockholm-new-york-jfk', dep_city: 'Stockholm', arr_city: 'New York',       dep_airport: 'ARN', arr_airport: 'JFK',       distance_km: '6 650', comp_amount: '600', airlines: ['SAS','Norwegian','Icelandair'] }),

  // ── Medelhav & Sydeuropa från Stockholm ──────────────────────────────────
  route({ slug: 'stockholm-athen',        dep_city: 'Stockholm', arr_city: 'Aten',           dep_airport: 'ARN', arr_airport: 'ATH',       distance_km: '2 680', comp_amount: '400', airlines: ['Aegean Airlines','Ryanair','SAS'] }),
  route({ slug: 'stockholm-lissabon',     dep_city: 'Stockholm', arr_city: 'Lissabon',       dep_airport: 'ARN', arr_airport: 'LIS',       distance_km: '3 120', comp_amount: '400', airlines: ['TAP Air Portugal','Ryanair','SAS'] }),
  route({ slug: 'stockholm-madrid',       dep_city: 'Stockholm', arr_city: 'Madrid',         dep_airport: 'ARN', arr_airport: 'MAD',       distance_km: '2 900', comp_amount: '400', airlines: ['Iberia','SAS','Ryanair','Vueling'] }),
  route({ slug: 'stockholm-wien',         dep_city: 'Stockholm', arr_city: 'Wien',           dep_airport: 'ARN', arr_airport: 'VIE',       distance_km: '1 560', comp_amount: '400', airlines: ['Austrian Airlines','SAS','Eurowings'] }),
  route({ slug: 'stockholm-zuerich',      dep_city: 'Stockholm', arr_city: 'Zürich',         dep_airport: 'ARN', arr_airport: 'ZRH',       distance_km: '1 700', comp_amount: '400', airlines: ['Swiss','SAS'] }),
  route({ slug: 'stockholm-munchen',      dep_city: 'Stockholm', arr_city: 'München',        dep_airport: 'ARN', arr_airport: 'MUC',       distance_km: '1 550', comp_amount: '400', airlines: ['Lufthansa','SAS','Eurowings'] }),
  route({ slug: 'stockholm-dublin',       dep_city: 'Stockholm', arr_city: 'Dublin',         dep_airport: 'ARN', arr_airport: 'DUB',       distance_km: '1 820', comp_amount: '400', airlines: ['Aer Lingus','Ryanair'] }),
  route({ slug: 'stockholm-reykjavik',    dep_city: 'Stockholm', arr_city: 'Reykjavik',      dep_airport: 'ARN', arr_airport: 'KEF',       distance_km: '1 900', comp_amount: '400', airlines: ['Icelandair'] }),

  // ── Göteborg-rutter ────────────────────────────────────────────────────────
  route({ slug: 'goteborg-amsterdam',     dep_city: 'Göteborg',  arr_city: 'Amsterdam',      dep_airport: 'GOT', arr_airport: 'AMS',       distance_km: '960',  comp_amount: '250', airlines: ['KLM','Transavia'] }),
  route({ slug: 'goteborg-paris',         dep_city: 'Göteborg',  arr_city: 'Paris',          dep_airport: 'GOT', arr_airport: 'CDG/ORY',  distance_km: '1 600', comp_amount: '400', airlines: ['Air France','Vueling','Ryanair'] }),
  route({ slug: 'goteborg-berlin',        dep_city: 'Göteborg',  arr_city: 'Berlin',         dep_airport: 'GOT', arr_airport: 'BER',       distance_km: '850',  comp_amount: '250', airlines: ['Ryanair','Eurowings'] }),
  route({ slug: 'goteborg-alicante',      dep_city: 'Göteborg',  arr_city: 'Alicante',       dep_airport: 'GOT', arr_airport: 'ALC',       distance_km: '2 680', comp_amount: '400', airlines: ['Ryanair','Vueling','Norwegian'] }),

  // ── Malmö-rutter ─────────────────────────────────────────────────────────
  route({ slug: 'malmo-london',           dep_city: 'Malmö',     arr_city: 'London',         dep_airport: 'MMX', arr_airport: 'STN/LGW',  distance_km: '1 190', comp_amount: '250', airlines: ['Ryanair','Norwegian'] }),
  route({ slug: 'malmo-barcelona',        dep_city: 'Malmö',     arr_city: 'Barcelona',      dep_airport: 'MMX', arr_airport: 'BCN',       distance_km: '2 380', comp_amount: '400', airlines: ['Vueling','Ryanair'] }),
];

exports.up = async function (knex) {
  for (const r of ROUTES) {
    const exists = await knex('routes').where({ slug: r.slug }).first();
    if (!exists) {
      await knex('routes').insert(r);
    }
  }
};

exports.down = async function (knex) {
  const slugs = ROUTES.map(r => r.slug);
  await knex('routes').whereIn('slug', slugs).delete();
};
