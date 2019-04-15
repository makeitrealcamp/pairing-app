const path = require('path');
const mongoose = require("mongoose");
const express = require("express");

require("./models/Participant");
require("./models/Session");
const routes = require('./routes');

const isDev = process.env.NODE_ENV !== 'production';
const port  = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pairing', { useNewUrlParser: true });

const app = express();
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../dist')));

app.use('/', routes);

if (isDev) {
  console.log("*** Development Mode ***");

  require('dotenv').config();
  const fallback = require('connect-history-api-fallback');
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');

  const config = require('../webpack.config.js');
  const compiler = webpack(config);

  app.use(fallback({ verbose: false }));

  app.use(webpackDevMiddleware(compiler));
} else {
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../dist/index.html"));
  });
}

app.listen(port, () => console.log(`Starting on port ${port} ...`));
