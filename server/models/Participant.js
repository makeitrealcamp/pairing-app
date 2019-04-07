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
  name: String
});

module.exports = mongoose.model("Participant", schema);
