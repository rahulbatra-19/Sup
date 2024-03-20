const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  groupImage: String,
  conversation: {
    type: Schhema.Types.ObjectId,
    ref: "Conversation",
  },
  // Additional group properties
})();

const Groups = mongoose.model("Group", groupSchema);
module.exports = Groups;
