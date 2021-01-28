const mongoose = require("mongoose");
const faker = require("faker")
const Participant = require("../server/models/Participant");
const Session = require("../server/models/Session");
const Assistance = require("../server/models/Assistance");

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pairing', { useNewUrlParser: true });

async function createSession() {
  return await Session.create({ name: faker.name.findName(), open: true })
}

async function createParticipants() {
  const participants = []
  for (let i=0; i < 3000; i++) {
    let email = faker.internet.email()
    while (await Participant.findOne({ email })) {
      email = faker.internet.userName()
    }

    let github = faker.internet.userName()
    while (await Participant.findOne({ github })) {
      github = faker.internet.userName()
    }
    participants.push(await Participant.create({
      email,
      name: faker.name.findName(),
      github,
      avatarUrl: faker.image.avatar()
    }))
  }
  return participants
}

async function createAssistances(session, participants) {
  for (let i=0; i < participants.length; i++) {
    const participant = participants[i]
    await Assistance.create({
      participant: participant,
      session: session,
      status: "enqueued",
      enqueuedAt: new Date(),
      createdAt: new Date()
    });
  }
}

async function init() {
  const session = await createSession()
  const participants = await createParticipants()
  await createAssistances(session, participants)
}

init().then(() => {
  mongoose.disconnect()
  console.log("Seed process finished ... ")
}).catch(err => console.error(err))
