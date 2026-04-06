const db = require('../src/db');

async function setupTestDb() {
  await db.migrate.latest();
  await db('claims').truncate();
}

async function teardownTestDb() {
  await db.destroy();
}

const validClaim = {
  namn: 'Anna Svensson',
  street: 'Storgatan 1',
  zip: '11111',
  city: 'Stockholm',
  email: 'anna@example.com',
  phone: '0701234567',
  flightNumber: 'SK123',
  airline: 'SAS',
  bookingReference: 'ABC123',
  departureAirport: 'ARN',
  arrivalAirport: 'CPH',
  flightDate: '2026-03-01',
  issue: 'delay',
  signature: 'data:image/png;base64,abc',
  terms_accepted: 'on',
};

module.exports = { setupTestDb, teardownTestDb, validClaim };
