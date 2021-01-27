const Assistance = require('../models/Assistance');
const Session = require('../models/Session');

module.exports.open = async (req, res, next) => {
  try {
    const session = await Session.findOne({ open: true });
    if (session) {
      res.json(session);
    } else {
      res.status(404).json({ error: 'Not Found' });
    }
  } catch (e) {
    next(e);
  }
};

module.exports.getAll = async (req, res, next) => {
  try {
    const sessions = await Session.find({}).sort({ _id: -1 });

    const result = [];
    for (let i = 0; i < sessions.length; i++) {
      const session = sessions[i];
      const assistances = await Assistance.find({ session: session._id });
      const unpaired = assistances.filter((a) => a.status === 'not_paired' || a.status === 'solo');
      const ratings = assistances.map((a) => a.feedback.rating).filter((r) => r !== undefined);
      const rating = ratings.reduce((total, r) => total + r, 0) / ratings.length;

      result.push({
        id: session._id,
        name: session.name,
        assistances: assistances.length,
        unpaired: unpaired.length,
        rating: rating,
      });
    }

    res.json(result);
  } catch (e) {
    next(e);
  }
};

module.exports.create = async (req, res, next) => {
  try {
    let session = await Session.findOne({ open: true });
    if (session) return res.status(409).json({ error: 'Current Active Session' });

    session = await Session.create({ ...req.body, open: true });

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

module.exports.closeSession = async (req, res, next) => {
  try {
    await Session.updateOne({ open: true }, { $set: { open: false } });

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};
