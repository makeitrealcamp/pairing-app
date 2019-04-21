const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Session = require("../models/Session");
const Assistance = require("../models/Assistance");
const clients = require("../clients");

module.exports.create = async (req, res, next) => {
  try {
    const session = await Session.findOne({ _id: req.params.sessionId });
    const assistance = await Assistance.create({
      session: session,
      participant: res.locals.user,
      enqueuedAt: new Date()
    });

    res.json(assistance);
  } catch (e) {
    next(e);
  }
}

module.exports.show = async (req, res, next) => {
  try {
    const assistance = await Assistance.findById(req.params.id).populate("partner");
    if (assistance) {
      res.json(assistance);
    } else {
      res.status(404).json({ error: "Not Found" });
    }
  } catch (e) {
    next(e);
  }
}

module.exports.findBySession = async (req, res, next) => {
  try {
    const assistance = await Assistance.findOne({
      session: new ObjectId(req.params.sessionId),
      participant: new ObjectId(res.locals.user._id)
    }).populate("partner");
    if (assistance) {
      res.json(assistance);
    } else {
      res.status(404).json({ error: "Not Found" });
    }
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next, data) => {
  try {
    const id = new ObjectId(req.params.assistanceId);
    await Assistance.updateOne({ _id: id }, data);

    const assistance = await Assistance.findOne({ _id: id });
    if (assistance) {
      res.json(assistance);
    } else {
      res.status(404).json({ error: "Not Found" });
    }
  } catch (e) {
    next(e);
  }
}

module.exports.update = async (req, res, next) => {
  await update(req, res, next, req.body);
};

module.exports.enqueue = async (req, res, next) => {
  await update(req, res, next, { status: "enqueued", enqueuedAt: new Date() });
};

module.exports.dequeue = async (req, res, next) => {
  await update(req, res, next, { status: "not_paired", enqueuedAt: null });
};
