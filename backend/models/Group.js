const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  groupImage: {
    type: String,
    default: "https://github.com/shadcn.png",
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
  },
  description: {
    type: String,
  },
  // Additional group properties
});

const Groups = mongoose.model("Group", groupSchema);
module.exports = Groups;
