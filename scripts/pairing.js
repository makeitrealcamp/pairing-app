'use strict'

const io = require('socket.io-emitter')(process.env.REDIS_URL || "redis://127.0.0.1:6379");
const mongoose = require("mongoose");
require("../server/models/Participant");
const Assistance = require("../server/models/Assistance");
const Chat = require("../server/models/Chat");

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
  const chat = await Chat.create({});

  a1.status = "paired";
  a1.partner = a2.participant;
  a1.chat = chat._id;
  a1.enqueuedAt = null;
  await a1.save();

  a2.status = "paired";
  a2.partner = a1.participant;
  a2.chat = chat._id;
  a1.enqueuedAt = null;
  await a2.save();

  io.to(`participant-${a1.participant._id}`).emit("assistance-changed", a1);
  io.to(`participant-${a2.participant._id}`).emit("assistance-changed", a2);
}

const execute = async () => {
  let a1
  while (a1 = await dequeue()) {
    const a2 = await dequeue();
    if (a2) {
      await pair(a1, a2);
      console.log(`* Paired: ${a1.participant.github} with ${a2.participant.github}`);
    } else {
      console.log("No partner found for participant:", a1.participant.github);
      await Assistance.updateOne({ _id: a1._id }, { $set: { status: "enqueued" } });
    }
  }
};

const clean = () => {
  mongoose.disconnect();
  io.redis.quit();
};

const set = (key, value) => {
  return new Promise((resolve, reject) => {
    io.redis.set(key, value, (err, res) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

const get = (key) => {
  return new Promise((resolve, reject) => {
    io.redis.get(key, function(err, result) {
      if (err) {
        return reject(err);
      }
      resolve(result);
    })
  });
};

const wait = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

const run = async () => {
  console.log("Executing ...");
  try {
    let running = "true";
    while (running === "true") {
      await execute();
      await wait(1000);

      running = await get("pairing:running");
      console.log("Running", running);
    }
  } catch (err) {
    console.log(err);
  } finally {
    clean();
  }
}

console.log("Starting pairing script ...");
set("pairing:running", "true").then(() => {
  run();
});
