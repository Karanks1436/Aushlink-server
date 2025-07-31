const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp } = require("../controller/otpControllermob");

router.post("/send-otp-mob", sendOtp);
router.post("/verify-otp-mob", verifyOtp);

module.exports = router;
