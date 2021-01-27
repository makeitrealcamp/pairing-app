const path = require('path');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const redis = require('socket.io-redis');
const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = socketio(server);
io.adapter(redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379'));

require('./models/Participant');
require('./models/Session');
const routes = require('./routes')(io);

const isDev = process.env.NODE_ENV !== 'production';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pairing', { useNewUrlParser: true });

app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../dist')));

app.use('/', routes);

if (isDev) {
  console.log('*** Development Mode ***');

  require('dotenv').config();
  const fallback = require('connect-history-api-fallback');
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');

  const config = require('../webpack.config.js');
  const compiler = webpack(config);

  app.use(fallback({ verbose: false }));

  app.use(webpackDevMiddleware(compiler));
} else {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
  });
}

module.exports.server = server;
module.exports.app = app;
