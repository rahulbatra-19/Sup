const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");

router.get("/", async (req, res) => {
  res.send("Hello World!");
});

router.use("/group", require("./group"));
router.use("/conversation", require("./conversation"));
router.use("/User", require("./user"));

module.exports = router;
