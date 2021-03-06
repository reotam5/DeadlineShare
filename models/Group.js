const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  createdOn: {
    type: String,
    default: new Date(),
  },
  createdBy: {
    type: String,
  },
  name: {
    type: String,
    require: true,
    default: "Untitled group",
  },
  owners: {
    type: [String],
    require: true,
    default: [],
  },
  editors: {
    type: [String],
    require: true,
    default: [],
  },
  members: {
    type: [String],
    require: true,
    default: [],
  },
  invites: {
    type: [String],
    require: false,
    default: [],
  },
});

module.exports = Group = mongoose.model("Group", GroupSchema);
