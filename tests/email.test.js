// jest.mock is hoisted — factory must not reference out-of-scope variables
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
  })),
}));

const nodemailer = require('nodemailer');
const { sendAdminNotification, sendCustomerConfirmation } = require('../src/services/emailService');

// Helper: grab the sendMail spy from the most recent createTransport call
function getSendMail() {
  const calls = nodemailer.createTransport.mock.results;
  return calls[calls.length - 1]?.value?.sendMail;
}

const claim = {
  namn: 'Anna Svensson',
  email: 'anna@example.com',
  phone: '0701234567',
  street: 'Storgatan 1',
  zip: '11111',
  city: 'Stockholm',
  flightNumber: 'SK123',
  airline: 'SAS',
  bookingReference: 'ABC123',
  departureAirport: 'ARN',
  arrivalAirport: 'CPH',
  flightDate: '2026-03-01',
  issue: 'delay',
  affiliate_code: 'main',
  ip_address: '127.0.0.1',
};

beforeEach(() => {
  nodemailer.createTransport.mockClear();
  nodemailer.createTransport.mockImplementation(() => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
  }));
});

describe('emailService — SMTP not configured', () => {
  beforeEach(() => {
    delete process.env.SMTP_HOST;
    delete process.env.NOTIFY_EMAIL;
  });

  it('sendAdminNotification resolves without throwing', async () => {
    await expect(sendAdminNotification(claim)).resolves.toBeUndefined();
    expect(nodemailer.createTransport).not.toHaveBeenCalled();
  });

  it('sendCustomerConfirmation resolves without throwing', async () => {
    await expect(sendCustomerConfirmation(claim)).resolves.toBeUndefined();
    expect(nodemailer.createTransport).not.toHaveBeenCalled();
  });
});

describe('emailService — SMTP configured', () => {
  beforeEach(() => {
    process.env.SMTP_HOST = 'smtp.test.local';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'test@test.com';
    process.env.SMTP_PASS = 'pass';
    process.env.SMTP_FROM = 'FlightClaim <test@test.com>';
    process.env.NOTIFY_EMAIL = 'admin@test.com';
  });

  afterEach(() => {
    ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM', 'NOTIFY_EMAIL'].forEach(
      (k) => delete process.env[k]
    );
  });

  it('sendAdminNotification sends to NOTIFY_EMAIL with claim details', async () => {
    await sendAdminNotification(claim);
    const sendMail = getSendMail();
    expect(sendMail).toHaveBeenCalledTimes(1);
    const [opts] = sendMail.mock.calls[0];
    expect(opts.to).toBe('admin@test.com');
    expect(opts.subject).toContain('SK123');
    expect(opts.text).toContain('Anna Svensson');
    expect(opts.text).toContain('Försening');
  });

  it('sendCustomerConfirmation sends to the customer email', async () => {
    await sendCustomerConfirmation(claim);
    const sendMail = getSendMail();
    expect(sendMail).toHaveBeenCalledTimes(1);
    const [opts] = sendMail.mock.calls[0];
    expect(opts.to).toBe('anna@example.com');
    expect(opts.subject).toContain('SK123');
    expect(opts.text).toContain('Anna Svensson');
  });

  it('sendAdminNotification skips sendMail if NOTIFY_EMAIL is missing', async () => {
    delete process.env.NOTIFY_EMAIL;
    await sendAdminNotification(claim);
    // createTransport is still called (SMTP_HOST is set), but sendMail is not
    const sendMail = getSendMail();
    expect(sendMail).not.toHaveBeenCalled();
  });
});
