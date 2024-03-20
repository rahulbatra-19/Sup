const express = require("express"); //calls our http server
const cors = require("cors"); //to call this server from any other origin
const axios = require("axios");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3001;
const db = require("./db");
const UserModel = require("./models/user");
const Conversation = require("./models/conversation");
const Messages = require("./models/message");
const mongoose = require("mongoose");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const server = new createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FORNT_END,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

io.on("connect", (socket) => {
  console.log("user connected");
  console.log(socket.id);
  socket.emit("welcome", "welcome to the server");
  socket.on("disconnect", () => {
    console.log("user disconnected ", socket.id);
  });
});

app.post("/authenticate", async (req, res) => {
  const { username, pin } = req.body;
  //   const username = "Rahul";
  console.log(username, pin);
  try {
    const user = await UserModel.findOne({
      username,
    });
    if (!user) {
      const newUser = await UserModel.create({
        username,
        pin,
      });

      return res.status(200).json({
        message: "User created successfully!",
        user: { username: newUser?.username, id: newUser?._id },
      });
    } else {
      if (user.pin == pin) {
        return res.status(200).json({
          message: "User successfully loged in",
          user: { username: user?.username, id: user?._id },
        });
      } else {
        return res.status(200).json({ error: "Wrong Pin" });
      }
    }
  } catch (e) {
    console.log(e);
    return res.status(402).json({ error: "Authentication failed" });
  }
});

app.get("/User/all", async (req, res) => {
  const { username } = req.query;
  try {
    let users = await UserModel.find({
      username: { $ne: username },
    }).select("-pin -__v");
    const user = await UserModel.findOne({ username: username });
    const conversations = await Conversation.find({
      participants: {
        $all: [user.id],
      },
    });
    let chattingUsersIds = conversations.map((convo) =>
      convo?.participants?.find((ele) => ele.toString() !== user._id.toString())
    );

    const chattingUsers = users
      .map((user) => {
        let search = chattingUsersIds?.some(
          (id) => id.toString() === user._id.toString()
        );
        if (search) {
          return user;
        }
      })
      .filter((user) => user);

    users = users.filter((user) => !chattingUsers.includes(user));
    return res.status(200).json({ all: users, chatting: chattingUsers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error While fetching users!!" });
  }
});

app.post("/conversation/OneTOne", async (req, res) => {
  const { messageText, contact, user } = req.body;
  console.log(messageText, contact, user);

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

app.get("/conversation/get", async (req, res) => {
  const { userId, contactId } = req.query;
  console.log("userID", userId, "contactId", contactId);
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
server.listen(PORT, () => {
  console.log("Server is running on Port:", PORT);
});
