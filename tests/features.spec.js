/*
 * Title: Customer Stats & Favorite Integration Tests
 * Description: Integration tests for total customer count and favorite toggle feature
 */

const supertest = require('supertest');
const app = require('../app');
const db = require('../models');

const request = supertest(app);

describe('Customer Stats & Favorite Integration Tests', () => {
  beforeAll(async () => {
    await db.User.sync({ force: true });
  });

  test('should display 0 Pelanggan and 0 Favorit when database is empty', async () => {
    const response = await request.get('/customers');
    expect(response.status).toBe(200);
    expect(response.text).toMatch(/0 Pelanggan/);
    expect(response.text).toMatch(/0 Favorit/);
  });

  test('should toggle favorite status for a customer and update dashboard count', async () => {
    const user = await db.User.create({
      name: 'Abdul Ghoni',
      email: 'abdul@example.com',
      phone: '081234567890',
    });

    const toggleRes = await request.get(`/customers/${user.id}/favorite`);
    expect(toggleRes.status).toBe(302);

    const updatedUser = await db.User.findByPk(user.id);
    expect(updatedUser.isFavorite).toBe(true);

    const listRes = await request.get('/customers');
    expect(listRes.status).toBe(200);
    expect(listRes.text).toMatch(/1 Pelanggan/);
    expect(listRes.text).toMatch(/1 Favorit/);
    expect(listRes.text).toMatch(/bi-star-fill/);
  });

  afterAll(async () => {
    await db.User.truncate();
    await db.sequelize.close();
  });
});
