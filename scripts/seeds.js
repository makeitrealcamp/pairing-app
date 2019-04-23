const mongoose = require("mongoose");
const faker = require("faker")
const Participant = require("../server/models/Participant");

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pairing', { useNewUrlParser: true });

const promises = []
for (let i=0; i < 100; i++) {
  promises.push(Participant.create({
    email: faker.internet.email(),
    name: faker.name.findName(),
    github: faker.internet.userName(),
    avatarUrl: faker.image.avatar()
  }));
}

Promise.all(promises).then(() => {
  mongoose.disconnect();
})
