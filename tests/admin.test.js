const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');
const { setupTestDb, teardownTestDb, validClaim } = require('./helpers');

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'testpass';

beforeAll(async () => {
  await setupTestDb();
});

afterEach(async () => {
  await db('claims').truncate();
});

afterAll(async () => {
  await teardownTestDb();
});

// Helper: insert a claim and return its id
async function insertClaim(overrides = {}) {
  const [id] = await db('claims').insert({
    ...validClaim,
    terms_accepted: true,
    signature: 'data:image/png;base64,abc',
    ...overrides,
  });
  return id;
}

describe('GET /api/admin/claims', () => {
  it('returns 401 without credentials', async () => {
    const res = await request(app).get('/api/admin/claims');
    expect(res.status).toBe(401);
  });

  it('returns 401 with wrong password', async () => {
    const res = await request(app).get('/api/admin/claims').auth(ADMIN_USER, 'wrong');
    expect(res.status).toBe(401);
  });

  it('returns 200 with an empty claims array when no claims exist', async () => {
    const res = await request(app).get('/api/admin/claims').auth(ADMIN_USER, ADMIN_PASS);
    expect(res.status).toBe(200);
    expect(res.body.claims).toEqual([]);
  });

  it('returns claims with issueLabel resolved', async () => {
    await insertClaim({ issue: 'delay' });
    const res = await request(app).get('/api/admin/claims').auth(ADMIN_USER, ADMIN_PASS);
    expect(res.status).toBe(200);
    expect(res.body.claims).toHaveLength(1);
    expect(res.body.claims[0].namn).toBe('Anna Svensson');
    expect(res.body.claims[0].issueLabel).toBe('Försening');
  });

  it('returns claims sorted newest first', async () => {
    await insertClaim({ namn: 'Kund A' });
    await insertClaim({ namn: 'Kund B' });
    const res = await request(app).get('/api/admin/claims').auth(ADMIN_USER, ADMIN_PASS);
    expect(res.body.claims[0].namn).toBe('Kund B');
  });
});

describe('DELETE /api/admin/claims/:id', () => {
  it('returns 401 without credentials', async () => {
    const res = await request(app).delete('/api/admin/claims/1');
    expect(res.status).toBe(401);
  });

  it('deletes a claim and returns 204', async () => {
    const id = await insertClaim();
    const res = await request(app).delete(`/api/admin/claims/${id}`).auth(ADMIN_USER, ADMIN_PASS);
    expect(res.status).toBe(204);
    const rows = await db('claims').where({ id });
    expect(rows).toHaveLength(0);
  });

  it('returns 404 for a non-existent id', async () => {
    const res = await request(app).delete('/api/admin/claims/99999').auth(ADMIN_USER, ADMIN_PASS);
    expect(res.status).toBe(404);
  });

  it('returns 400 for a non-numeric id', async () => {
    const res = await request(app).delete('/api/admin/claims/abc').auth(ADMIN_USER, ADMIN_PASS);
    expect(res.status).toBe(400);
  });
});

describe('GET /api/admin/affiliates', () => {
  it('returns 401 without credentials', async () => {
    const res = await request(app).get('/api/admin/affiliates');
    expect(res.status).toBe(401);
  });

  it('returns 200 with empty affiliates when no claims exist', async () => {
    const res = await request(app).get('/api/admin/affiliates').auth(ADMIN_USER, ADMIN_PASS);
    expect(res.status).toBe(200);
    expect(res.body.affiliates).toEqual([]);
  });

  it('aggregates affiliate stats correctly', async () => {
    await insertClaim({ affiliate_code: 'partner1' });
    await insertClaim({ affiliate_code: 'partner1' });
    await insertClaim({ affiliate_code: 'main' });

    const res = await request(app).get('/api/admin/affiliates').auth(ADMIN_USER, ADMIN_PASS);
    expect(res.status).toBe(200);

    const p1 = res.body.affiliates.find((a) => a.affiliate_code === 'partner1');
    const main = res.body.affiliates.find((a) => a.affiliate_code === 'main');
    expect(p1.total_claims).toBe(2);
    expect(main.total_claims).toBe(1);
  });

  it('returns affiliates sorted by total_claims descending', async () => {
    await insertClaim({ affiliate_code: 'small' });
    await insertClaim({ affiliate_code: 'big' });
    await insertClaim({ affiliate_code: 'big' });

    const res = await request(app).get('/api/admin/affiliates').auth(ADMIN_USER, ADMIN_PASS);
    expect(res.body.affiliates[0].affiliate_code).toBe('big');
  });
});
