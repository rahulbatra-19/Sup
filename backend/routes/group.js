const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const Conversation = require("../models/conversation");

router.get("/all", async (req, res) => {
  try {
    const groups = await Group.find({});
    return res.json({ groups });
  } catch (error) {
    console.log(error);
  }
});
router.post("/join", async (req, res) => {
  try {
    let { user, groupId } = req.body;
    const group = await Group.findById(groupId).populate("conversation");
    if (group) {
      group.participants.push(user.id);
      await group.save();
      let conversation = group?.conversation;
      conversation?.participants.push(user?.id);
      await conversation.save();
      res.status(200).json({ message: "User joined the group successfully." });
    } else {
      res.status(404).json({ message: "Group not found." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
});
router.post("/create", async (req, res) => {
  try {
    const { groupName, user } = req.body;
    let group = await Group.findOne({ name: groupName });
    if (!group) {
      let conversation = await Conversation.create({
        participants: [user.id],
        messages: [],
        isGroup: true,
      });
      // Create a new group instance
      const group = await Group.create({
        name: groupName,
        participants: [user.id],
        conversation,
        // Add the user creating the group as a participant
        // Optionally, you can set other properties here
      });

      res.status(201).json({ message: "Group created successfully", group });
    } else {
      res.status(200).json({
        message: "Group already exists! please use a different name.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
});
router.get("/getbyuser", async (req, res) => {
  try {
    let { userId } = req.query;
    console.log("user id ", userId);
    const groups = await Group.find({
      participants: {
        $in: [userId],
      },
    }).populate("conversation");
    if (groups) {
      console.log("conversation", groups);

      return res.status(200).json({ groups });
    }
  } catch (error) {
    console.log(error);
  }
});
router.get("/getById", async (req, res) => {
  try {
    let { groupId } = req.query;
    const group = await Group.findById(groupId).populate("participants");
    if (group) {
      return res.status(200).json({ group });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
