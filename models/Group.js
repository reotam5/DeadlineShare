const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  createdOn: {
    type: String,
    default: new Date()
  },
  name: {
    type: String,
    require: true
  },
  owners: {
    type: [String],
    require: true
  },
  members: {
    type: [String],
    require: true
  },
  categories: {
    type: [String],
    require: false,
    default: []
  }
});

module.exports = Group = mongoose.model("Group", GroupSchema);