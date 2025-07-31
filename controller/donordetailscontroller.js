const donor = require("../model/donormodel");
const path = require("path");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "process.env.",
  api_key: "process.env.api_key",
  api_secret: "process.env.api_secret",
});

async function uploadToCloud(file) {
  const filePath = path.join(__dirname, "..", "uploads", file.name);
  await file.mv(filePath);
  const result = await cloudinary.uploader.upload(filePath);
  return result.secure_url;
}

async function donordetails(req, res) {
  try {
    let files = req.files;
    let cloudUrls = {
      profilePic: "nopic.jpg",
      aadhaarFront: "nopic.jpg",
      aadhaarRear: "nopic.jpg",
    };

    for (let key in cloudUrls) {
      if (files && files[key]) {
        cloudUrls[key] = await uploadToCloud(files[key]);
      }
    }

    const donorData = {
      ...req.body,
      profilePic: cloudUrls.profilePic,
      aadhaarFront: cloudUrls.aadhaarFront,
      aadhaarRear: cloudUrls.aadhaarRear,
    };

    const doc = new donor(donorData);
    const saved = await doc.save();

    res.json({ status: true, msg: "Record Saved", obj: saved });
  } catch (err) {
    res.json({ status: false, msg: err.message });
  }
}

async function updateDonorDetails(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.json({ status: false, msg: "Email is required for update" });

    const donorExists = await donor.findOne({ email });
    if (!donorExists) return res.json({ status: false, msg: "Donor not found" });

    let updatedData = { ...req.body };

    if (req.files?.profilePic) {
      updatedData.profilePic = await uploadToCloud(req.files.profilePic);
    }
    if (req.files?.aadhaarFront) {
      updatedData.aadhaarFront = await uploadToCloud(req.files.aadhaarFront);
    }
    if (req.files?.aadhaarRear) {
      updatedData.aadhaarRear = await uploadToCloud(req.files.aadhaarRear);
    }

    await donor.updateOne({ email }, { $set: updatedData });

    res.json({ status: true, msg: "Record Updated" });
  } catch (err) {
    res.json({ status: false, msg: err.message });
  }
}

async function findDonor(req, res) {
  try {
    const email = req.query.email;
    const result = await donor.findOne({ email });
    if (!result) return res.json({ status: false, msg: "Donor not found" });

    res.json({ status: true, msg: "Donor found", obj: result });
  } catch (err) {
    res.json({ status: false, msg: err.message });
  }
}


module.exports = {
  donordetails,
  updateDonorDetails,
  findDonor,
};
