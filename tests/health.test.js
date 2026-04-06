const request = require('supertest');
const app = require('../src/app');
const { setupTestDb, teardownTestDb } = require('./helpers');

beforeAll(async () => {
  await setupTestDb();
});

afterAll(async () => {
  await teardownTestDb();
});

describe('GET /health', () => {
  it('returns 200 with status ok and db connected', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.db).toBe('connected');
    expect(res.body.timestamp).toBeDefined();
  });
});
