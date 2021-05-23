const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

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
  },
  password: {
    type: String,
    require: true
  }
});

//before saving, hash the password
UserSchema.pre(
  'save',
  async function(next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  }
)

module.exports = User = mongoose.model("User", UserSchema);