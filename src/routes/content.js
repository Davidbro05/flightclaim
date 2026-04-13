const express = require('express');
const db = require('../db');
const logger = require('../logger');
const { render: renderMarkdown } = require('../services/markdownService');

const router = express.Router();

// ── Nav helpers ────────────────────────────────────────────────────────────

async function fetchNav() {
  try {
    const items = await db('nav_items').orderBy('sort_order');
    const topLevel = items.filter((i) => !i.parent_id);
    return topLevel.map((parent) => ({
      ...parent,
      children: items.filter((i) => i.parent_id === parent.id),
    }));
  } catch {
    return [];
  }
}

function renderNavHtml(nav, currentPath) {
  const links = nav.map((item) => {
    const active = currentPath === item.url || currentPath.startsWith(item.url + '/');
    if (item.children.length === 0) {
      return `<li class="nav-item">
        <a href="${esc(item.url)}" class="nav-link${active ? ' active' : ''}">${esc(item.label)}</a>
      </li>`;
    }
    return `<li class="nav-item has-dropdown${active ? ' active' : ''}">
      <a href="${esc(item.url)}" class="nav-link dropdown-toggle${active ? ' active' : ''}">${esc(item.label)} <span class="chevron">&#9660;</span></a>
      <ul class="dropdown-menu">
        ${item.children.map((c) => `<li><a href="${esc(c.url)}">${esc(c.label)}</a></li>`).join('')}
      </ul>
    </li>`;
  });
  return links.join('\n');
}

// ── Schema helpers ─────────────────────────────────────────────────────────

function buildBreadcrumbSchema(crumbs) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `https://flightclaim.se${c.url}`,
    })),
  });
}

function buildFaqSchema(faqItems) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  });
}

function buildArticleSchema(article) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.meta_desc || '',
    url: `https://flightclaim.se/${article.slug}`,
    datePublished: article.created_at,
    dateModified: article.updated_at || article.created_at,
    publisher: {
      '@type': 'Organization',
      name: 'FlightClaim.se',
      url: 'https://flightclaim.se',
    },
  });
}

// ── String helpers ─────────────────────────────────────────────────────────

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Breadcrumb builder ─────────────────────────────────────────────────────

async function buildBreadcrumbs(article) {
  const crumbs = [{ name: 'Hem', url: '/' }];
  if (article.parent_slug) {
    const parent = await db('articles').where({ slug: article.parent_slug, status: 'published' }).first();
    if (parent) crumbs.push({ name: parent.title, url: `/${parent.slug}` });
  }
  crumbs.push({ name: article.title, url: `/${article.slug}` });
  return crumbs;
}

// ── FAQ renderer ───────────────────────────────────────────────────────────

function renderFaqHtml(faqItems) {
  if (!faqItems || faqItems.length === 0) return '';
  const rows = faqItems.map((f) => `
    <details class="faq-item">
      <summary class="faq-question">${esc(f.q)}</summary>
      <div class="faq-answer">${esc(f.a)}</div>
    </details>`).join('');
  return `<section class="faq-section">
    <h2>Vanliga frågor</h2>
    ${rows}
  </section>`;
}

// ── Full page template ─────────────────────────────────────────────────────

function renderPage({ article, bodyHtml, faqHtml, breadcrumbs, nav, schemaBlocks }) {
  const siteTitle = 'FlightClaim.se';
  const pageTitle = article.meta_title || `${article.title} | ${siteTitle}`;
  const desc = article.meta_desc || '';
  const canonical = `https://flightclaim.se/${article.slug}`;

  const breadcrumbHtml = breadcrumbs.length > 1
    ? `<nav class="breadcrumb" aria-label="Brödsmulor">
        ${breadcrumbs.map((c, i) =>
          i < breadcrumbs.length - 1
            ? `<a href="${esc(c.url)}">${esc(c.name)}</a> <span class="sep">›</span>`
            : `<span>${esc(c.name)}</span>`
        ).join(' ')}
      </nav>`
    : '';

  const schemaTagsHtml = schemaBlocks.map((s) =>
    `<script type="application/ld+json">${s}</script>`
  ).join('\n  ');

  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(pageTitle)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${esc(canonical)}">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(pageTitle)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:site_name" content="${esc(siteTitle)}">

  <!-- Favicons -->
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
  <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <!-- Shared styles -->
  <link rel="stylesheet" href="/style.css">

  <!-- Schema.org JSON-LD -->
  ${schemaTagsHtml}

  <style>
    /* ── Content page extras ─────────────────────────────── */
    .site-header {
      background: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,.06);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .site-header .container { display: flex; align-items: center; height: 72px; gap: 24px; }
    .site-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; color: #1a4b8c; font-weight: 700; font-size: 1.1rem; flex-shrink: 0; }
    .site-logo .logo-icon { font-size: 1.4rem; }

    .main-nav { display: flex; gap: 0; margin-left: auto; }
    .nav-item { list-style: none; position: relative; }
    .nav-link { display: block; padding: 8px 14px; font-size: .9rem; font-weight: 500; color: #374151; text-decoration: none; white-space: nowrap; }
    .nav-link:hover, .nav-link.active { color: #1a4b8c; }
    .nav-link .chevron { font-size: .6rem; vertical-align: middle; margin-left: 2px; }

    .dropdown-menu { display: none; position: absolute; top: 100%; left: 0; background: #fff; min-width: 220px; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,.12); padding: 8px 0; z-index: 200; }
    .dropdown-menu li { list-style: none; }
    .dropdown-menu a { display: block; padding: 9px 18px; font-size: .875rem; color: #374151; text-decoration: none; }
    .dropdown-menu a:hover { background: #f0f4f8; color: #1a4b8c; }
    .has-dropdown:hover .dropdown-menu { display: block; }

    .header-cta { margin-left: 16px; flex-shrink: 0; }
    .header-cta a { display: inline-block; background: #1a4b8c; color: #fff; padding: 9px 20px; border-radius: 7px; font-size: .875rem; font-weight: 600; text-decoration: none; }
    .header-cta a:hover { background: #154080; }

    /* Hamburger */
    .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 8px; margin-left: auto; border: none; background: none; }
    .hamburger span { display: block; width: 22px; height: 2px; background: #374151; border-radius: 2px; }
    @media (max-width: 768px) {
      .hamburger { display: flex; }
      .main-nav { display: none; flex-direction: column; position: absolute; top: 72px; left: 0; right: 0; background: #fff; box-shadow: 0 8px 16px rgba(0,0,0,.1); padding: 12px 0; z-index: 200; }
      .main-nav.open { display: flex; }
      .nav-link { padding: 12px 24px; }
      .dropdown-menu { display: none; position: static; box-shadow: none; border-radius: 0; padding-left: 24px; }
      .has-dropdown.open .dropdown-menu { display: block; }
      .header-cta { display: none; }
    }

    /* Breadcrumb */
    .breadcrumb { font-size: .82rem; color: #718096; margin-bottom: 24px; }
    .breadcrumb a { color: #2a5298; text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }
    .breadcrumb .sep { margin: 0 6px; }

    /* Article layout */
    .article-layout { display: grid; grid-template-columns: 1fr 300px; gap: 40px; align-items: start; margin-top: 32px; }
    @media (max-width: 900px) { .article-layout { grid-template-columns: 1fr; } }

    .article-body { min-width: 0; }
    .article-body h1 { font-size: 2rem; font-weight: 700; color: #1a202c; line-height: 1.3; margin-bottom: 16px; }
    .article-body h2 { font-size: 1.35rem; font-weight: 600; color: #1a4b8c; margin: 32px 0 12px; }
    .article-body h3 { font-size: 1.1rem; font-weight: 600; color: #2d3748; margin: 24px 0 10px; }
    .article-body p { margin-bottom: 16px; line-height: 1.75; color: #374151; }
    .article-body ul, .article-body ol { margin: 0 0 16px 24px; line-height: 1.75; color: #374151; }
    .article-body li { margin-bottom: 6px; }
    .article-body a { color: #2a5298; }
    .article-body strong { color: #1a202c; }
    .article-body table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: .9rem; }
    .article-body th { background: #1a4b8c; color: #fff; padding: 10px 14px; text-align: left; }
    .article-body td { padding: 9px 14px; border-bottom: 1px solid #e2e8f0; }
    .article-body tr:nth-child(even) td { background: #f7fafc; }
    .article-body blockquote { border-left: 4px solid #1a4b8c; margin: 20px 0; padding: 12px 20px; background: #ebf4ff; color: #2d3748; font-style: italic; border-radius: 0 8px 8px 0; }

    /* Sidebar */
    .article-sidebar { position: sticky; top: 88px; }
    .cta-box { background: #1a4b8c; color: #fff; border-radius: 12px; padding: 28px 24px; text-align: center; }
    .cta-box h3 { font-size: 1.1rem; margin-bottom: 10px; }
    .cta-box p { font-size: .875rem; opacity: .9; margin-bottom: 20px; line-height: 1.5; }
    .cta-box a { display: inline-block; background: #f8b81f; color: #1a202c; font-weight: 700; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: .95rem; }
    .cta-box a:hover { background: #e5a50a; }

    /* FAQ */
    .faq-section { margin-top: 40px; }
    .faq-section h2 { font-size: 1.35rem; font-weight: 600; color: #1a4b8c; margin-bottom: 16px; }
    .faq-item { border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 10px; overflow: hidden; }
    .faq-question { padding: 14px 18px; font-weight: 500; cursor: pointer; font-size: .95rem; list-style: none; display: flex; justify-content: space-between; align-items: center; background: #fff; }
    .faq-question::-webkit-details-marker { display: none; }
    .faq-question::after { content: '+'; font-size: 1.2rem; color: #1a4b8c; }
    details[open] .faq-question::after { content: '−'; }
    .faq-answer { padding: 14px 18px; background: #f7fafc; font-size: .9rem; line-height: 1.7; color: #374151; border-top: 1px solid #e2e8f0; }

    /* Bottom CTA banner */
    .cta-banner { background: linear-gradient(135deg, #1a4b8c 0%, #2a6bb0 100%); color: #fff; border-radius: 12px; padding: 40px; text-align: center; margin: 48px 0 0; }
    .cta-banner h2 { font-size: 1.5rem; margin-bottom: 10px; }
    .cta-banner p { opacity: .9; margin-bottom: 24px; font-size: 1rem; }
    .cta-banner a { display: inline-block; background: #f8b81f; color: #1a202c; font-weight: 700; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 1rem; }
    .cta-banner a:hover { background: #e5a50a; }

    /* Footer */
    .site-footer { background: #1a202c; color: #a0aec0; text-align: center; padding: 32px 20px; margin-top: 64px; font-size: .85rem; }
    .site-footer a { color: #63b3ed; text-decoration: none; }

    /* Main content area */
    .page-content { padding: 32px 0 64px; }
  </style>
</head>
<body>

<!-- ── Header ───────────────────────────────────────────────────────────── -->
<header class="site-header">
  <div class="container" style="position:relative;">
    <a href="/" class="site-logo">
      <span class="logo-icon">✈️</span>
      <span>FlightClaim</span>
    </a>

    <button class="hamburger" id="hamburgerBtn" aria-label="Meny" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>

    <ul class="main-nav" id="mainNav" role="menubar">
      ${renderNavHtml(nav, `/${article.slug}`)}
    </ul>

    <div class="header-cta">
      <a href="/#ansokan">Ansök nu</a>
    </div>
  </div>
</header>

<!-- ── Content ──────────────────────────────────────────────────────────── -->
<main class="page-content">
  <div class="container">
    ${breadcrumbHtml}

    <div class="article-layout">
      <article class="article-body">
        <h1>${esc(article.title)}</h1>
        ${bodyHtml}
        ${faqHtml}

        <div class="cta-banner">
          <h2>Drabbad av försenat eller inställt flyg?</h2>
          <p>Ansök om ersättning på 2 minuter — vi sköter hela processen mot flygbolaget.</p>
          <a href="/#ansokan">Ansök om ersättning →</a>
        </div>
      </article>

      <aside class="article-sidebar">
        <div class="cta-box">
          <h3>Få upp till 600€ i ersättning</h3>
          <p>Vi sköter hela processen mot flygbolaget. Du betalar ingenting om vi inte lyckas.</p>
          <a href="/#ansokan">Ansök nu — gratis</a>
        </div>
      </aside>
    </div>
  </div>
</main>

<!-- ── Footer ───────────────────────────────────────────────────────────── -->
<footer class="site-footer">
  <div class="container">
    <p>© ${new Date().getFullYear()} FlightClaim.se — Ersättning enligt EU-förordning 261/2004</p>
    <p style="margin-top:8px;"><a href="/">Hem</a> · <a href="/blogg">Blogg</a> · <a href="/#kontakt">Kontakt</a></p>
  </div>
</footer>

<script>
  // Hamburger toggle
  const btn = document.getElementById('hamburgerBtn');
  const nav = document.getElementById('mainNav');
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });

  // Mobile dropdown toggle
  document.querySelectorAll('.has-dropdown .dropdown-toggle').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        link.closest('.has-dropdown').classList.toggle('open');
      }
    });
  });
</script>
</body>
</html>`;
}

// ── 404 page ───────────────────────────────────────────────────────────────

function render404(nav) {
  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sidan hittades inte | FlightClaim.se</title>
  <link rel="stylesheet" href="/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    .not-found { text-align: center; padding: 80px 20px; }
    .not-found h1 { font-size: 4rem; color: #1a4b8c; margin-bottom: 0; }
    .not-found p { color: #718096; margin: 12px 0 28px; }
    .not-found a { background: #1a4b8c; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="not-found container">
    <h1>404</h1>
    <p>Sidan du söker finns inte.</p>
    <a href="/">Tillbaka till startsidan</a>
  </div>
</body>
</html>`;
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

  try {
    const article = await db('articles').where({ slug, status: 'published' }).first();
    if (!article) {
      const nav = await fetchNav();
      return res.status(404).type('html').send(render404(nav));
    }

    let faqItems = null;
    if (article.faq_json) {
      try {
        faqItems = typeof article.faq_json === 'string' ? JSON.parse(article.faq_json) : article.faq_json;
      } catch {
        faqItems = null;
      }
    }

    const [nav, breadcrumbs] = await Promise.all([
      fetchNav(),
      buildBreadcrumbs(article),
    ]);

    const bodyHtml = renderMarkdown(article.content || '');
    const faqHtml  = renderFaqHtml(faqItems);

    const schemaBlocks = [buildBreadcrumbSchema(breadcrumbs)];
    if (article.schema_type === 'FAQPage' && faqItems && faqItems.length > 0) {
      schemaBlocks.push(buildFaqSchema(faqItems));
    } else if (article.schema_type === 'Article') {
      schemaBlocks.push(buildArticleSchema(article));
    }

    const html = renderPage({ article, bodyHtml, faqHtml, breadcrumbs, nav, schemaBlocks });
    res.type('html').send(html);
  } catch (err) {
    logger.error({ err, slug }, 'Content route error');
    res.status(500).type('html').send('<h1>Fel</h1><p>Ett oväntat fel uppstod.</p>');
  }
});

module.exports = router;
