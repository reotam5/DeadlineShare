const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AssignmentSchema = new Schema({
  groupID: {
    type: String,
    require: true,
  },
  doneUsers: {
    type: [String],
    require: false,
    default: [],
  },
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: false,
    default: "",
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
  dueOn: {
    type: Date,
    require: true,
    default: new Date(),
  },
});

module.exports = Assignment = mongoose.model("Assignment", AssignmentSchema);
