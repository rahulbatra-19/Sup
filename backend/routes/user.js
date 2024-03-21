const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");
const Conversation = require("../models/conversation");
const multer = require("multer");
const photosMiddleware = multer({ dest: "/tmp" });
const mongoose = require("mongoose");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const bucket = "rahul-formbuilder-app";

router.post("/register", async (req, res) => {
  const { username, pin, name } = req.body;
  try {
    const user = await UserModel.findOne({
      username,
    });
    if (!user) {
      const newUser = await UserModel.create({
        username,
        pin,
        name,
      });
      req.session.user = { username: user?.username, id: user?.id };
      console.log("User logged in:", req.session.user);
      return res.status(200).json({
        message: "User created successfully!",
        user: { username: newUser?.username, id: newUser?._id },
      });
    }
    return res.status(200).json({ message: "User already exists!!" });
  } catch (e) {
    console.log(e);
    return res.status(402).json({ error: "Authentication failed" });
  }
});

router.post("/authenticate", async (req, res) => {
  const { username, pin } = req.body;
  //   const username = "Rahul";
  console.log(username, pin);
  try {
    const user = await UserModel.findOne({
      username,
    });
    if (!user) {
      return res.status(200).json({
        message: "User does not exist!",
      });
    } else {
      if (user.pin == pin) {
        req.session.user = { username: user?.username, id: user?.id };

        console.log("User logged in:", req.session.user);

        return res.status(200).json({
          message: "User successfully loged in",
          user: {
            username: user?.username,
            id: user?._id,
            avatar: user?.avatar,
          },
        });
      } else {
        return res.status(200).json({ message: "Wrong Pin" });
      }
    }
  } catch (e) {
    console.log(e);
    return res.status(402).json({ error: "Authentication failed" });
  }
});

router.get("/all", async (req, res) => {
  const { username } = req.query;
  console.log("session", req.session.user);
  globalUser = req.session.user;
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
    console.log(conversations);
    let chattingUsersIds = conversations
      .map(
        (convo) =>
          !convo.isGroup &&
          convo?.participants?.find(
            (ele) => ele.toString() !== user._id.toString()
          )
      )
      .filter((ele) => ele);
    console.log(chattingUsersIds);
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

router.get("/getByUsername", async (req, res) => {
  let { username } = req.query;
  try {
    let user = await UserModel.findOne({
      username,
    }).select("-pin -__v");
    if (user) {
      return res.status(200).json({ user, message: "User Found" });
    } else {
      return res.status(200).json({ message: "User Details Not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error while fetching user details" });
  }
});

router.post("/updateInfo", async (req, res) => {
  let { username, name, description, pin, id } = req.body;
  try {
    if (pin) {
      let user = await UserModel.findByIdAndUpdate(
        id,
        {
          username,
          name,
          description,
          pin,
        },
        { new: true }
      );
      return res.json({ user });
    } else {
      let user = await UserModel.findByIdAndUpdate(
        id,
        {
          username,
          name,
          description,
        },
        { new: true }
      );
      return res.json({ user });
    }
  } catch (error) {
    return res.status(500).json({ error: error?.message });

    console.log(error);
  }
});

async function uploadToS3(path, originalFilename, mimetype) {
  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  const parts = originalFilename.split(".");
  const ext = parts[parts.length - 1];
  const newFilename = Date.now() + "." + ext;
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Body: fs.readFileSync(path),
      Key: newFilename,
      ContentType: mimetype,
      ACL: "public-read",
    })
  );
  return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}
router.post(
  "/avatar/upload",
  photosMiddleware.single("photo"),
  async (req, res) => {
    try {
      const { path, originalname, mimetype } = req.file;
      const { userId } = req.body;
      const url = await uploadToS3(path, originalname, mimetype);
      const user = await UserModel.findByIdAndUpdate(
        userId,
        {
          avatar: url,
        },
        { new: true }
      );
      if (user) {
        res.json({ user });
      }
    } catch (err) {
      return res.status(500).json({ error: "Error in Uploading image", err });
    }
  }
);

module.exports = router;
