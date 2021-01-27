jest.useFakeTimers();
const request = require('supertest');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const jwt = require('jsonwebtoken');
const { app } = require('../../server/app');
const Participant = require('../../server/models/Participant');
const Session = require('../../server/models/Session');

beforeEach(async () => {
  for (var i in mongoose.connection.collections) {
    await mongoose.connection.collections[i].remove({});
  }
});

afterAll(() => {
  mongoose.disconnect();
});

describe('GET /sessions/open', () => {
  const createParticipant = async () => {
    return await Participant.create({
      email: 'test@example.com',
      github: 'test',
      name: 'Peter Perez',
      avatarUrl: 'https://avatars1.githubusercontent.com/u/166389?v=4',
    });
  };

  test('responds 401 if not authenticated', async () => {
    const response = await request(app).get('/sessions/open');
    expect(response.statusCode).toBe(401);
  });

  test('responds 404 if no open session', async () => {
    const p = await createParticipant();

    const token = await jwt.sign({ user: p._id }, 'secret key');
    const response = await request(app).get('/sessions/open').set('Authorization', token);
    expect(response.statusCode).toBe(404);
  });

  test('responds 200 if open session', async () => {
    const p = await createParticipant();
    await Session.create({ name: 'Session 1', open: true });

    const token = await jwt.sign({ user: p._id }, 'secret key');
    const response = await request(app).get('/sessions/open').set('Authorization', token);
    expect(response.statusCode).toBe(200);
  });
});
