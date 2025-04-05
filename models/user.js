const mongoose = require("mongoose");
const { type } = require("os");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  data:{
    type: String,
    required: false
  },
  goals:{
    type: String,
    required: false
  },
  tags:{
    type: String,
    required: false
  }
});

const User = mongoose.model("user", userSchema);
module.exports = User;
