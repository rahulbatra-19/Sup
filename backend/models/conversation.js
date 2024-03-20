const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Messages" }],
  // Additional conversation properties
});

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
