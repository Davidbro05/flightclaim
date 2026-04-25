import express from 'express';
import db from '../db';
import logger from '../logger';
import {
  render as renderMarkdown,
  wordCount,
  readingTimeMinutes,
  extractFirstImage,
  extractToc,
} from '../services/markdownService';
import { sendContactNotification } from '../services/emailService';
import type { Article, Author, FaqItem, Breadcrumb, Route } from '../types';

const router = express.Router();

function parseFaq(faq_json: string | null): FaqItem[] | null {
  if (!faq_json) return null;
  try {
    const parsed: unknown = typeof faq_json === 'string' ? JSON.parse(faq_json) : faq_json;
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as FaqItem[]) : null;
  } catch {
    return null;
  }
}

const STATIC_PARENTS: Record<string, { name: string; url: string }> = {
  blogg:     { name: 'Blogg',         url: '/blogg' },
  flygbolag: { name: 'Flygbolag',     url: '/flygbolag' },
  forsening: { name: 'Försenat flyg', url: '/forsening' },
  'installda-flyg': { name: 'Inställt flyg', url: '/installda-flyg' },
};

const AIRLINE_SLUG_MAP: Record<string, string> = {
  'SAS':                 'sas',
  'Norwegian':           'norwegian',
  'Ryanair':             'ryanair',
  'Wizz Air':            'wizz-air',
  'EasyJet':             'easyjet',
  'Finnair':             'finnair',
  'KLM':                 'klm',
  'Lufthansa':           'lufthansa',
  'Eurowings':           'eurowings',
  'Turkish Airlines':    'turkish-airlines',
  'Air France':          'air-france',
  'British Airways':     'british-airways',
  'Vueling':             'vueling',
  'Transavia':           'transavia',
  'TAP Air Portugal':    'tap-air-portugal',
  'Iberia':              'iberia',
  'Brussels Airlines':   'brussels-airlines',
  'Aer Lingus':          'aer-lingus',
  'Austrian Airlines':   'austrian-airlines',
  'LOT Polish Airlines': 'lot-polish-airlines',
  'Aegean Airlines':     'aegean-airlines',
  'Condor':              'condor',
  'TUI fly':             'tui-fly',
  'airBaltic':           'airbaltic',
  'Icelandair':          'icelandair',
  'ITA Airways':         'ita-airways',
};

async function buildBreadcrumbs(article: Article, siteUrl: string): Promise<Breadcrumb[]> {
  const crumbs: Breadcrumb[] = [{ name: 'Hem', url: '/' }];
  if (article.parent_slug) {
    const parent = await db('articles')
      .where({ slug: article.parent_slug, status: 'published' })
      .first<Article>();
    if (parent) {
      crumbs.push({ name: parent.title, url: `/${parent.slug}` });
    } else if (STATIC_PARENTS[article.parent_slug]) {
      crumbs.push(STATIC_PARENTS[article.parent_slug]);
    }
  }
  crumbs.push({ name: article.title, url: `/${article.slug}` });
  return crumbs;
}

interface SchemaExtras {
  heroImage: string | null;
  words: number;
  author: Author | null;
}

function buildSchemaJson(
  article: Article,
  faqItems: FaqItem[] | null,
  crumbs: Breadcrumb[],
  siteUrl: string,
  extras: SchemaExtras,
): string {
  const schemas: object[] = [];

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

  const imageUrl = extras.heroImage
    ? (extras.heroImage.startsWith('http') ? extras.heroImage : `${siteUrl}${extras.heroImage}`)
    : `${siteUrl}/images/hero-bg.jpg`;

  const authorNode = extras.author
    ? {
        '@type': 'Person',
        '@id': `${siteUrl}/forfattare/${extras.author.slug}#person`,
        name: extras.author.name,
        url: `${siteUrl}/forfattare/${extras.author.slug}`,
        ...(extras.author.role ? { jobTitle: extras.author.role } : {}),
        ...(extras.author.credentials ? { description: extras.author.credentials } : {}),
        ...(extras.author.image_url ? { image: `${siteUrl}${extras.author.image_url}` } : {}),
      }
    : { '@id': `${siteUrl}/#organization` };

  const baseArticleFields = {
    headline: article.title,
    description: article.meta_desc ?? '',
    url: `${siteUrl}/${article.slug}`,
    datePublished: article.created_at,
    dateModified: article.updated_at ?? article.created_at,
    inLanguage: 'sv-SE',
    image: imageUrl,
    wordCount: extras.words,
    author: authorNode,
    publisher: { '@id': `${siteUrl}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/${article.slug}` },
  };

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
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      ...baseArticleFields,
    });
  } else if (article.schema_type === 'Article') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      ...baseArticleFields,
    });
  }

  if (schemas.length === 1) return JSON.stringify(schemas[0]);
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': schemas });
}

interface RelatedArticle {
  slug: string;
  title: string;
  meta_desc: string | null;
  type: string;
  parent_slug: string | null;
}

async function buildRelatedArticles(article: Article): Promise<RelatedArticle[]> {
  const results: RelatedArticle[] = [];
  const seen = new Set<string>([article.slug]);

  const push = (rows: RelatedArticle[]) => {
    for (const r of rows) {
      if (seen.has(r.slug)) continue;
      seen.add(r.slug);
      results.push(r);
      if (results.length >= 5) return true;
    }
    return false;
  };

  if (article.parent_slug) {
    const pillar = await db('articles')
      .where({ slug: article.parent_slug, status: 'published' })
      .select<RelatedArticle[]>('slug', 'title', 'meta_desc', 'type', 'parent_slug');
    if (push(pillar)) return results;

    const siblings = await db('articles')
      .where({ parent_slug: article.parent_slug, status: 'published' })
      .whereNot({ slug: article.slug })
      .orderBy('created_at', 'desc')
      .limit(4)
      .select<RelatedArticle[]>('slug', 'title', 'meta_desc', 'type', 'parent_slug');
    if (push(siblings)) return results;
  } else {
    const spokes = await db('articles')
      .where({ parent_slug: article.slug, status: 'published' })
      .orderBy('created_at', 'asc')
      .limit(4)
      .select<RelatedArticle[]>('slug', 'title', 'meta_desc', 'type', 'parent_slug');
    if (push(spokes)) return results;
  }

  if (article.category) {
    const sameCategory = await db('articles')
      .where({ status: 'published', category: article.category })
      .whereNot({ slug: article.slug })
      .orderBy('created_at', 'desc')
      .limit(5)
      .select<RelatedArticle[]>('slug', 'title', 'meta_desc', 'type', 'parent_slug');
    if (push(sameCategory)) return results;
  }

  if (results.length < 3) {
    const topBlogs = await db('articles')
      .where({ status: 'published', type: 'blog' })
      .whereNot({ slug: article.slug })
      .orderBy('created_at', 'desc')
      .limit(3)
      .select<RelatedArticle[]>('slug', 'title', 'meta_desc', 'type', 'parent_slug');
    push(topBlogs);
  }

  return results;
}

function formatSwedishDate(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const months = ['januari', 'februari', 'mars', 'april', 'maj', 'juni',
    'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// ── Static EJS pages ───────────────────────────────────────────────────────

router.get('/', (_req, res) => {
  res.render('pages/index', {
    title: 'FlightClaim – Få ersättning för försenat flyg',
    metaDesc: 'Du kan ha rätt till upp till 600€ per person. Vi sköter hela processen mot flygbolaget – utan risk.',
    canonical: '/',
    preloadHero: true,
  });
});

router.get('/om-oss', (_req, res) => {
  res.render('pages/om-oss', {
    title: 'Om oss | FlightClaim',
    metaDesc: 'FlightClaim hjälper svenska resenärer att få rätt ersättning enligt EU 261/2004.',
    canonical: '/om-oss',
  });
});

router.get('/sa-fungerar-det', (_req, res) => {
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

router.post('/kontakt', async (req, res) => {
  const { contact_name, contact_email, contact_message } = req.body as {
    contact_name?: string;
    contact_email?: string;
    contact_message?: string;
  };

  const name    = (contact_name    ?? '').trim();
  const email   = (contact_email   ?? '').trim();
  const message = (contact_message ?? '').trim();

  if (!name || !email || !message) {
    return res.redirect('/kontakt?fel=1');
  }

  logger.info({ name, email }, 'Contact form submitted');

  await db('contact_messages').insert({
    name,
    email,
    message,
    created_at: new Date().toISOString(),
  }).catch((err: unknown) => logger.error({ err }, 'Failed to save contact message'));

  sendContactNotification({ name, email, message })
    .catch((err: unknown) => logger.error({ err }, 'Failed to send contact notification email'));

  res.redirect('/kontakt?skickat=1');
});

router.get('/anmalan', (_req, res) => {
  res.render('pages/anmalan', {
    title: 'Ansök om ersättning | FlightClaim',
    metaDesc: 'Ansök om flygkompensation kostnadsfritt. Vi tar bara betalt om du vinner.',
    canonical: '/anmalan',
  });
});

router.get('/berakna-ersattning', (_req, res) => {
  res.render('pages/berakna-ersattning', {
    title: 'Beräkna din ersättning | FlightClaim',
    metaDesc: 'Kolla om du har rätt till upp till 600 € för ditt försenade eller inställda flyg. Gratis beräkning på 2 minuter.',
    canonical: '/berakna-ersattning',
  });
});

router.get('/tack', (_req, res) => {
  res.render('pages/tack', {
    title: 'Tack för din ansökan | FlightClaim',
    metaDesc: '',
    canonical: '/tack',
    noindex: true,
  });
});

router.get('/integritetspolicy', (_req, res) => {
  res.render('pages/integritetspolicy', {
    title: 'Integritetspolicy | FlightClaim',
    metaDesc: 'Hur FlightClaim hanterar dina personuppgifter enligt GDPR.',
    canonical: '/integritetspolicy',
  });
});

// ── Flygbolag index ────────────────────────────────────────────────────────

const AIRLINES = [
  { slug: 'sas',               name: 'SAS',               img: 'sas-a321.jpg',                        tagline: 'Skandinaviens största flygbolag' },
  { slug: 'norwegian',         name: 'Norwegian',         img: 'norwegian-boeing.jpg',                tagline: 'Vanliga förseningar på Europalinjer' },
  { slug: 'ryanair',           name: 'Ryanair',           img: 'ryanair-boeing.jpg',                  tagline: 'Nekar ofta ersättning — vi driver ärendet' },
  { slug: 'wizz-air',          name: 'Wizz Air',          img: 'wizz-air-airbus.jpg',                 tagline: 'Snabbväxande lågprisflygare inom EU' },
  { slug: 'easyjet',           name: 'EasyJet',           img: 'easyjet-airbus.jpg',                  tagline: 'Europeiskt lågprisbolag med EU-täckning' },
  { slug: 'finnair',           name: 'Finnair',           img: 'finnair-airbus.jpg',                  tagline: 'Nordisk EU-flygare via Helsingfors' },
  { slug: 'klm',               name: 'KLM',               img: 'klm-boeing-737.jpg',                  tagline: 'Gäller även flyg utanför Europa' },
  { slug: 'lufthansa',         name: 'Lufthansa',         img: 'lufthansa-incheckning-frankfurt.jpg', tagline: 'Europas största flygbolag' },
  { slug: 'eurowings',         name: 'Eurowings',         img: 'eurowings-airbus.jpg',                tagline: 'Lufthansas budget-arm inom EU' },
  { slug: 'turkish-airlines',  name: 'Turkish Airlines',  img: 'turkish-airlines-airbus.jpg',         tagline: 'Gäller vid avgångar från EU' },
  { slug: 'air-france',        name: 'Air France',        img: 'air-france-airbus.jpg',               tagline: 'Interkontinentala rutter via Paris CDG' },
  { slug: 'british-airways',   name: 'British Airways',   img: 'british-airways-boeing.jpg',          tagline: 'EU 261 vid avgångar från EU' },
  { slug: 'vueling',           name: 'Vueling',           img: 'vueling-airbus.jpg',                  tagline: 'Dominerande på Spanien-rutter' },
  { slug: 'transavia',         name: 'Transavia',         img: 'transavia-boeing.jpg',                tagline: 'KLM-gruppens semesterflygbolag' },
  { slug: 'tap-air-portugal',  name: 'TAP Air Portugal',  img: 'tap-air-portugal-airbus.jpg',         tagline: 'Europas gateway till Latinamerika' },
  { slug: 'iberia',            name: 'Iberia',            img: 'iberia-airbus.jpg',                   tagline: 'Spaniens nationella bolag via Madrid' },
  { slug: 'brussels-airlines',    name: 'Brussels Airlines',    img: 'brussels-airlines-airbus.jpg',     tagline: 'Lufthansa-gruppen, hubbar i Bryssel' },
  { slug: 'aer-lingus',           name: 'Aer Lingus',           img: 'aer-lingus-airbus.jpg',            tagline: 'IAG-gruppen, transatlantisk hubb Dublin' },
  { slug: 'austrian-airlines',    name: 'Austrian Airlines',    img: 'austrian-airlines-airbus.jpg',     tagline: 'Lufthansa-gruppen, hubbar i Wien' },
  { slug: 'lot-polish-airlines',  name: 'LOT Polish Airlines',  img: 'lot-polish-airlines-boeing.jpg',   tagline: 'Polens nationella bolag via Warszawa' },
  { slug: 'aegean-airlines',      name: 'Aegean Airlines',      img: 'aegean-airlines-airbus.jpg',       tagline: 'Star Alliance, populär på Grekland-rutter' },
  { slug: 'condor',               name: 'Condor',               img: 'condor-airbus.jpg',                tagline: 'Charterflygare på långdistansrutter' },
  { slug: 'tui-fly',              name: 'TUI fly',              img: 'tui-fly-boeing.jpg',               tagline: 'Semesterflygare — EU 261 gäller ändå' },
  { slug: 'airbaltic',            name: 'airBaltic',            img: 'airbaltic-airbus.jpg',             tagline: 'Lettlands nationella bolag via Riga' },
  { slug: 'icelandair',           name: 'Icelandair',           img: 'icelandair-boeing.jpg',            tagline: 'EES-bolag — täcks av EU 261' },
  { slug: 'ita-airways',          name: 'ITA Airways',          img: 'ita-airways-airbus.jpg',           tagline: 'Italiens nationella bolag, Lufthansa-gruppen' },
];

router.get('/flygbolag', (_req, res) => {
  res.render('pages/flygbolag', {
    title: 'Flygbolag — ersättning vid försening & inställt flyg | FlightClaim',
    metaDesc: 'Hitta ditt flygbolag och läs om dina rättigheter enligt EU 261/2004. Vi driver ersättningsärenden mot SAS, Ryanair, KLM, Norwegian och fler.',
    canonical: '/flygbolag',
    airlines: AIRLINES,
  });
});

// ── Blog index ─────────────────────────────────────────────────────────────

const BLOG_CATEGORIES: Record<string, string> = {
  'forsening':      'Förseningar',
  'installda-flyg': 'Inställda flyg',
  'flygbolag':      'Flygbolag',
  'rattigheter':    'Dina rättigheter',
  'case-study':     'Case studies',
};

router.get('/blogg', async (req, res) => {
  const aktiv = typeof req.query.kategori === 'string' && BLOG_CATEGORIES[req.query.kategori]
    ? req.query.kategori
    : null;
  const siteUrl = (res.locals.siteUrl as string | undefined) ?? 'https://flightclaim.se';

  try {
    const query = db('articles')
      .where({ type: 'blog', status: 'published' })
      .orderBy('created_at', 'desc')
      .select('id', 'slug', 'title', 'meta_desc', 'created_at', 'category');

    if (aktiv) query.where({ category: aktiv });

    const posts = await query;

    const blogSchema = {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      '@id': `${siteUrl}/blogg#blog`,
      url: `${siteUrl}/blogg`,
      name: 'FlightClaim Blogg',
      description: 'Guider, case studies och nyheter om flygkompensation och EU 261/2004.',
      inLanguage: 'sv-SE',
      publisher: { '@id': `${siteUrl}/#organization` },
      blogPost: posts.slice(0, 20).map((p: { slug: string; title: string; meta_desc: string | null; created_at: string }) => ({
        '@type': 'BlogPosting',
        headline: p.title,
        url: `${siteUrl}/${p.slug}`,
        datePublished: p.created_at,
        ...(p.meta_desc ? { description: p.meta_desc } : {}),
      })),
    };

    res.render('pages/blogg', {
      title: 'Blogg om flygrättigheter | FlightClaim.se',
      metaDesc: 'Guider, case studies och nyheter om flygkompensation och EU 261/2004. Lär dig kräva ersättning för försenat eller inställt flyg.',
      canonical: '/blogg',
      posts,
      kategorier: BLOG_CATEGORIES,
      aktiv,
      scripts: `<script type="application/ld+json">${JSON.stringify(blogSchema)}</script>`,
    });
  } catch (err) {
    logger.error({ err }, 'Blogg index error');
    res.status(500).render('pages/404', { title: 'Serverfel | FlightClaim', metaDesc: '' });
  }
});

// ── RSS feed ───────────────────────────────────────────────────────────────

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

router.get('/feed.xml', async (_req, res) => {
  const siteUrl = (res.locals.siteUrl as string | undefined) ?? 'https://flightclaim.se';

  try {
    const posts = await db('articles')
      .where({ type: 'blog', status: 'published' })
      .orderBy('created_at', 'desc')
      .limit(30)
      .select('slug', 'title', 'meta_desc', 'created_at', 'updated_at');

    const lastBuild = posts.length > 0
      ? new Date(posts[0].updated_at ?? posts[0].created_at).toUTCString()
      : new Date().toUTCString();

    const items = posts.map((p: { slug: string; title: string; meta_desc: string | null; created_at: string }) => {
      const link = `${siteUrl}/${p.slug}`;
      const desc = p.meta_desc ?? '';
      const pubDate = new Date(p.created_at).toUTCString();
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(desc)}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FlightClaim Blogg</title>
    <link>${escapeXml(siteUrl + '/blogg')}</link>
    <atom:link href="${escapeXml(siteUrl + '/feed.xml')}" rel="self" type="application/rss+xml" />
    <description>Guider, case studies och nyheter om flygkompensation och EU 261/2004.</description>
    <language>sv-SE</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>`;

    res.type('application/rss+xml; charset=utf-8').send(xml);
  } catch (err) {
    logger.error({ err }, 'RSS feed error');
    res.status(500).type('text/plain').send('Serverfel');
  }
});

// ── Försenat flyg pillar page ──────────────────────────────────────────────

router.get('/forsening', async (_req, res) => {
  try {
    const [articles, airlineArticles, topRoutes] = await Promise.all([
      db('articles')
        .where({ type: 'blog', status: 'published', category: 'forsening' })
        .orderBy('created_at', 'desc')
        .select('slug', 'title', 'meta_desc', 'created_at', 'category'),
      db('articles')
        .where({ type: 'airline', status: 'published' })
        .orderBy('title', 'asc')
        .select('slug', 'title', 'meta_desc'),
      db('routes')
        .where({ published: true })
        .orderBy('comp_amount', 'desc')
        .limit(9)
        .select('slug', 'dep_city', 'arr_city', 'comp_amount'),
    ]);

    res.render('pages/forsening', {
      title: 'Försenat flyg – rätt till upp till 600€ ersättning | FlightClaim',
      metaDesc: 'Har ditt flyg landat mer än 3 timmar försenat? Enligt EU 261/2004 kan du ha rätt till 250–600€ per person. Läs om dina rättigheter och ansök gratis.',
      canonical: '/forsening',
      articles,
      airlineArticles,
      topRoutes,
    });
  } catch (err) {
    logger.error({ err }, 'Forsening page error');
    res.status(500).render('pages/404', { title: 'Serverfel | FlightClaim', metaDesc: '' });
  }
});

// ── Inställt flyg pillar page ──────────────────────────────────────────────

router.get('/installda-flyg', async (_req, res) => {
  try {
    const [articles, airlineArticles, topRoutes] = await Promise.all([
      db('articles')
        .where({ type: 'blog', status: 'published', category: 'installda-flyg' })
        .orderBy('created_at', 'desc')
        .select('slug', 'title', 'meta_desc', 'created_at', 'category'),
      db('articles')
        .where({ type: 'airline', status: 'published' })
        .orderBy('title', 'asc')
        .select('slug', 'title', 'meta_desc'),
      db('routes')
        .where({ published: true })
        .orderBy('comp_amount', 'desc')
        .limit(9)
        .select('slug', 'dep_city', 'arr_city', 'comp_amount'),
    ]);

    res.render('pages/installda-flyg', {
      title: 'Inställt flyg – få ersättning och dina rättigheter | FlightClaim',
      metaDesc: 'Inställt flyg? Enligt EU 261/2004 kan du ha rätt till 250–600€ per person. Läs om vad som gäller och ansök om ersättning kostnadsfritt.',
      canonical: '/installda-flyg',
      articles,
      airlineArticles,
      topRoutes,
    });
  } catch (err) {
    logger.error({ err }, 'Installda-flyg page error');
    res.status(500).render('pages/404', { title: 'Serverfel | FlightClaim', metaDesc: '' });
  }
});

// ── Rutter index ──────────────────────────────────────────────────────────

router.get('/rutter', async (_req, res) => {
  try {
    const routes = await db('routes')
      .where({ published: true })
      .orderBy('comp_amount', 'desc')
      .orderBy('dep_city', 'asc')
      .select('slug', 'dep_city', 'arr_city', 'dep_airport', 'arr_airport', 'distance_km', 'comp_amount');

    res.render('pages/rutter', {
      title: 'Rutter — försenat flyg och ersättning per sträcka | FlightClaim',
      metaDesc: 'Hitta din flygrutt och läs om rätten till upp till 600€ ersättning enligt EU 261/2004. Täcker Stockholm, Göteborg, Malmö och populära semesterrutter.',
      canonical: '/rutter',
      routes,
    });
  } catch (err) {
    logger.error({ err }, 'Rutter index error');
    res.status(500).render('pages/404', { title: 'Serverfel | FlightClaim', metaDesc: '' });
  }
});

// ── Rutt-specifika landningssidor ─────────────────────────────────────────

router.get('/rutter/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const routeRaw = await db('routes').where({ slug, published: true }).first<Route & { airlines: string | string[] | null }>();

    if (!routeRaw) {
      res.status(404).render('pages/404', { title: 'Sidan hittades inte | FlightClaim', metaDesc: '' });
      return;
    }

    const rawAirlines = routeRaw.airlines;
    let airlineList: string[] = [];
    if (Array.isArray(rawAirlines)) {
      airlineList = rawAirlines;
    } else if (typeof rawAirlines === 'string') {
      try { airlineList = JSON.parse(rawAirlines); }
      catch { airlineList = (rawAirlines as string).split(',').map((s: string) => s.trim()); }
    }

    const route: Route = { ...routeRaw, airlines: airlineList };

    const airlineLinks = airlineList.map(name => ({
      name,
      slug: AIRLINE_SLUG_MAP[name] ?? null,
    }));

    const faqSchema = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: `Hur lång försening krävs för flyg ${route.dep_city}–${route.arr_city}?`, acceptedAnswer: { '@type': 'Answer', text: `Du måste anlända till ${route.arr_city} minst 3 timmar försenat för att ha rätt till ersättning enligt EU 261/2004.` } },
        { '@type': 'Question', name: `Hur mycket ersättning kan jag få för flyg ${route.dep_city}–${route.arr_city}?`, acceptedAnswer: { '@type': 'Answer', text: `Rutten ${route.dep_city}–${route.arr_city} är ca ${route.distance_km ?? '?'} km. Det innebär att du kan ha rätt till ${route.comp_amount ?? '250–600'}€ per person enligt EU 261/2004.` } },
        { '@type': 'Question', name: 'Vilka flygbolag flyger den här rutten?', acceptedAnswer: { '@type': 'Answer', text: `Vanliga flygbolag på ${route.dep_city}–${route.arr_city} inkluderar ${airlineList.join(', ')}.` } },
        { '@type': 'Question', name: 'Kostar det något att ansöka?', acceptedAnswer: { '@type': 'Answer', text: 'Nej. FlightClaim tar ingen förskottsbetalning. Vi tar 25% + moms av ersättningen om vi vinner — betalar vi inget om vi förlorar.' } },
      ],
    });

    const routeBodyHtml = route.content ? renderMarkdown(route.content) : null;

    res.render('pages/rutt', {
      route,
      airlineLinks,
      routeBodyHtml,
      title:    route.meta_title ?? `Försenat flyg ${route.dep_city}–${route.arr_city}? Kräv ${route.comp_amount ?? '250–600'}€ | FlightClaim`,
      metaDesc: route.meta_desc  ?? '',
      canonical: `/rutter/${route.slug}`,
      scripts:  `<script type="application/ld+json">${faqSchema}</script>`,
    });
  } catch (err) {
    logger.error({ err, slug }, 'Rutt page error');
    res.status(500).render('pages/404', { title: 'Serverfel | FlightClaim', metaDesc: '' });
  }
});

// ── Författar-sidor ────────────────────────────────────────────────────────

router.get('/forfattare/:slug', async (req, res) => {
  const { slug } = req.params;
  const siteUrl = (res.locals.siteUrl as string | undefined) ?? 'https://flightclaim.se';

  try {
    const author = await db('authors').where({ slug }).first<Author>();

    if (!author) {
      res.status(404).render('pages/404', { title: 'Sidan hittades inte | FlightClaim', metaDesc: '' });
      return;
    }

    const articles = await db('articles')
      .where({ author_id: author.id, status: 'published' })
      .orderBy('created_at', 'desc')
      .limit(20)
      .select('slug', 'title', 'meta_desc', 'type', 'created_at');

    const personSchema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': `${siteUrl}/forfattare/${author.slug}#person`,
      name: author.name,
      url: `${siteUrl}/forfattare/${author.slug}`,
      ...(author.role ? { jobTitle: author.role } : {}),
      ...(author.credentials ? { description: author.credentials } : {}),
      ...(author.image_url ? { image: `${siteUrl}${author.image_url}` } : {}),
      ...(author.email ? { email: author.email } : {}),
      ...(author.linkedin_url ? { sameAs: [author.linkedin_url] } : {}),
      worksFor: { '@id': `${siteUrl}/#organization` },
    };

    res.render('pages/forfattare', {
      author,
      articles,
      title:    `${author.name}${author.role ? ', ' + author.role : ''} | FlightClaim`,
      metaDesc: author.credentials ?? `Artiklar av ${author.name} på FlightClaim.`,
      canonical: `/forfattare/${author.slug}`,
      scripts: `<script type="application/ld+json">${JSON.stringify(personSchema)}</script>`,
    });
  } catch (err) {
    logger.error({ err, slug }, 'Författar-sida fel');
    res.status(500).render('pages/404', { title: 'Serverfel | FlightClaim', metaDesc: '' });
  }
});

// ── CMS article catch-all (must stay LAST) ─────────────────────────────────

router.get('/:slug{/*path}', async (req, res) => {
  const slug = req.params.slug + (req.params.path ? '/' + req.params.path : '');
  const siteUrl = (res.locals.siteUrl as string | undefined) ?? 'https://flightclaim.se';

  try {
    const article = await db('articles').where({ slug, status: 'published' }).first<Article>();

    if (!article) {
      res.status(404).render('pages/404', { title: 'Sidan hittades inte | FlightClaim', metaDesc: '' });
      return;
    }

    const faqItems   = parseFaq(article.faq_json);
    const crumbs     = await buildBreadcrumbs(article, siteUrl);
    const bodyHtml   = renderMarkdown(article.content ?? '');
    const heroImage  = extractFirstImage(article.content);
    const words      = wordCount(article.content);
    const readMin    = readingTimeMinutes(article.content);
    const tocEntries = extractToc(article.content);
    const toc        = tocEntries.length >= 3 ? tocEntries : null;
    const author     = article.author_id
      ? (await db('authors').where({ id: article.author_id }).first<Author>()) ?? null
      : null;
    const schemaJson = buildSchemaJson(article, faqItems, crumbs, siteUrl, { heroImage, words, author });

    const relatedArticles = await buildRelatedArticles(article);

    res.render('pages/artikel', {
      article,
      bodyHtml,
      faqItems,
      crumbs,
      schemaJson,
      relatedArticles,
      readMin,
      words,
      author,
      toc,
      updatedAtLabel: formatSwedishDate(article.updated_at ?? article.created_at),
      title:    article.meta_title ?? `${article.title} | FlightClaim.se`,
      metaDesc: article.meta_desc  ?? '',
      canonical: `/${article.slug}`,
      ogType: 'article',
      ogImage: heroImage ?? undefined,
    });
  } catch (err) {
    logger.error({ err, slug }, 'Content route error');
    res.status(500).render('pages/404', { title: 'Serverfel | FlightClaim', metaDesc: '' });
  }
});

export default router;
