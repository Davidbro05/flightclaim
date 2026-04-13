import express from 'express';
import db from '../db';
import logger from '../logger';
import authenticate from '../middleware/auth';
import type { Article } from '../types';

const router = express.Router();

router.use(authenticate);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/å/g, 'a').replace(/ä/g, 'a').replace(/ö/g, 'o')
    .replace(/[^a-z0-9/]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface ArticleBody {
  type?: string;
  status?: string;
  slug?: string;
  parent_slug?: string;
  title?: string;
  meta_title?: string;
  meta_desc?: string;
  content?: string;
  schema_type?: string;
  faq_json?: unknown;
  affiliate_ref?: string;
}

function parseBody(body: ArticleBody): { errors: string[]; data: Partial<Article> } {
  const { type, status, slug, parent_slug, title, meta_title, meta_desc, content, schema_type, faq_json, affiliate_ref } = body;

  const errors: string[] = [];
  if (!type || !['guide', 'airline', 'blog'].includes(type)) errors.push('Ogiltigt type (guide/airline/blog)');
  if (!title?.trim()) errors.push('title krävs');
  if (schema_type && !['FAQPage', 'Article', 'none'].includes(schema_type)) errors.push('Ogiltigt schema_type');

  let parsedFaq: unknown = null;
  if (faq_json) {
    try {
      parsedFaq = typeof faq_json === 'string' ? JSON.parse(faq_json) : faq_json;
      if (!Array.isArray(parsedFaq)) errors.push('faq_json måste vara en array');
    } catch {
      errors.push('faq_json är ogiltig JSON');
    }
  }

  return {
    errors,
    data: {
      type: type as Article['type'],
      status: (status ?? 'draft') as Article['status'],
      slug: slug ? slug.trim() : slugify(title ?? ''),
      parent_slug: parent_slug ?? null,
      title: title?.trim(),
      meta_title: meta_title?.trim() ?? null,
      meta_desc: meta_desc?.trim() ?? null,
      content: content ?? null,
      schema_type: (schema_type ?? 'none') as Article['schema_type'],
      faq_json: parsedFaq ? JSON.stringify(parsedFaq) : null,
      affiliate_ref: affiliate_ref ?? null,
    },
  };
}

function parseSlug(req: express.Request): string {
  return req.params.slug + (req.params.path ? '/' + req.params.path : '');
}

function parseFaqJson(article: Article): Article {
  if (article.faq_json && typeof article.faq_json === 'string') {
    try {
      const parsed: unknown = JSON.parse(article.faq_json);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (article as any).faq_json = parsed;
    } catch { /* leave as string */ }
  }
  return article;
}

router.get('/', async (req, res) => {
  try {
    const { type, status } = req.query as { type?: string; status?: string };
    let query = db('articles').orderBy('created_at', 'desc');
    if (type)   query = query.where({ type });
    if (status) query = query.where({ status });
    const articles = await query.select<Article[]>();
    res.json({ articles });
  } catch (err) {
    logger.error({ err }, 'Articles API: list failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

router.get('/:slug{/*path}', async (req, res) => {
  const slug = parseSlug(req);
  try {
    const article = await db('articles').where({ slug }).first<Article>();
    if (!article) { res.status(404).json({ error: 'Artikel hittades inte' }); return; }
    res.json({ article: parseFaqJson(article) });
  } catch (err) {
    logger.error({ err }, 'Articles API: get failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

router.post('/', async (req, res) => {
  const { errors, data } = parseBody(req.body as ArticleBody);
  if (errors.length) { res.status(400).json({ errors }); return; }

  try {
    const existing = await db('articles').where({ slug: data.slug }).first<Article>();
    if (existing) { res.status(409).json({ errors: [`Slug "${data.slug}" används redan`] }); return; }

    const [id] = await db('articles').insert(data);
    const article = await db('articles').where({ id }).first<Article>();
    res.status(201).json({ article: article ? parseFaqJson(article) : null });
  } catch (err) {
    logger.error({ err }, 'Articles API: create failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

router.put('/:slug{/*path}', async (req, res) => {
  const slug = parseSlug(req);
  const { errors, data } = parseBody(req.body as ArticleBody);
  if (errors.length) { res.status(400).json({ errors }); return; }

  try {
    const existing = await db('articles').where({ slug }).first<Article>();
    if (!existing) { res.status(404).json({ error: 'Artikel hittades inte' }); return; }

    if (data.slug !== slug) {
      const conflict = await db('articles').where({ slug: data.slug }).first<Article>();
      if (conflict) { res.status(409).json({ errors: [`Slug "${data.slug}" används redan`] }); return; }
    }

    await db('articles').where({ slug }).update({ ...data, updated_at: db.fn.now() });
    const article = await db('articles').where({ slug: data.slug }).first<Article>();
    res.json({ article: article ? parseFaqJson(article) : null });
  } catch (err) {
    logger.error({ err }, 'Articles API: update failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

router.delete('/:slug{/*path}', async (req, res) => {
  const slug = parseSlug(req);
  try {
    const deleted = await db('articles').where({ slug }).delete();
    if (deleted === 0) { res.status(404).json({ error: 'Artikel hittades inte' }); return; }
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, 'Articles API: delete failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

export default router;
