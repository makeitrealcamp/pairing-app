const mongoose = require("mongoose");

const schema = mongoose.Schema({
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant'
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assistance'
  },
  enqueuedAt: Date,
  paired: {
    type: Boolean,
    default: false
  },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant'
  },
  feedback: {
    rating: Number,
    class: String,
    exercises: String,
    partner: String
  }

});

module.exports = mongoose.model("Assistance", schema);
