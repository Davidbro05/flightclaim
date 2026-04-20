import express from 'express';
import db from '../db';
import logger from '../logger';
import type { Article } from '../types';

const router = express.Router();

// Use explicit sitemap columns if set; otherwise fall back to type-based defaults.
function articlePriority(article: Article): { priority: string; changefreq: string } {
  if (article.sitemap_priority) {
    return {
      priority: article.sitemap_priority,
      changefreq: article.sitemap_changefreq ?? 'monthly',
    };
  }
  if (article.parent_slug === null) return { priority: '0.8', changefreq: 'weekly' };
  if (article.type === 'guide')     return { priority: '0.7', changefreq: 'monthly' };
  if (article.type === 'airline')   return { priority: '0.6', changefreq: 'monthly' };
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
      .orderBy('sitemap_priority', 'desc')
      .orderBy('created_at', 'asc')
      .select<Article[]>();

    const urls: string[] = articles.map(a => {
      const { priority, changefreq } = articlePriority(a);
      // slug '' = homepage, produces https://flightclaim.se/
      const loc = a.slug === '' ? siteUrl + '/' : `${siteUrl}/${esc(a.slug)}`;
      return url(loc, priority, changefreq, a.updated_at ?? a.created_at);
    });

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
