const jwt = require("jsonwebtoken");
const express = require('express');
const router = express.Router();
const { requireUser } = require('./middlewares');
const auth = require("./controllers/auth");
const sessions = require("./controllers/sessions");
const assistances = require("./controllers/assistances");
const clients = require("./clients");

module.exports = (io) => {
  router.get("/auth/github", auth.githubAuth);
  router.post("/auth/github/token", auth.githubToken);

  router.get("/sessions/open", requireUser, sessions.open);

  router.post("/sessions/:sessionId/assistances", requireUser, assistances.create);
  router.get("/sessions/:sessionId/assistance", requireUser, assistances.findBySession);
  router.get("/assistances/:id", requireUser, assistances.show);
  router.patch("/assistances/:assistanceId", requireUser, assistances.update);
  router.patch("/assistances/:assistanceId/enqueue", requireUser, assistances.enqueue);
  router.patch("/assistances/:assistanceId/dequeue", requireUser, assistances.dequeue);

  io.on("connection", socket => {
    socket.on("subscribe", async data => {
      const assistanceId = data.assistanceId;
      const token = data.token;

      const decoded = await jwt.verify(token, process.env.SECRET_KEY || "secret key");
      if (decoded.user) {
        socket.join(`assistance-${assistanceId}`);
        // clients.push({ participantId: decoded.user, socket });
      }
    });
  });

  return router;
}
