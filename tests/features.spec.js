/*
 * Title: Customer Stats Integration Tests
 * Description: Integration tests for the dynamic total customer count on the dashboard
 */

const supertest = require('supertest');
const app = require('../app');
const db = require('../models');

const request = supertest(app);

describe('Customer Dashboard Stats Integration Tests', () => {
  beforeAll(async () => {
    await db.User.sync({ force: true });
  });

  test('should display 0 Pelanggan when database is empty', async () => {
    const response = await request.get('/customers');
    expect(response.status).toBe(200);
    expect(response.text).toMatch(/0 Pelanggan/);
  });

  test('should display updated total customer count after adding customers', async () => {
    await db.User.bulkCreate([
      {
        name: 'Abdul Ghoni',
        email: 'abdul@example.com',
        phone: '081234567890',
      },
      {
        name: 'Harbima Razan',
        email: 'harbima@its.ac.id',
        phone: '089876543210',
      },
    ]);

    const response = await request.get('/customers');
    expect(response.status).toBe(200);
    expect(response.text).toMatch(/2 Pelanggan/);
  });

  afterAll(async () => {
    await db.User.truncate();
    await db.sequelize.close();
  });
});
