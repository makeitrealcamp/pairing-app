const axios = require("axios");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const express = require('express');
const router = express.Router();
const { requireUser } = require('./middlewares');
const Participant = require("./models/Participant");
const Session = require("./models/Session");
const Assistance = require("./models/Assistance");
const clients = require("./clients")

module.exports = (io) => {
  router.get("/auth/github", (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.OAUTH_CLIENT_ID}&scope=user`);
  });

  router.post("/auth/github/token", async (req, res, next) => {
    try {
      const code = req.body.code;

      const r1 = await axios.post("https://github.com/login/oauth/access_token", {
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        code: code
      }, { headers: { "Accept": "application/json" } });

      const accessToken = r1.data.access_token;
      const r2 = await axios.get("https://api.github.com/user?access_token=" + accessToken);

      let p = await Participant.findOne({ email: r2.data.email });
      if (!p) {
        const data = r2.data;
        p = await Participant.create({
          email: data.email,
          github: data.login,
          name: data.name,
          avatarUrl: data.avatar_url
        });
      }
      const token = await jwt.sign({ user: p._id }, process.env.SECRET_KEY || "secret key");

      res.json({ token: token });
    } catch (e) {
      next(e);
    }
  });

  router.get("/sessions/open", requireUser, async (req, res, next) => {
    try {
      const session = await Session.findOne({ open: true });
      if (session) {
        res.json(session);
      } else {
        res.status(404).json({ error: "Not Found" });
      }
    } catch (e) {
      next(e);
    }
  });

  router.post("/sessions/:sessionId/assistances", requireUser, async (req, res, next) => {
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
  });

  router.get("/sessions/:sessionId/assistance", requireUser, async (req, res, next) => {
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
  });

  router.patch("/assistances/:assistanceId/enqueue", requireUser, async (req, res, next) => {
    try {
      const id = new ObjectId(req.params.assistanceId);
      await Assistance.updateOne({ _id: id }, { enqueuedAt: new Date() });

      const assistance = await Assistance.findOne({ _id: id });
      if (assistance) {
        res.json(assistance);
      } else {
        res.status(404).json({ error: "Not Found" });
      }
    } catch (e) {
      next(e);
    }
  });

  router.patch("/assistances/:assistanceId/dequeue", requireUser, async (req, res, next) => {
    try {
      const id = new ObjectId(req.params.assistanceId);
      await Assistance.updateOne({ _id: id }, { enqueuedAt: null });

      const assistance = await Assistance.findOne({ _id: id });
      if (assistance) {
        res.json(assistance);
      } else {
        res.status(404).json({ error: "Not Found" });
      }
    } catch (e) {
      next(e);
    }
  });

  router.post("/pair", async (req, res, next) => {
    try {
      const a1 = await Assistance.findById(new ObjectId(req.body.assistanceId)).populate("partner");
      const a2 = await Assistance.findOne({ session: a1.session, participant: a1.partner._id }).populate("partner");

      clients.forEach((client) => {
        if (client.participantId == a1.participant) {
          client.socket.emit("paired", a1);
        }
        if (client.participantId == a2.participant) {
          client.socket.emit("paired", a2);
        }
      });

      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  io.on("connection", socket => {
    socket.on("subscribe", async data => {
      const token = data.token;
      const decoded = await jwt.verify(token, process.env.SECRET_KEY || "secret key");
      if (decoded.user) {
        clients.push({ participantId: decoded.user, socket });
      }
    });
  });

  return router;
}
