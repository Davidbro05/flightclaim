'use strict';

const NOW = new Date('2026-04-20T09:00:00.000Z').toISOString();

// Every page that has a dedicated Express route (not served from articles table).
// slug '' = homepage /
// Adding these here means the sitemap needs zero hardcoding — query DB only.
const STATIC_PAGES = [
  {
    slug: '',
    title: 'Hem',
    meta_title: 'FlightClaim – Få ersättning för försenat flyg',
    meta_desc: 'Du kan ha rätt till upp till 600€ per person. Vi sköter hela processen mot flygbolaget – utan risk.',
    sitemap_priority: '0.9',
    sitemap_changefreq: 'weekly',
  },
  {
    slug: 'anmalan',
    title: 'Ansök om ersättning',
    meta_title: 'Ansök om ersättning | FlightClaim',
    meta_desc: 'Ansök om flygkompensation kostnadsfritt. Vi tar bara betalt om du vinner.',
    sitemap_priority: '1.0',
    sitemap_changefreq: 'monthly',
  },
  {
    slug: 'berakna-ersattning',
    title: 'Beräkna din ersättning',
    meta_title: 'Beräkna din ersättning | FlightClaim',
    meta_desc: 'Kolla om du har rätt till upp till 600€ för ditt försenade eller inställda flyg. Gratis beräkning på 2 minuter.',
    sitemap_priority: '0.8',
    sitemap_changefreq: 'monthly',
  },
  {
    slug: 'flygbolag',
    title: 'Flygbolag — ersättning vid försening & inställt flyg',
    meta_title: 'Flygbolag — ersättning vid försening & inställt flyg | FlightClaim',
    meta_desc: 'Hitta ditt flygbolag och läs om dina rättigheter enligt EU 261/2004.',
    sitemap_priority: '0.7',
    sitemap_changefreq: 'monthly',
  },
  {
    slug: 'sa-fungerar-det',
    title: 'Så fungerar det',
    meta_title: 'Så fungerar det | FlightClaim',
    meta_desc: 'Tre enkla steg: fyll i formuläret, vi granskar ditt ärende, du får ersättningen. Ingen risk.',
    sitemap_priority: '0.6',
    sitemap_changefreq: 'monthly',
  },
  {
    slug: 'om-oss',
    title: 'Om oss',
    meta_title: 'Om oss | FlightClaim',
    meta_desc: 'FlightClaim hjälper svenska resenärer att få rätt ersättning enligt EU 261/2004.',
    sitemap_priority: '0.4',
    sitemap_changefreq: 'yearly',
  },
  {
    slug: 'kontakt',
    title: 'Kontakta oss',
    meta_title: 'Kontakta oss | FlightClaim',
    meta_desc: 'Frågor om ditt ärende? Vi svarar inom 24 timmar via e-post eller telefon.',
    sitemap_priority: '0.4',
    sitemap_changefreq: 'yearly',
  },
  {
    slug: 'integritetspolicy',
    title: 'Integritetspolicy',
    meta_title: 'Integritetspolicy | FlightClaim',
    meta_desc: 'Hur FlightClaim hanterar dina personuppgifter enligt GDPR.',
    sitemap_priority: '0.3',
    sitemap_changefreq: 'yearly',
  },
];

exports.up = async function (knex) {
  // Seed static pages (idempotent)
  for (const page of STATIC_PAGES) {
    const exists = await knex('articles').where({ slug: page.slug }).first();
    if (!exists) {
      await knex('articles').insert({
        type: 'guide',
        status: 'published',
        parent_slug: null,
        schema_type: 'none',
        faq_json: null,
        affiliate_ref: null,
        content: null,
        category: null,
        created_at: NOW,
        updated_at: NOW,
        ...page,
      });
    } else {
      // Ensure sitemap columns are set on existing records
      await knex('articles').where({ slug: page.slug }).update({
        sitemap_priority: page.sitemap_priority,
        sitemap_changefreq: page.sitemap_changefreq,
        updated_at: NOW,
      });
    }
  }

  // Update the existing virtual /blogg record with explicit sitemap values
  await knex('articles').where({ slug: 'blogg' }).update({
    sitemap_priority: '0.7',
    sitemap_changefreq: 'weekly',
    updated_at: NOW,
  });
};

exports.down = async function (knex) {
  const slugs = STATIC_PAGES.map((p) => p.slug);
  await knex('articles').whereIn('slug', slugs).delete();
  await knex('articles').where({ slug: 'blogg' }).update({
    sitemap_priority: null,
    sitemap_changefreq: null,
  });
};
