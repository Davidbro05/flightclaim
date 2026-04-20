'use strict';

const ROUTES = [
  // Korta rutter (<1500 km) → 250€
  { slug: 'stockholm-kopenhamn',    dep_city: 'Stockholm', arr_city: 'Köpenhamn',     dep_airport: 'ARN', arr_airport: 'CPH',       distance_km: '520',  comp_amount: '250', airlines: ['SAS','Norwegian','Ryanair'] },
  { slug: 'stockholm-oslo',         dep_city: 'Stockholm', arr_city: 'Oslo',          dep_airport: 'ARN', arr_airport: 'OSL',       distance_km: '480',  comp_amount: '250', airlines: ['SAS','Norwegian','Widerøe'] },
  { slug: 'stockholm-helsingfors',  dep_city: 'Stockholm', arr_city: 'Helsingfors',   dep_airport: 'ARN', arr_airport: 'HEL',       distance_km: '400',  comp_amount: '250', airlines: ['Finnair','SAS'] },
  { slug: 'goteborg-london',        dep_city: 'Göteborg',  arr_city: 'London',        dep_airport: 'GOT', arr_airport: 'LGW/LHR',   distance_km: '1 290', comp_amount: '250', airlines: ['Ryanair','British Airways'] },
  { slug: 'malmo-amsterdam',        dep_city: 'Malmö',     arr_city: 'Amsterdam',     dep_airport: 'MMX', arr_airport: 'AMS',       distance_km: '1 010', comp_amount: '250', airlines: ['KLM','Ryanair'] },

  // Medellånga rutter (1500–3500 km) → 400€
  { slug: 'stockholm-london',       dep_city: 'Stockholm', arr_city: 'London',        dep_airport: 'ARN', arr_airport: 'LHR/LGW/STN', distance_km: '1 760', comp_amount: '400', airlines: ['SAS','British Airways','Ryanair','Norwegian'] },
  { slug: 'stockholm-amsterdam',    dep_city: 'Stockholm', arr_city: 'Amsterdam',     dep_airport: 'ARN', arr_airport: 'AMS',       distance_km: '1 510', comp_amount: '400', airlines: ['KLM','SAS'] },
  { slug: 'stockholm-barcelona',    dep_city: 'Stockholm', arr_city: 'Barcelona',     dep_airport: 'ARN', arr_airport: 'BCN',       distance_km: '2 500', comp_amount: '400', airlines: ['Vueling','Norwegian','Ryanair','SAS'] },
  { slug: 'stockholm-rom',          dep_city: 'Stockholm', arr_city: 'Rom',           dep_airport: 'ARN', arr_airport: 'FCO/CIA',   distance_km: '2 400', comp_amount: '400', airlines: ['SAS','Ryanair','Norwegian'] },
  { slug: 'stockholm-paris',        dep_city: 'Stockholm', arr_city: 'Paris',         dep_airport: 'ARN', arr_airport: 'CDG/ORY',   distance_km: '1 870', comp_amount: '400', airlines: ['Air France','SAS','Norwegian'] },
  { slug: 'stockholm-berlin',       dep_city: 'Stockholm', arr_city: 'Berlin',        dep_airport: 'ARN', arr_airport: 'BER',       distance_km: '1 020', comp_amount: '400', airlines: ['SAS','Ryanair','Eurowings'] },
  { slug: 'stockholm-malaga',       dep_city: 'Stockholm', arr_city: 'Málaga',        dep_airport: 'ARN', arr_airport: 'AGP',       distance_km: '3 000', comp_amount: '400', airlines: ['Ryanair','Vueling','Norwegian','Wizz Air'] },
  { slug: 'goteborg-barcelona',     dep_city: 'Göteborg',  arr_city: 'Barcelona',     dep_airport: 'GOT', arr_airport: 'BCN',       distance_km: '2 430', comp_amount: '400', airlines: ['Vueling','Ryanair','Norwegian'] },
  { slug: 'goteborg-malaga',        dep_city: 'Göteborg',  arr_city: 'Málaga',        dep_airport: 'GOT', arr_airport: 'AGP',       distance_km: '2 900', comp_amount: '400', airlines: ['Ryanair','Vueling','Norwegian'] },
  { slug: 'stockholm-istanbul',     dep_city: 'Stockholm', arr_city: 'Istanbul',      dep_airport: 'ARN', arr_airport: 'IST/SAW',   distance_km: '2 440', comp_amount: '400', airlines: ['Turkish Airlines','SAS','Pegasus'] },
];

exports.up = async function (knex) {
  const now = new Date();
  const rows = ROUTES.map(r => ({
    ...r,
    airlines:   JSON.stringify(r.airlines),
    meta_title: `Försenat flyg ${r.dep_city}–${r.arr_city}? Kräv upp till ${r.comp_amount}€ ersättning | FlightClaim`,
    meta_desc:  `Drabbad av försenat eller inställt flyg ${r.dep_city}–${r.arr_city}? Enligt EU 261/2004 kan du ha rätt till ${r.comp_amount}€ per person. Ansök kostnadsfritt.`,
    created_at: now,
    updated_at: now,
  }));
  await knex('routes').insert(rows);
};

exports.down = async function (knex) {
  await knex('routes').whereIn('slug', ROUTES.map(r => r.slug)).delete();
};