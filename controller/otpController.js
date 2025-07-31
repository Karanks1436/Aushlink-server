const OTPModel = require("../model/OTPModel");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: (process.env.user),
    pass: (process.env.pass),
  },
});

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    await OTPModel.create({
      email,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 min expiry
    });

    await transporter.sendMail({
      to: email,
      subject: "OTP Verification",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
  <h2 style="color: #1a73e8; text-align: center; margin-bottom: 10px;">Email OTP</h2>
  <hr style="border: none; border-top: 1px solid #ccc; margin: 10px 0;" />

  <p>Dear User,</p>
  <p>Your One-Time Password (OTP) is:</p>

  <h1 style="color: #34a853; font-size: 36px; text-align: center; margin: 20px 0;">
    ${otp}
  </h1>

  <p>Please use this OTP to complete your login process. Do not share this code with anyone.</p>
  <p>Thank you for using Email OTP!</p>

  <p style="text-align: center; font-size: 12px; color: #888; margin-top: 30px;">
    © <a href="https://www.rohitchouhan.com" target="_blank" style="color: #1a73e8; text-decoration: none;">www.rohitchouhan.com</a>. All rights reserved.
  </p>
</div>
`,
    });

    res.json({ status: true, msg: "OTP sent successfully" });
  } catch (err) {
    res.json({ status: false, msg: "Failed to send OTP", error: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const record = await OTPModel.findOne({ email, otp });
    if (!record) return res.json({ status: false, msg: "Invalid OTP" });
    if (record.expiresAt < Date.now()) return res.json({ status: false, msg: "OTP expired" });

    res.json({ status: true, msg: "OTP verified" });
  } catch (err) {
    res.json({ status: false, msg: "OTP verification failed", error: err.message });
  }
};
