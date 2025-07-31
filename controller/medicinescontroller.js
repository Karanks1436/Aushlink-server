const Medicine = require("../model/donormedicineform");
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


async function medicineform(req, res) {
 try {
    const files = req.files;
    let imageUrl = "nopic.jpg";

    if (files && files.image) {
      imageUrl = await uploadToCloud(files.image);
    }

    const medData = {
      ...req.body,
      imageUrl,
    };

    const med = new Medicine(medData);
    const saved = await med.save();

    res.json({ status: true, msg: "✅ Record Saved Successfully", obj: saved });
  } catch (err) {
    res.status(500).json({ status: false, msg: err.message });
  }
}
const findMedicine = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const medicines = await Medicine.find({ email });
    res.json(medicines);
  } catch (err) {
    console.error('Error fetching medicines:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Medicine.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.json({ message: 'Medicine deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
async function getAllMedicines(req, res) {
  try {
    const all = await Medicine.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ status: false, msg: err.message });
  }
}

async function updateMedicine(req, res) {
  try {
    const { id } = req.params;

    // Existing medicine record
    const existing = await Medicine.findById(id);
    if (!existing) {
      return res.json({ status: false, msg: "❌ Medicine not found." });
    }

    let updatedData = { ...req.body };

    if (req.files && req.files.image) {
      const newImageUrl = await uploadToCloud(req.files.image);
      updatedData.imageUrl = newImageUrl;
    }

    const updated = await Medicine.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.json({
      status: true,
      msg: "✅ Medicine updated successfully",
      obj: updated,
    });
  } catch (err) {
    res.status(500).json({ status: false, msg: err.message });
  }}

module.exports = {
  medicineform,
  findMedicine,
  getAllMedicines,
  updateMedicine,
  deleteMedicine,
};
