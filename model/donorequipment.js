const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    equipment: { type: String, required: true },
    condition: { type: String, required: true },
      otherInfo: { type: String},
      imageUrl:{type: String, required: true},
  },
  { versionKey: false }
);

module.exports = mongoose.model("Equipments", schema);
