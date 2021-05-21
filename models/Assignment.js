const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AssignmentSchema = new Schema({
  title: {
    type: String,
    require: true
  },
  userID: {
    type: String,
    require: true
  },
  dateCreated: {
    type: Date,
    default: new Date()
  }
});

module.exports = Assignment = mongoose.model("Assignment", AssignmentSchema);