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
  enqueued_at: DateTime,
  paired: {
    type: Boolean,
    default: false
  }
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant'
  }
});

module.exports = mongoose.model("Assistance", schema);
