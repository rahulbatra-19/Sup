const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  pin: {
    type: String,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  avatar: {
    type: String,
    default: "https://github.com/shadcn.png",
  },
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
