
const User = require("../model/signupmodel");
const jwt = require("jsonwebtoken");

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.json({ status: false, msg: "❌ Invalid email or password" });
    }

    if (user.status === 0) {
      return res.json({ status: false, msg: "🚫 Your account is blocked." });
    }

    if (user.status !== 1) {
      user.status = 1;
      await user.save();
    }

    const token = jwt.sign({ email: user.email }, process.env.SEC_KEY, { expiresIn: "1h" });

    res.json({
      status: true,
      msg: "✅ Login successful",
      userType: user.userType,
      token,
    });
  } catch (err) {
    res.json({ status: false, msg: "Server error: " + err.message });
  }
}

module.exports = { login };
