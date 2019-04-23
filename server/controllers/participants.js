const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Participant = require("../models/Participant");

module.exports.findAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.p) || 1;
    const perPage = 10;

    const options = {};
    const query = req.query.q;
    if (query) {
      options['$text'] = { $search: query };
    }

    const participants = await Participant.find(options).skip(perPage * (page-1)).limit(perPage);
    res.json({
      count: await Participant.count(options),
      perPage: perPage,
      documents: participants
    });
  } catch (err) {
    next(err);
  }
};

module.exports.show = async (req, res, next) => {
  try {
    res.json(res.locals.user);
  } catch (err) {
    next(err);
  }
}
