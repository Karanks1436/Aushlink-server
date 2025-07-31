const twilio = require("twilio");

// ✅ Twilio credentials (keep safe in production)
const TWILIO_ACCOUNT_SID = (process.env.TWILIO_ACCOUNT_SID);
const TWILIO_AUTH_TOKEN = (process.env.TWILIO_AUTH_TOKEN);
const VERIFY_SERVICE_SID = (process.env.VERIFY_SERVICE_SID);

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// === Send OTP ===
exports.sendOtp = async (req, res) => {
  const { phone } = req.body;

  try {  
    const verification = await client.verify.v2
      .services(VERIFY_SERVICE_SID)
      .verifications.create({
        to: phone,
        channel: "sms",
      });

    res.json({
      success: true,
      message: "OTP sent successfully",
      sid: verification.sid,
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// === Verify OTP ===
exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const verification_check = await client.verify.v2
      .services(VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: phone,
        code: otp,
      });

    if (verification_check.status === "approved") {
      res.json({ success: true, message: "OTP verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};
