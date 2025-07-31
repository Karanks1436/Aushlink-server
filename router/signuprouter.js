const express = require("express");
const { signup, updateUser } = require("../controller/signupcontroller");

const router = express.Router();
router.post("/signupuser", signup);
router.post("/updateuser", updateUser);

module.exports = router;
  