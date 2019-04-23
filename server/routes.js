const jwt = require("jsonwebtoken");
const express = require('express');
const router = express.Router();
const { requireUser } = require('./middlewares');
const auth = require("./controllers/auth");
const sessions = require("./controllers/sessions");
const assistances = require("./controllers/assistances");
const Message = require('./models/Message');

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
      socket.join(`assistance-${data.assistanceId}`);
    });

    socket.on("chat", async data => {
      socket.join(`chat-${data.chatId}`);

      const messages = await Message.find({ chat: data.chatId }).populate("participant");
      messages.forEach(m => {
        socket.emit("message", { participant: m.participant, text: m.text });
      });
    });

    socket.on("message", async data => {
      await Message.create({
        chat: data.chatId,
        participant: data.participant._id,
        text: data.text
      });
      socket.broadcast.to(`chat-${data.chatId}`).emit("message", { participant: data.participant, text: data.text });
    });
  });

  return router;
}
