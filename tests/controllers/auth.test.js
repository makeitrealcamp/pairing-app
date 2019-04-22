jest.useFakeTimers();
const request = require('supertest');
const sinon = require('sinon');
const axios = require('axios');
const { app } = require('../../server/app');

describe('GET /auth/github', () => {
  test('responds with redirection', async () => {
    const response = await request(app).get('/auth/github');
    expect(response.statusCode).toBe(302);
  });

  test('responds with correct location', async () => {
    const response = await request(app).get('/auth/github');
    expect(response.headers.location).toMatch(/^https:\/\/github.com\/login\/oauth\/authorize/)
  });
});

describe("GET /auth/github/token", () => {
  let sandbox;
  beforeEach(() => sandbox = sinon.createSandbox());
  afterEach(() => sandbox.restore());

  test("responds with the JWT", async () => {
    const fakePost = sandbox.fake.returns(new Promise(resolve => {
      resolve({ data: { auth_token: "123" } });
    }));
    sandbox.replace(axios, "post", fakePost);

    const fakeGet = sandbox.fake.returns(new Promise(resolve => {
      resolve({
        data: {
          email: "test@example.com",
          login: "test",
          name: "Peter Perez",
          avatar_url: "https://avatars1.githubusercontent.com/u/166389?v=4"
        }
      });
    }));
    sandbox.replace(axios, "get", fakeGet);

    const response = await request(app).post('/auth/github/token', { code: "123" });
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeTruthy();
  });
});
