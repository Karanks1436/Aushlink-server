const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    dateOfSignup: { type: Date, default: Date.now },
    userType: { type: String, required: true, enum: ["needy", "donor","Needy","Donor"] },
    contact: { type: Number, required: true },
      status: { type: Number, default: 1 }, // 1 = active, 0 = blocked
  },
  { versionKey: false }
);

module.exports = mongoose.model("signupuser", schema);
