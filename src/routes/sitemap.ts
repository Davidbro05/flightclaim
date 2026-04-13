import express from 'express';
import db from '../db';
import logger from '../logger';
import type { Article } from '../types';

const router = express.Router();

// Priority config by article type and position
function articlePriority(article: Article): { priority: string; changefreq: string } {
  if (article.parent_slug === null) {
    // Top-level pillar articles
    return { priority: '0.8', changefreq: 'weekly' };
  }
  if (article.type === 'guide') {
    return { priority: '0.7', changefreq: 'monthly' };
  }
  if (article.type === 'airline') {
    return { priority: '0.6', changefreq: 'monthly' };
  }
  // blog
  return { priority: '0.5', changefreq: 'monthly' };
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// pg driver returns timestamps as Date objects; sqlite returns strings.
function toDateStr(d: unknown): string {
  if (!d) return new Date().toISOString().slice(0, 10);
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return String(d).slice(0, 10);
}

function url(loc: string, priority: string, changefreq: string, lastmod?: unknown): string {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    lastmod ? `    <lastmod>${toDateStr(lastmod)}</lastmod>` : '',
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].filter(Boolean).join('\n');
}

router.get('/sitemap.xml', async (req, res) => {
  const siteUrl = (res.locals.siteUrl as string | undefined) ?? 'https://flightclaim.se';
  const today = new Date().toISOString().slice(0, 10);

  try {
    const articles = await db('articles')
      .where({ status: 'published' })
      .orderBy('created_at', 'asc')
      .select<Article[]>();

    const staticPages = [
      // Conversion page — highest priority
      { path: '/anmalan',            priority: '1.0', changefreq: 'monthly'  },
      // Homepage
      { path: '/',                   priority: '0.9', changefreq: 'weekly'   },
      // Supporting static pages
      { path: '/sa-fungerar-det',    priority: '0.6', changefreq: 'monthly'  },
      { path: '/om-oss',             priority: '0.4', changefreq: 'yearly'   },
      { path: '/kontakt',            priority: '0.4', changefreq: 'yearly'   },
      { path: '/integritetspolicy',  priority: '0.3', changefreq: 'yearly'   },
    ];

    const urls: string[] = [
      ...staticPages.map(p => url(`${siteUrl}${p.path}`, p.priority, p.changefreq, today)),
      ...articles.map(a => {
        const { priority, changefreq } = articlePriority(a);
        return url(
          `${siteUrl}/${esc(a.slug)}`,
          priority,
          changefreq,
          a.updated_at ?? a.created_at,
        );
      }),
    ];

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls,
      '</urlset>',
    ].join('\n');

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600'); // 1 h cache
    res.send(xml);
  } catch (err) {
    logger.error({ err }, 'Sitemap generation failed');
    res.status(500).send('<?xml version="1.0"?><error>Serverfel</error>');
  }
});

export default router;
