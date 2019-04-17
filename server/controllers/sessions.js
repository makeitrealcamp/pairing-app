const Session = require("../models/Session");

module.exports.open = async (req, res, next) => {
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
};
