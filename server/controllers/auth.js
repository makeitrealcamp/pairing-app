const axios = require("axios");
const jwt = require("jsonwebtoken");
const Participant = require("../models/Participant");

module.exports.githubAuth = (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.OAUTH_CLIENT_ID}&scope=user`);
}

module.exports.githubToken = async (req, res, next) => {
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
};
