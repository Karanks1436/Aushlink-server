const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
      name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      gender: { type: String, required: true },
      address: { type: String, required: true },
      contact: { type: Number, required: true },
      dob:{type:String, required: true},
      aadhaarFront: { type: String, required: true },
      aadhaarRear: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("needydetailsform", schema);
