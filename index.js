require('dotenv').config();
const path = require('path');
const express = require("express");

const app = express();

app.use(express.static(path.resolve(__dirname, 'dist')));

app.get("/auth/github", (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.OAUTH_CLIENT_ID}&scope=user`);
});

app.get("/github/callback", async (req, res) => {
  const code = req.query.code;

  let response = await axios.post("https://github.com/login/oauth/access_token", {
    client_id: process.env.OAUTH_CLIENT_ID,
    client_secret: process.env.OAUTH_CLIENT_SECRET,
    code: code
  }, { headers: { "Accept": "application/json" } });

  const token = response.data.access_token;

  response = await axios.get("https://api.github.com/user?access_token=" + token);
  console.log(response.data.email);

  // crear el usuario
  // escribir la cookie

  res.redirect("/dashboard");
});

app.get("/api", (req, res) => {
  res.send({});
});

app.get("sessions/:id", (req, res) => {

});

app.get("assistances/:id", (req, res) => {

});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist/index.html"));
});

app.listen(3000, () => console.log("Iniciando en puerto 3000"));
