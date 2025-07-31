const Equipment = require("../model/donorequipment");
const path = require("path");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: (process.env.cloud_name),
  api_key: (process.env.api_key),
  api_secret: (process.env.api_secret),
});
async function uploadToCloud(file) {
  const filePath = path.join(__dirname, "..", "uploads", file.name);
  await file.mv(filePath);
  const result = await cloudinary.uploader.upload(filePath);
  return result.secure_url;
}


async function equipmentform(req, res) {
 try {
    const files = req.files;
    let imageUrl = "nopic.jpg";

    if (files && files.image) {
      imageUrl = await uploadToCloud(files.image);
    }

    const eqpData = {
      ...req.body,
      imageUrl,
    };

    const equip = new Equipment(eqpData);
    const saved = await equip.save();

    res.json({ status: true, msg: "✅ Record Saved Successfully", obj: saved });
  } catch (err) {
    res.status(500).json({ status: false, msg: err.message });
  }
}
const findEquipment = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const equipments = await Equipment.find({ email });
    res.json(equipments);
  } catch (err) {
    console.error('Error fetching equipments:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteequipment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Equipment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json({ message: 'Equipment deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
async function getAllEquipments(req, res) {
  try {
    const all = await Equipment.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ status: false, msg: err.message });
  }
}

async function updateEquipment(req, res) {
  try {
    const { id } = req.params;

    // Existing medicine record
    const existing = await Equipment.findById(id);
    if (!existing) {
      return res.json({ status: false, msg: "❌ Equipment not found." });
    }

    let updatedData = { ...req.body };

    if (req.files && req.files.image) {
      const newImageUrl = await uploadToCloud(req.files.image);
      updatedData.imageUrl = newImageUrl;
    }

    const updated = await Equipment.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.json({
      status: true,
      msg: "✅ Equipment updated successfully",
      obj: updated,
    });
  } catch (err) {
    res.status(500).json({ status: false, msg: err.message });
  }}

module.exports = {
  equipmentform,
  findEquipment,
  getAllEquipments,
  updateEquipment,
  deleteequipment,
};
