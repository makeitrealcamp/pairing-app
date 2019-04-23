const axios = require("axios");
const jwt = require("jsonwebtoken");
const Participant = require("../models/Participant");

// Helper method
const loadUserFromGithub = async token => {
  let res = await axios.get("https://api.github.com/user?access_token=" + token);
  const user = {
    email: res.data.email,
    github: res.data.login,
    name: res.data.name,
    avatarUrl: res.data.avatar_url
  }

  if (!user.email) {
    res = await axios.get("https://api.github.com/user/emails?access_token=" + token);
    console.log(`Github user ${user.github} has no public email, finding email ...`);
    console.log(res.data);
    user.email = res.data.find(g => g.primary).email;
    console.log(`Found email for user ${user.github}: ${user.email}`);
  }

  return user;
}

module.exports.githubAuth = (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.OAUTH_CLIENT_ID}&scope=user:email`);
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
    const user = await loadUserFromGithub(accessToken);

    let p = await Participant.findOne({ github: user.github });
    if (!p) {
      p = await Participant.create(user);
    }
    const token = await jwt.sign({ user: p._id }, process.env.SECRET_KEY || "secret key");

    res.json({ token: token });
  } catch (e) {
    next(e);
  }
};
