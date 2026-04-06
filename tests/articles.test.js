const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');
const { setupTestDb, teardownTestDb } = require('./helpers');

const AUTH = { user: 'admin', pass: 'testpass' };

beforeAll(async () => { await setupTestDb(); });
afterEach(async () => { await db('articles').truncate(); });
afterAll(async () => { await teardownTestDb(); });

const validArticle = {
  type: 'guide',
  status: 'published',
  slug: 'forsening',
  title: 'Försenat flyg — din guide',
  meta_title: 'Försenat flyg ersättning',
  meta_desc: 'Allt du behöver veta om ersättning vid försenat flyg.',
  content: '## Intro\nHär är guiden.',
  schema_type: 'FAQPage',
  faq_json: JSON.stringify([{ q: 'Vad gäller?', a: 'EU261 gäller.' }]),
};

describe('GET /api/articles', () => {
  it('returns 401 without credentials', async () => {
    expect((await request(app).get('/api/articles')).status).toBe(401);
  });

  it('returns empty array when no articles exist', async () => {
    const res = await request(app).get('/api/articles').auth(AUTH.user, AUTH.pass);
    expect(res.status).toBe(200);
    expect(res.body.articles).toEqual([]);
  });

  it('filters by type', async () => {
    await db('articles').insert({ ...validArticle, slug: 'a1', type: 'guide' });
    await db('articles').insert({ ...validArticle, slug: 'a2', type: 'blog' });
    const res = await request(app).get('/api/articles?type=blog').auth(AUTH.user, AUTH.pass);
    expect(res.body.articles).toHaveLength(1);
    expect(res.body.articles[0].type).toBe('blog');
  });

  it('filters by status', async () => {
    await db('articles').insert({ ...validArticle, slug: 'a1', status: 'published' });
    await db('articles').insert({ ...validArticle, slug: 'a2', status: 'draft' });
    const res = await request(app).get('/api/articles?status=draft').auth(AUTH.user, AUTH.pass);
    expect(res.body.articles).toHaveLength(1);
    expect(res.body.articles[0].status).toBe('draft');
  });
});

describe('POST /api/articles', () => {
  it('returns 401 without credentials', async () => {
    expect((await request(app).post('/api/articles').send(validArticle)).status).toBe(401);
  });

  it('creates an article and returns 201', async () => {
    const res = await request(app).post('/api/articles').auth(AUTH.user, AUTH.pass).send(validArticle);
    expect(res.status).toBe(201);
    expect(res.body.article.slug).toBe('forsening');
    expect(res.body.article.title).toBe('Försenat flyg — din guide');
    expect(Array.isArray(res.body.article.faq_json)).toBe(true);
  });

  it('auto-generates slug from title when slug omitted', async () => {
    const { slug: _omit, ...withoutSlug } = validArticle;
    const res = await request(app).post('/api/articles').auth(AUTH.user, AUTH.pass).send(withoutSlug);
    expect(res.status).toBe(201);
    expect(res.body.article.slug).toBeTruthy();
  });

  it('returns 409 on duplicate slug', async () => {
    await request(app).post('/api/articles').auth(AUTH.user, AUTH.pass).send(validArticle);
    const res = await request(app).post('/api/articles').auth(AUTH.user, AUTH.pass).send(validArticle);
    expect(res.status).toBe(409);
  });

  it('returns 400 when type is missing', async () => {
    const { type: _omit, ...noType } = validArticle;
    const res = await request(app).post('/api/articles').auth(AUTH.user, AUTH.pass).send(noType);
    expect(res.status).toBe(400);
  });

  it('returns 400 when title is missing', async () => {
    const { title: _omit, ...noTitle } = validArticle;
    const res = await request(app).post('/api/articles').auth(AUTH.user, AUTH.pass).send(noTitle);
    expect(res.status).toBe(400);
  });
});

describe('GET /api/articles/:slug', () => {
  it('returns 404 for non-existent slug', async () => {
    const res = await request(app).get('/api/articles/ingen-artikel').auth(AUTH.user, AUTH.pass);
    expect(res.status).toBe(404);
  });

  it('returns article with parsed faq_json', async () => {
    await request(app).post('/api/articles').auth(AUTH.user, AUTH.pass).send(validArticle);
    const res = await request(app).get('/api/articles/forsening').auth(AUTH.user, AUTH.pass);
    expect(res.status).toBe(200);
    expect(res.body.article.slug).toBe('forsening');
    expect(Array.isArray(res.body.article.faq_json)).toBe(true);
  });

  it('handles nested slugs (parent/child)', async () => {
    const nested = { ...validArticle, slug: 'forsening/hur-mycket', parent_slug: 'forsening' };
    await request(app).post('/api/articles').auth(AUTH.user, AUTH.pass).send(nested);
    const res = await request(app).get('/api/articles/forsening/hur-mycket').auth(AUTH.user, AUTH.pass);
    expect(res.status).toBe(200);
    expect(res.body.article.parent_slug).toBe('forsening');
  });
});

describe('PUT /api/articles/:slug', () => {
  it('updates an existing article', async () => {
    await request(app).post('/api/articles').auth(AUTH.user, AUTH.pass).send(validArticle);
    const res = await request(app)
      .put('/api/articles/forsening')
      .auth(AUTH.user, AUTH.pass)
      .send({ ...validArticle, title: 'Uppdaterad titel', status: 'published' });
    expect(res.status).toBe(200);
    expect(res.body.article.title).toBe('Uppdaterad titel');
  });

  it('returns 404 for non-existent slug', async () => {
    const res = await request(app)
      .put('/api/articles/finns-ej')
      .auth(AUTH.user, AUTH.pass)
      .send(validArticle);
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/articles/:slug', () => {
  it('deletes article and returns 204', async () => {
    await request(app).post('/api/articles').auth(AUTH.user, AUTH.pass).send(validArticle);
    const res = await request(app).delete('/api/articles/forsening').auth(AUTH.user, AUTH.pass);
    expect(res.status).toBe(204);
    const check = await db('articles').where({ slug: 'forsening' });
    expect(check).toHaveLength(0);
  });

  it('returns 404 for non-existent slug', async () => {
    const res = await request(app).delete('/api/articles/finns-ej').auth(AUTH.user, AUTH.pass);
    expect(res.status).toBe(404);
  });
});
