const mongoose = require("mongoose");

const schema = mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  },
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant'
  },
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Message", schema);
