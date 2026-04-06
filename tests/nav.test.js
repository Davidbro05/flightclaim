const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');
const { setupTestDb, teardownTestDb } = require('./helpers');

const AUTH = { user: 'admin', pass: 'testpass' };

beforeAll(async () => { await setupTestDb(); });
afterAll(async () => { await teardownTestDb(); });

describe('GET /api/nav (public)', () => {
  it('returns 200 without credentials', async () => {
    const res = await request(app).get('/api/nav');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.nav)).toBe(true);
  });

  it('returns nested tree structure', async () => {
    const res = await request(app).get('/api/nav');
    const forsenat = res.body.nav.find((n) => n.url === '/forsening');
    expect(forsenat).toBeDefined();
    expect(Array.isArray(forsenat.children)).toBe(true);
    expect(forsenat.children.length).toBeGreaterThan(0);
  });

  it('includes all top-level items from seed', async () => {
    const res = await request(app).get('/api/nav');
    const urls = res.body.nav.map((n) => n.url);
    expect(urls).toContain('/forsening');
    expect(urls).toContain('/installda-flyg');
    expect(urls).toContain('/flygbolag');
    expect(urls).toContain('/blogg');
  });
});

describe('GET /api/nav/flat (admin)', () => {
  it('returns 401 without credentials', async () => {
    expect((await request(app).get('/api/nav/flat')).status).toBe(401);
  });

  it('returns flat list of all nav items', async () => {
    const res = await request(app).get('/api/nav/flat').auth(AUTH.user, AUTH.pass);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
  });
});

describe('POST /api/nav', () => {
  it('returns 401 without credentials', async () => {
    expect((await request(app).post('/api/nav').send({ label: 'X', url: '/x' })).status).toBe(401);
  });

  it('creates a nav item and returns 201', async () => {
    const res = await request(app)
      .post('/api/nav')
      .auth(AUTH.user, AUTH.pass)
      .send({ label: 'Ny sida', url: '/ny-sida', sort_order: 99 });
    expect(res.status).toBe(201);
    expect(res.body.item.label).toBe('Ny sida');
    expect(res.body.item.url).toBe('/ny-sida');
    // Cleanup
    await db('nav_items').where({ id: res.body.item.id }).delete();
  });

  it('returns 400 when label is missing', async () => {
    const res = await request(app).post('/api/nav').auth(AUTH.user, AUTH.pass).send({ url: '/x' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when url is missing', async () => {
    const res = await request(app).post('/api/nav').auth(AUTH.user, AUTH.pass).send({ label: 'X' });
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/nav/:id', () => {
  it('updates a nav item', async () => {
    const [id] = await db('nav_items').insert({ label: 'Test', url: '/test', sort_order: 99 });
    const res = await request(app)
      .put(`/api/nav/${id}`)
      .auth(AUTH.user, AUTH.pass)
      .send({ label: 'Uppdaterat', url: '/uppdaterat', sort_order: 99 });
    expect(res.status).toBe(200);
    expect(res.body.item.label).toBe('Uppdaterat');
    await db('nav_items').where({ id }).delete();
  });

  it('returns 404 for non-existent id', async () => {
    const res = await request(app)
      .put('/api/nav/99999')
      .auth(AUTH.user, AUTH.pass)
      .send({ label: 'X', url: '/x' });
    expect(res.status).toBe(404);
  });

  it('returns 400 for non-numeric id', async () => {
    const res = await request(app)
      .put('/api/nav/abc')
      .auth(AUTH.user, AUTH.pass)
      .send({ label: 'X', url: '/x' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/nav/:id', () => {
  it('deletes a nav item and returns 204', async () => {
    const [id] = await db('nav_items').insert({ label: 'Ta bort mig', url: '/ta-bort', sort_order: 99 });
    const res = await request(app).delete(`/api/nav/${id}`).auth(AUTH.user, AUTH.pass);
    expect(res.status).toBe(204);
    expect(await db('nav_items').where({ id })).toHaveLength(0);
  });

  it('returns 404 for non-existent id', async () => {
    const res = await request(app).delete('/api/nav/99999').auth(AUTH.user, AUTH.pass);
    expect(res.status).toBe(404);
  });
});
