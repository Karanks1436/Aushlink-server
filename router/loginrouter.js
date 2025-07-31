const express = require("express");
const { login } = require("../controller/logincontroller");
const router = express.Router();
const signupmodel = require("../model/signupmodel");
const nodemailer = require("nodemailer");
const { validateTokenn2 } = require("../config/validate");

router.post("/loginuser", login); 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: (process.env.user),
        pass: (process.env.pass),

  },
});

router.post("/send-login-email", validateTokenn2, async (req, res) => {
  const { email } = req.body;

  try {
    const user = await signupmodel.findOne({ email });
    if (!user) return res.json({ status: false, msg: "User not found" });

    await transporter.sendMail({
      from: '"KaranKS" <karanksxxx@gmail.com>',
      to: email,
      subject: '✅ Successful Login',
      html: `
       <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', Roboto, sans-serif; background: #ffffff; border-radius: 14px; box-shadow: 0 0 25px rgba(0, 123, 255, 0.1); overflow: hidden;">

  <!-- Header -->
  <div style="background: linear-gradient(135deg, #007bff, #00c6ff); padding: 24px; text-align: center;">
    <h2 style="color: #fff; margin: 0; font-size: 24px;">🔐 Login Successful</h2>
  </div>

  <!-- Body -->
  <div style="padding: 30px 25px; color: #333; background-color: #fafafa;">
    <p style="font-size: 16px; margin: 0 0 18px;">Hi <strong>${user.email}</strong>,</p>

    <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      You have <strong>successfully logged in</strong> to your account.
    </p>

    <div style="padding: 15px; background-color: #e8f4ff; border-left: 4px solid #007bff; border-radius: 8px; margin-bottom: 20px;">
      <p style="margin: 0; font-size: 15px; color: #0056b3;">
        If this login wasn't made by you, please <a href="mailto:karanksxxx@gmail.com" style="color: #007bff; text-decoration: underline;">contact support</a> immediately to secure your account.
      </p>
    </div>

    <p style="font-size: 14px; color: #888; margin-top: 20px;">📅 Sent on: ${new Date().toLocaleString()}</p>
  </div>

  <!-- Footer -->
  <div style="background-color: #f0f4f8; padding: 16px; text-align: center; font-size: 13px; color: #777;">
    <p style="margin: 0;">This is an automated message from <strong>Aushlink</strong>.</p>
    <p style="margin: 5px 0 0;">© ${new Date().getFullYear()} Aushlink. All rights reserved.</p>
  </div>

</div>

      `,
    });

    res.json({ status: true, msg: "Login email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, msg: "Failed to send email." });
  }
});

module.exports = router;
