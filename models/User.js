const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    require: true,
    unique: true
  },
  createdOn: {
    type: String,
    default: new Date()
  },
  name: {
    type: String,
    require: true
  }
});

module.exports = User = mongoose.model("User", UserSchema);