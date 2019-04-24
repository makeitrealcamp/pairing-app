const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "is required"]
  },
  open: {
    type: Boolean,
    required: [true, "is required"]
  },
  exercisesUrl: String
});

module.exports = mongoose.model("Session", schema);
