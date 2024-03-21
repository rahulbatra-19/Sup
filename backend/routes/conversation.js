const express = require("express");
const router = express.Router();
const Conversation = require("../models/conversation");
const Messages = require("../models/message");

router.post("/OneTOne", async (req, res) => {
  const { messageText, contact, user } = req.body;
  // console.log(messageText, contact, user);

  try {
    // Find the conversation between the user and the contact
    let conversation = await Conversation.findOne({
      participants: { $all: [user.id, contact._id] },
    }).populate("participants");

    // Create a new message
    const message = await Messages.create({
      message: messageText,
      sender: user.id,
    });

    if (conversation) {
      // If conversation already exists, push the new message to it
      conversation.messages.push(message._id);
      await conversation.save();
    } else {
      // If conversation does not exist, create a new one
      conversation = await Conversation.create({
        participants: [user.id, contact._id],
        messages: [message._id],
      });
    }

    return res.status(200).json({ conversation });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error while messaging" });
  }
});

router.get("/get", async (req, res) => {
  const { userId, contactId } = req.query;
  // console.log("userID", userId, "contactId", contactId);
  try {
    const conversation = await Conversation.findOne({
      participants: {
        $all: [contactId, userId],
        $size: 2,
      },
    }).populate("messages");
    if (conversation) {
      return res.status(200).json({
        conversation,
      });
    } else {
      return res.status(200).json({ message: "No convo" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/getById", async (req, res) => {
  const { conversationId } = req.query;
  try {
    const conversation = await Conversation.findById(conversationId)
      .populate("messages")
      .populate("participants");
    console.log("conversation", conversation);
    if (conversation) {
      return res.status(200).json({ conversation });
    } else {
      return res.status(200).json({ message: "No conversation found" });
    }
  } catch (error) {}
});

module.exports = router;
