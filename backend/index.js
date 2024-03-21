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
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");

const server = new createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FORNT_END,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(
  cors({
    origin: process.env.FORNT_END,
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 6000000, secure: false, sameSite: false }, // session timeout of 60 seconds
  })
);

let socketIdToUserMap = new Map();
const online = new Set();

io.on("connect", (socket) => {
  socket.on("authenticate", (user) => {
    console.log("authenticate");
    // Store the username in the socket object
    socket.user = user;
    console.log(socket.user, "socket user");
    // Add the user to the online set
    online.add(user?.username);
    // Emit welcome message to the connected user
    socket.emit("welcome", "Welcome to the server");
  });
  socket.on("getOnline", (user) => {
    console.log("get online ", user);
    online.add(user?.username);
    socketIdToUserMap.set(socket.id, user?.username);
  });
  socket.on("check-online", (user) => {
    console.log("check online ", user);
    console.log(online);

    if (online?.has(user)) {
      console.log("true", user);
      socket.emit("user-online", { userId: user, isOnline: true });
    } else {
      socket.emit("user-online", { userId: user, isOnline: false });
    }
  });
  socket.on("message", async ({ messageText, user, contact }) => {
    console.log("messageText", messageText);
    let messages = [];
    try {
      // Find the conversation between the user and the contact
      let conversation = await Conversation.findOne({
        participants: { $all: [user.id, contact._id] },
        isGroup: false,
      })
        .populate("participants")
        .populate("messages");
      // Create a new message
      const message = await Messages.create({
        message: messageText,
        sender: user.id,
      });
      console.log(conversation);
      if (conversation && !conversation?.isGroup) {
        messages = [...conversation?.messages, message];
        // If conversation already exists, push the new message to it
        conversation.messages.push(message._id);
        await conversation.save();
      } else {
        // If conversation does not exist, create a new one
        conversation = await Conversation.create({
          participants: [user.id, contact._id],
          messages: [message._id],
        }).populate("messages");
        messages = conversation?.messages;
      }
      socket.to(conversation.id).emit("recieve-message", messages);
    } catch (e) {
      console.log(e);
    }
  });
  socket.on("messageGroup", async ({ messageText, user, conversationId }) => {
    let messages = [];
    try {
      // Find the conversation between the user and the contact
      let conversation = await Conversation.findById(conversationId)
        .populate("participants")
        .populate("messages");
      // Create a new message
      const message = await Messages.create({
        message: messageText,
        sender: user.id,
      });
      if (conversation) {
        messages = [...conversation?.messages, message];
        // If conversation already exists, push the new message to it
        conversation.messages.push(message._id);
        await conversation.save();
        socket.to(conversation.id).emit("recieve-message", messages);
      }
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("join-room", ({ room, user }) => {
    socket.join(room);
    console.log(`${user?.username} joined room ${room}`);
  });
  socket.on("disconnect", () => {
    let username = socketIdToUserMap.get(socket.id);
    online.delete(username);
    console.log(online);
    socket.broadcast.emit("user-online", { userId: username, isOnline: false });
    socketIdToUserMap.delete(socket.id);
    console.log("user disconnected ", socket.id);
  });
});

// using express Routes
app.use("/", require("./routes"));

server.listen(PORT, () => {
  console.log("Server is running on Port:", PORT);
});
