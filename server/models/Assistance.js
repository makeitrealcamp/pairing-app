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
  status: {
    type: String,
    enum : ["enqueued", "pairing", "solo", "paired", "not_paired", "rated"],
    default: "enqueued"
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
