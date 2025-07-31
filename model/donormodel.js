const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
      name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
       age: { type: Number, required: true },
      gender: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      contact: { type: Number, required: true },
      qualification: { type: String, required: true },
      occupation: { type: String, required: true },
      profilePic: { type: String, required: true },
      aadhaarFront: { type: String, required: true },
      aadhaarRear: { type: String, required: true },
       status: { type: Number, default: 1 }
  },
  { versionKey: false }
);

module.exports = mongoose.model("donordetailsform", schema);
