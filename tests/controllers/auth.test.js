jest.useFakeTimers();
const request = require('supertest');
const { app } = require('../../server/app');

describe('GET /auth/github', () => {
  test('responds with redirection', async () => {
    const response = await request(app).get('/auth/github');
    expect(response.statusCode).toBe(302);
  });

  test('responds with correct location', async () => {
    const response = await request(app).get('/auth/github');
    console.log(response.headers);
    expect(response.headers.location).toMatch(/^https:\/\/github.com\/login\/oauth\/authorize/)
  });
});
