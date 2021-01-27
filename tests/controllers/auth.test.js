jest.useFakeTimers();
const request = require('supertest');
const sinon = require('sinon');
const axios = require('axios');
const mongoose = require('mongoose');
const { app } = require('../../server/app');
const Participant = require('../../server/models/Participant');

beforeEach(async () => {
  for (var i in mongoose.connection.collections) {
    await mongoose.connection.collections[i].remove({});
  }
});

afterAll(() => {
  mongoose.disconnect();
});

describe('GET /auth/github', () => {
  test('responds with redirection', async () => {
    const response = await request(app).get('/auth/github');
    expect(response.statusCode).toBe(302);
  });

  test('responds with correct location', async () => {
    const response = await request(app).get('/auth/github');
    expect(response.headers.location).toMatch(/^https:\/\/github.com\/login\/oauth\/authorize/);
  });
});

describe('GET /auth/github/token', () => {
  let sandbox;
  beforeEach(() => (sandbox = sinon.createSandbox()));
  afterEach(() => sandbox.restore());

  // Helper methods
  const replaceGithubPost = (sandbox) => {
    const fakePost = sandbox.fake.resolves({ data: { auth_token: '123' } });
    sandbox.replace(axios, 'post', fakePost);
  };

  const replaceGithubGet = (sandbox) => {
    const fakeGet = sandbox.fake.resolves({
      data: {
        email: 'test@example.com',
        login: 'test',
        name: 'Peter Perez',
        avatar_url: 'https://avatars1.githubusercontent.com/u/166389?v=4',
      },
    });
    sandbox.replace(axios, 'get', fakeGet);
  };

  test('responds with the JWT', async () => {
    replaceGithubPost(sandbox);
    replaceGithubGet(sandbox);

    const response = await request(app).post('/auth/github/token', { code: '123' });
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeTruthy();
  });

  test("creates the participant if it doesn't exists", async () => {
    replaceGithubPost(sandbox);
    replaceGithubGet(sandbox);

    const numDocs = await Participant.count({});
    await request(app).post('/auth/github/token', { code: '123' });
    expect(await Participant.count({})).toBe(numDocs + 1);
  });

  test('makes additional call if email is not in Github profile', async () => {
    replaceGithubPost(sandbox);

    const fakeGet = sandbox.stub();
    fakeGet.onCall(0).resolves({
      data: {
        email: null,
        login: 'test',
        name: 'Peter Perez',
        avatar_url: 'https://avatars1.githubusercontent.com/u/166389?v=4',
      },
    });
    fakeGet.onCall(1).resolves({
      data: [
        {
          email: 'test@example.com',
          primary: true,
          verified: true,
          visibility: 'public',
        },
      ],
    });
    sandbox.replace(axios, 'get', fakeGet);

    await request(app).post('/auth/github/token', { code: '123' });

    const p = await Participant.findOne({ email: 'test@example.com' });
    expect(p).toBeTruthy();
  });
});
