const path = require('path');
const axios = require("axios");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const express = require("express");

const Participant = require("./models/Participant");

const isDev = process.env.NODE_ENV !== 'production';
const port  = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pairing', { useNewUrlParser: true });

const app = express();
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'dist')));

if (isDev) {
  console.log("Development mode ...");

  require('dotenv').config();
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');

  const config = require('../webpack.config.js');
  const compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler));
}

const requireUser = async (req, res, next) => {
  const token = req.get("Authorization");
  console.log(token);
  if (token) {
    try {
      const decoded = await jwt.verify(token, process.env.SECRET_KEY || "secret key");
      const userId = decoded.user;

      next();
    } catch (e) {
      console.log(e);
      res.status(401).json({ error: "Invalid authorization token" });
    }
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
}

app.get("/auth/github", (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.OAUTH_CLIENT_ID}&scope=user`);
});

app.post("/auth/github/token", async (req, res, next) => {
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

app.get("/api", (req, res) => {
  res.send({});
});

app.get("sessions/:id", (req, res) => {

});

app.get("assistances/:id", (req, res) => {

});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../dist/index.html"));
});

app.listen(port, () => console.log(`Starting on port ${port} ...`));
