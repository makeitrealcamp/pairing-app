const Assistance = require('../models/Assistance')
const Session = require('../models/Session')

module.exports.open = async (req, res, next) => {
  try {
    const session = await Session.findOne({ open: true })
    if (session) {
      res.json(session)
    } else {
      res.status(404).json({ error: 'Not Found' })
    }
  } catch (e) {
    next(e)
  }
}

module.exports.getAll = async (req, res, next) => {
  try {
    const sessions = await Session.find({}).sort({ _id: -1 })

    const result = await Promise.all(
      sessions.map(async (session) => {
        const assistances = await Assistance.find({ session: session._id })
        const assistancesWithOutPair = assistances.filter((a) => a.status === 'not_paired' || a.status === 'solo')
        const assistancesRatings = assistances.map((a) => a.feedback.rating).filter((f) => f !== undefined)
        const promRating = assistancesRatings.reduce((total, r) => total +  r, 0)

        return {
          id: session._id,
          name: session.name,
          assistances: assistances.length,
          withOutPair: assistancesWithOutPair.length,
          ratingProm: promRating / assistancesRatings.length
        }
      })
    )

    if (result) {
      res.json(result)
    } else {
      res.status(404).json({ error: 'Not Found' })
    }
  } catch (e) {
    next(e)
  }
}

module.exports.create = async (req, res, next) => {
  try {
    let session = await Session.findOne({ open: true })
    if (session) return res.status(422).json({ error: 'Current Active Session' })

    session = await Session.create({ ...req.body, open: true });

    if (session) {
      res.status(204).json('Session Created')
    } else {
      res.status(422).json({ error: 'Unprocessable Entity' })
    }
  } catch (e) {
    next(e)
  }
}

module.exports.closeSession = async (req, res, next) => {
  try {
    await Session.updateOne({ open: true }, { $set: { open: false } })

    res.status(204).json('Session Closed')
  } catch (e) {
    next(e)
  }
}
