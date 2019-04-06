const mongoose = require("mongoose");

const schema = mongoose.Schema({
  open: {
    type: Boolean,
    required: [true, "is required"]
  }
});

module.exports = mongoose.model("Session", schema);
