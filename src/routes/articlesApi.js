const express = require('express');
const db = require('../db');
const logger = require('../logger');
const authenticate = require('../middleware/auth');

const router = express.Router();

// All article routes require authentication
router.use(authenticate);

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/å/g, 'a').replace(/ä/g, 'a').replace(/ö/g, 'o')
    .replace(/[^a-z0-9/]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseBody(body) {
  const {
    type, status, slug, parent_slug, title,
    meta_title, meta_desc, content,
    schema_type, faq_json, affiliate_ref,
  } = body;

  const errors = [];
  if (!type || !['guide', 'airline', 'blog'].includes(type)) errors.push('Ogiltigt type (guide/airline/blog)');
  if (!title || !title.trim()) errors.push('title krävs');
  if (schema_type && !['FAQPage', 'Article', 'none'].includes(schema_type)) errors.push('Ogiltigt schema_type');

  let parsedFaq = null;
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
      type,
      status: status || 'draft',
      slug: slug ? slug.trim() : slugify(title),
      parent_slug: parent_slug || null,
      title: title?.trim(),
      meta_title: meta_title?.trim() || null,
      meta_desc: meta_desc?.trim() || null,
      content: content || null,
      schema_type: schema_type || 'none',
      faq_json: parsedFaq ? JSON.stringify(parsedFaq) : null,
      affiliate_ref: affiliate_ref || null,
    },
  };
}

// GET /api/articles
router.get('/', async (req, res) => {
  try {
    const { type, status } = req.query;
    let query = db('articles').orderBy('created_at', 'desc');
    if (type)   query = query.where({ type });
    if (status) query = query.where({ status });
    const articles = await query;
    res.json({ articles });
  } catch (err) {
    logger.error({ err }, 'Articles API: list failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

// GET /api/articles/:slug — supports nested slugs like forsening/hur-mycket
router.get('/:slug{/*path}', async (req, res) => {
  req.params.slug = req.params.slug + (req.params.path ? '/' + req.params.path : '');
  try {
    const article = await db('articles').where({ slug: req.params.slug }).first();
    if (!article) return res.status(404).json({ error: 'Artikel hittades inte' });
    if (article.faq_json && typeof article.faq_json === 'string') {
      article.faq_json = JSON.parse(article.faq_json);
    }
    res.json({ article });
  } catch (err) {
    logger.error({ err }, 'Articles API: get failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

// POST /api/articles
router.post('/', async (req, res) => {
  const { errors, data } = parseBody(req.body);
  if (errors.length) return res.status(400).json({ errors });

  try {
    const existing = await db('articles').where({ slug: data.slug }).first();
    if (existing) return res.status(409).json({ errors: [`Slug "${data.slug}" används redan`] });

    const [id] = await db('articles').insert(data);
    const article = await db('articles').where({ id }).first();
    if (article.faq_json && typeof article.faq_json === 'string') {
      article.faq_json = JSON.parse(article.faq_json);
    }
    res.status(201).json({ article });
  } catch (err) {
    logger.error({ err }, 'Articles API: create failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

// PUT /api/articles/:slug
router.put('/:slug{/*path}', async (req, res) => {
  req.params.slug = req.params.slug + (req.params.path ? '/' + req.params.path : '');
  const { errors, data } = parseBody(req.body);
  if (errors.length) return res.status(400).json({ errors });

  try {
    const existing = await db('articles').where({ slug: req.params.slug }).first();
    if (!existing) return res.status(404).json({ error: 'Artikel hittades inte' });

    // If slug changed, check new slug is not taken
    if (data.slug !== req.params.slug) {
      const conflict = await db('articles').where({ slug: data.slug }).first();
      if (conflict) return res.status(409).json({ errors: [`Slug "${data.slug}" används redan`] });
    }

    await db('articles').where({ slug: req.params.slug }).update({
      ...data,
      updated_at: db.fn.now(),
    });

    const article = await db('articles').where({ slug: data.slug }).first();
    if (article.faq_json && typeof article.faq_json === 'string') {
      article.faq_json = JSON.parse(article.faq_json);
    }
    res.json({ article });
  } catch (err) {
    logger.error({ err }, 'Articles API: update failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

// DELETE /api/articles/:slug
router.delete('/:slug{/*path}', async (req, res) => {
  req.params.slug = req.params.slug + (req.params.path ? '/' + req.params.path : '');
  try {
    const deleted = await db('articles').where({ slug: req.params.slug }).delete();
    if (deleted === 0) return res.status(404).json({ error: 'Artikel hittades inte' });
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, 'Articles API: delete failed');
    res.status(500).json({ error: 'Databasfel' });
  }
});

module.exports = router;
