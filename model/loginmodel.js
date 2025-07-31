const User = require("../model/signupmodel"); // or "donormodel" if you're using that

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ status: false, msg: "❌ Email and Password are required" });
    }

    const user = await User.findOne({ email: email, password: password });

    if (user) {
      res.json({ status: true, msg: "✅ Login Successful", obj: user });
    } else {
      res.json({ status: false, msg: "❌ Invalid email or password" });
    }
  } catch (err) {
    res.json({ status: false, msg: err.message });
  }
}

module.exports = { login };
