const jwt = require("jsonwebtoken");
const Participant = require("./models/Participant");

const requireUser = async (req, res, next) => {
  const token = req.get("Authorization");
  if (token) {
    try {
      const decoded = await jwt.verify(token, process.env.SECRET_KEY || "secret key");
      if (decoded.user) {
        const user = await Participant.findOne({ _id: decoded.user });
        if (user) {
          res.locals.user = user;
          return next();
        }
      }
    } catch (e) {
      console.log(e);
      res.status(401).json({ error: "Invalid authorization token" });
    }
  }

  res.status(401).json({ error: "Not authorized" });
}

const requireAdmin = async (req, res, next) => {
  if (!res.locals.user.admin) {
    res.status(404).json({ error: "Not Found" })
    return;
  }

  next();
}

module.exports = { requireUser, requireAdmin };
