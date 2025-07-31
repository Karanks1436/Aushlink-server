const needy = require("../model/needymodel");
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

async function needydetails(req, res) {
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

    const doc = new needy(donorData);
    const saved = await doc.save();

    res.json({ status: true, msg: "Record Saved", obj: saved });
  } catch (err) {
    res.json({ status: false, msg: err.message });
  }
}

async function updateNeedyDetails(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.json({ status: false, msg: "Email is required for update" });

    const donorExists = await needy.findOne({ email });
    if (!donorExists) return res.json({ status: false, msg: "Needy not found" });

    let updatedData = { ...req.body };

    if (req.files?.aadhaarFront) {
      updatedData.aadhaarFront = await uploadToCloud(req.files.aadhaarFront);
    }
    if (req.files?.aadhaarRear) {
      updatedData.aadhaarRear = await uploadToCloud(req.files.aadhaarRear);
    }

    await needy.updateOne({ email }, { $set: updatedData });

    res.json({ status: true, msg: "Record Updated" });
  } catch (err) {
    res.json({ status: false, msg: err.message });
  }
}

async function findNeedy(req, res) {
  try {
    const email = req.query.email;
    const result = await needy.findOne({ email });
    if (!result) return res.json({ status: false, msg: "Needy not found" });

    res.json({ status: true, msg: "Needy found", obj: result });
  } catch (err) {
    res.json({ status: false, msg: err.message });
  }
}


module.exports = {
  needydetails,
  updateNeedyDetails,
  findNeedy,
};
