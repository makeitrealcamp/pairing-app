'use strict'

const io = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 });
const mongoose = require("mongoose");
require("../server/models/Participant");
const Assistance = require("../server/models/Assistance");

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pairing', { useNewUrlParser: true });

const onError = (err) => {
  console.log(err);
};
io.redis.on('error', onError);

const dequeue = async () => {
  return await Assistance.findOneAndUpdate(
      { status: "enqueued" },
      { status: "pairing" },
      { sort: { enqueuedAt: -1 }
    }).populate("participant");
}

const pair = async (a1, a2) => {
  a1.status = "paired";
  a1.partner = a2.participant;
  a1.enqueuedAt = null;
  await a1.save();

  a2.status = "paired";
  a2.partner = a1.participant;
  a1.enqueuedAt = null;
  await a2.save();

  io.to(`assistance-${a1._id}`).emit("paired", a1);
  io.to(`assistance-${a2._id}`).emit("paired", a2);
}

const execute = async () => {
  const a1 = await dequeue();
  if (!a1) {
    return console.log("No assistances found");
  }

  const a2 = await dequeue();
  if (a2) {
    await pair(a1, a2);
    console.log(`* Paired: ${a1.participant.github} with ${a2.participant.github}`);
  } else {
    console.log("No partner found for participant: ", a1.participant);
    await Assistance.updateOne({ _id: a1._id }, { $set: { status: "enqueued" } });
  }
};

const clean = () => {
  mongoose.disconnect();
  io.redis.quit();
};

console.log("Starting ...");
execute().then(() => {
  console.log("Abbiamo finito, tutto bene!");
  clean();
}).catch((err) => {
  console.log(err);
  clean();
});
