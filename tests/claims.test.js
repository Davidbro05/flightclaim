const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');
const { setupTestDb, teardownTestDb, validClaim } = require('./helpers');

// Prevent real SMTP calls in integration tests
jest.mock('../src/services/emailService', () => ({
  sendAdminNotification: jest.fn().mockResolvedValue(undefined),
  sendCustomerConfirmation: jest.fn().mockResolvedValue(undefined),
}));

const emailService = require('../src/services/emailService');

beforeAll(async () => {
  await setupTestDb();
});

afterEach(async () => {
  await db('claims').truncate();
});

afterAll(async () => {
  await teardownTestDb();
});

describe('POST /submit', () => {
  it('accepts a valid claim and returns tack-page', async () => {
    const res = await request(app).post('/submit').type('form').send(validClaim);
    expect(res.status).toBe(200);
    expect(res.text).toContain('Tack');
  });

  it('persists the claim in the database', async () => {
    await request(app).post('/submit').type('form').send(validClaim);
    const rows = await db('claims').select('*');
    expect(rows).toHaveLength(1);
    expect(rows[0].namn).toBe('Anna Svensson');
    expect(rows[0].email).toBe('anna@example.com');
    expect(rows[0].affiliate_code).toBe('main');
  });

  it('stores the ref query param as affiliate_code', async () => {
    await request(app).post('/submit?ref=testpartner').type('form').send(validClaim);
    const rows = await db('claims').select('affiliate_code');
    expect(rows[0].affiliate_code).toBe('testpartner');
  });

  it('returns 400 when a required field is missing', async () => {
    const { namn: _omit, ...withoutNamn } = validClaim;
    const res = await request(app).post('/submit').type('form').send(withoutNamn);
    expect(res.status).toBe(400);
  });

  it('returns 400 when signature is missing', async () => {
    const { signature: _omit, ...withoutSig } = validClaim;
    const res = await request(app).post('/submit').type('form').send(withoutSig);
    expect(res.status).toBe(400);
  });

  it('returns 400 when terms are not accepted', async () => {
    const { terms_accepted: _omit, ...withoutTerms } = validClaim;
    const res = await request(app).post('/submit').type('form').send(withoutTerms);
    expect(res.status).toBe(400);
  });

  it('triggers admin and customer emails on successful submission', async () => {
    jest.clearAllMocks();
    await request(app).post('/submit').type('form').send(validClaim);
    expect(emailService.sendAdminNotification).toHaveBeenCalledTimes(1);
    expect(emailService.sendCustomerConfirmation).toHaveBeenCalledTimes(1);
    const [claimArg] = emailService.sendAdminNotification.mock.calls[0];
    expect(claimArg.flightNumber).toBe('SK123');
    expect(claimArg.email).toBe('anna@example.com');
  });

  it('accepts submission without booking reference (optional field)', async () => {
    const { bookingReference: _omit, ...withoutRef } = validClaim;
    const res = await request(app).post('/submit').type('form').send(withoutRef);
    expect(res.status).toBe(200);
    const rows = await db('claims').select('bookingReference');
    expect(rows[0].bookingReference).toBeNull();
  });
});
