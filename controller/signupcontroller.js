const User = require("../model/signupmodel");
var jwt=require("jsonwebtoken");
async function signup(req, res) {
  try {
    const user = new User(req.body);
    const saved = await user.save();
    res.json({ status: true, msg: "✅ Record Saved Successfully", obj: saved });
  } catch (err) {
    if (err.code === 11000 && err.keyValue?.email) {
      return res.json({ status: false, msg: "❌ Email already registered" });
    }
    res.json({ status: false, msg: err.message });
  }
}
async function updateUser(req, res) {
  try {
    const { email, password } = req.body;
    const updated = await User.findOneAndUpdate(
      { email },
      { password },
      { new: true }
    );
    if (!updated) return res.json({ status: false, msg: "User not found" });
    res.json({ status: true, msg: "Password updated successfully!" });
  } catch (err) {
    res.json({ status: false, msg: err.message });
  }
}


module.exports = { signup , updateUser};
