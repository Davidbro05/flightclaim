'use strict';

const NOW = new Date('2026-04-23T10:00:00.000Z').toISOString();

exports.up = async function (knex) {
  const [authorId] = await knex('authors').insert({
    slug: 'flightclaim-redaktion',
    name: 'FlightClaim Redaktion',
    role: 'Juridisk redaktion',
    credentials: 'Specialister på EU-förordning 261/2004 och svensk konsumenträtt',
    bio: `FlightClaim Redaktion består av jurister och sakkunniga med djup kunskap om flygpassagerares rättigheter enligt EU-förordning 261/2004. Redaktionen har drivit tusentals ersättningsärenden mot flygbolag sedan verksamheten startade och följer kontinuerligt utvecklingen hos EU-domstolen, Allmänna reklamationsnämnden (ARN) och Konsumentverket.

Allt innehåll på sajten granskas av redaktionen för att säkerställa att det är juridiskt korrekt, aktuellt och praktiskt användbart för dig som resenär.`,
    image_url: '/images/authors/flightclaim-redaktion.jpg',
    email: 'info@flightclaim.se',
    linkedin_url: null,
    created_at: NOW,
    updated_at: NOW,
  }).returning('id');

  const id = typeof authorId === 'object' && authorId !== null ? authorId.id : authorId;

  await knex('articles').whereNull('author_id').update({ author_id: id });
};

exports.down = async function (knex) {
  await knex('articles').update({ author_id: null });
  await knex('authors').where({ slug: 'flightclaim-redaktion' }).delete();
};
