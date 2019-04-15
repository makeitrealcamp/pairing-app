const axios = require("axios");
const jwt = require("jsonwebtoken");
const express = require('express');
const router = express.Router();
const { requireUser } = require('./middlewares');
const Participant = require("./models/Participant");
const Session = require("./models/Session");
const Assistance = require("./models/Assistance");

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
      p = await Participant.create({ email: data.email, github: data.login, name: data.name });
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
    const assistance = await Assistance.create({ session: session, participant: res.locals.user, enqueuedAt: new Date() });

    res.json(assistance);
  } catch (e) {
    next(e);
  }
});

router.get("/sessions/:sessionId/assistance", requireUser, async (req, res, next) => {
  try {
    const assistance = await Assistance.findOne({ sessionId: req.params.sessionId, participantId: res.locals.user._id });
    if (assistance) {
      res.json(assistance);
    } else {
      res.status(404).json({ error: "Not Found" });
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
