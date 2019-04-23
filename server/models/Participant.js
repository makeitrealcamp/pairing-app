const mongoose = require("mongoose");

const schema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: [true, "is required"]
  },
  github: {
    type: String,
    unique: true,
    required: [true, "is required"]
  },
  avatarUrl: String,
  name: String,
  admin: {
    type: Boolean,
    default: false
  }
});

schema.index({ name: 'text', email: 'text', github: 'text'});

module.exports = mongoose.model("Participant", schema);
