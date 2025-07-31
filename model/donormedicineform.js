const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    medicine: { type: String, required: true },
    company: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    packing: { type: String, required: true },
    qty: { type: Number, required: true },
      otherInfo: { type: String},
      imageUrl: String,
  },
  { versionKey: false }
);

module.exports = mongoose.model("Medicines", schema);
