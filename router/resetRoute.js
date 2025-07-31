
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const loginmodel = require('../model/signupmodel'); 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
        user: (process.env.user),
        pass: (process.env.pass),

  },
});

router.post('/send-reset-email', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await loginmodel.findOne({ email });
    if (!user) return res.json({ status: false, msg: 'loginmodel not found' });

    const resetLink = `http://localhost:5173/reset-password?email=${email}`;

    await transporter.sendMail({
      from: '"MyApp Support" <karanksxxx@gmail.com>',
      to: email,
      subject: 'Password Reset',
      html: `
        <p>You requested a password reset.</p>
        <p><a href="${resetLink}">Click here to reset your password</a></p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    res.json({ status: true, msg: 'Reset email sent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, msg: 'Failed to send email.' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await loginmodel.findOne({ email });
    if (!user) return res.json({ status: false, msg: 'loginmodel not found' });

    user.password = password;
    await user.save();

    res.json({ status: true, msg: 'Password reset successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, msg: 'Failed to reset password.' });
  }
});

module.exports = router;
 