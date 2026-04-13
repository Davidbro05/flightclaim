const express = require('express');
const db = require('../db');
const logger = require('../logger');
const { render: renderMarkdown } = require('../services/markdownService');

const router = express.Router();

// ── Helpers ────────────────────────────────────────────────────────────────

function parseFaq(faq_json) {
  if (!faq_json) return null;
  try {
    const parsed = typeof faq_json === 'string' ? JSON.parse(faq_json) : faq_json;
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

async function buildBreadcrumbs(article, siteUrl) {
  const crumbs = [{ name: 'Hem', url: '/' }];
  if (article.parent_slug) {
    const parent = await db('articles')
      .where({ slug: article.parent_slug, status: 'published' })
      .first();
    if (parent) crumbs.push({ name: parent.title, url: `/${parent.slug}` });
  }
  crumbs.push({ name: article.title, url: `/${article.slug}` });
  return crumbs;
}

function buildSchemaJson(article, faqItems, crumbs, siteUrl) {
  const schemas = [];

  // BreadcrumbList
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${siteUrl}${c.url}`,
    })),
  });

  // FAQPage or Article
  if (article.schema_type === 'FAQPage' && faqItems) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  } else if (article.schema_type === 'Article') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.meta_desc || '',
      url: `${siteUrl}/${article.slug}`,
      datePublished: article.created_at,
      dateModified: article.updated_at || article.created_at,
      publisher: {
        '@type': 'Organization',
        name: 'FlightClaim.se',
        url: siteUrl,
      },
    });
  }

  // Wrap multiple schemas in @graph if needed
  if (schemas.length === 1) return JSON.stringify(schemas[0]);
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': schemas });
}

// ── Static EJS pages ───────────────────────────────────────────────────────

router.get('/', (req, res) => {
  res.render('pages/index', {
    title: 'FlightClaim – Få ersättning för försenat flyg',
    metaDesc: 'Du kan ha rätt till upp till 600€ per person. Vi sköter hela processen mot flygbolaget – utan risk.',
    canonical: '/',
  });
});

router.get('/om-oss', (req, res) => {
  res.render('pages/om-oss', {
    title: 'Om oss | FlightClaim',
    metaDesc: 'FlightClaim grundades 2026 för att hjälpa svenska resenärer få rätt ersättning enligt EU 261/2004.',
    canonical: '/om-oss',
  });
});

router.get('/sa-fungerar-det', (req, res) => {
  res.render('pages/sa-fungerar-det', {
    title: 'Så fungerar det | FlightClaim',
    metaDesc: 'Tre enkla steg: fyll i formuläret, vi granskar ditt ärende, du får ersättningen. Ingen risk.',
    canonical: '/sa-fungerar-det',
  });
});

router.get('/kontakt', (req, res) => {
  res.render('pages/kontakt', {
    title: 'Kontakta oss | FlightClaim',
    metaDesc: 'Frågor om ditt ärende? Vi svarar inom 24 timmar via e-post eller telefon.',
    canonical: '/kontakt',
    contactSent: req.query.skickat === '1',
  });
});

router.post('/kontakt', (req, res) => {
  const { contact_name, contact_email } = req.body;
  logger.info({ contact_name, contact_email }, 'Contact form submitted');
  res.redirect('/kontakt?skickat=1');
});

router.get('/anmalan', (req, res) => {
  res.render('pages/anmalan', {
    title: 'Ansök om ersättning | FlightClaim',
    metaDesc: 'Ansök om flygkompensation kostnadsfritt. Vi tar bara betalt om du vinner.',
    canonical: '/anmalan',
  });
});

router.get('/tack', (req, res) => {
  res.render('pages/tack', {
    title: 'Tack för din ansökan | FlightClaim',
    metaDesc: '',
    canonical: '/tack',
  });
});

router.get('/integritetspolicy', (req, res) => {
  res.render('pages/integritetspolicy', {
    title: 'Integritetspolicy | FlightClaim',
    metaDesc: 'Hur FlightClaim hanterar dina personuppgifter enligt GDPR.',
    canonical: '/integritetspolicy',
  });
});

// ── CMS article catch-all (must stay LAST) ─────────────────────────────────

router.get('/:slug{/*path}', async (req, res) => {
  const slug = req.params.slug + (req.params.path ? '/' + req.params.path : '');
  const siteUrl = res.locals.siteUrl || 'https://flightclaim.se';

  try {
    const article = await db('articles').where({ slug, status: 'published' }).first();

    if (!article) {
      return res.status(404).render('pages/404', {
        title: 'Sidan hittades inte | FlightClaim',
        metaDesc: '',
      });
    }

    const faqItems  = parseFaq(article.faq_json);
    const crumbs    = await buildBreadcrumbs(article, siteUrl);
    const bodyHtml  = renderMarkdown(article.content || '');
    const schemaJson = buildSchemaJson(article, faqItems, crumbs, siteUrl);

    res.render('pages/artikel', {
      article,
      bodyHtml,
      faqItems,
      crumbs,
      schemaJson,
      title:    article.meta_title || `${article.title} | FlightClaim.se`,
      metaDesc: article.meta_desc  || '',
      canonical: `/${article.slug}`,
    });
  } catch (err) {
    logger.error({ err, slug }, 'Content route error');
    res.status(500).render('pages/404', {
      title: 'Serverfel | FlightClaim',
      metaDesc: '',
    });
  }
});

module.exports = router;
