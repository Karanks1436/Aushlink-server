const User = require("../model/signupmodel");
const DonorDetails = require("../model/donormodel");
const NeedyDetails = require("../model/needymodel");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "email userType status contact"); // only return necessary fields
    res.json({ status: true, users });
  } catch (error) {
    res.json({ status: false, msg: "Failed to fetch users: " + error.message });
  }
};

const toggleUserStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.json({ status: false, msg: "User not found" });

    user.status = user.status === 1 ? 0 : 1;
    await user.save();

    res.json({ status: true, msg: `User ${user.status === 1 ? "resumed" : "blocked"} successfully.` });
  } catch (err) {
    res.json({ status: false, msg: "Error: " + err.message });
  }
};




const getAllDonorsWithEmail = async (req, res) => {
  try {
    const donors = await DonorDetails.find({}, "name email contact profilePic");

    res.json({ status: true, donors });
  } catch (error) {
    res.json({ status: false, msg: "Failed to fetch donors: " + error.message });
  }
};

const getAllNeedies = async (req, res) => {
  try {
    const needies = await NeedyDetails.find();
    res.json({ status: true, needies });
  } catch (error) {
    res.json({ status: false, msg: "Failed to fetch needies: " + error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ status: false, msg: 'User not found' });
    }

    // Delete from DonorDetails or NeedyDetails based on userType
    if (user.userType === 'donor') {
      await DonorDetails.deleteMany({ email: user.email });
    } else if (user.userType === 'needy') {
      await NeedyDetails.deleteMany({ email: user.email });
    }

    // Finally delete the user
    await User.findByIdAndDelete(id);

    res.json({ status: true, msg: 'User and associated details deleted successfully' });

  } catch (err) {
    console.error('Error deleting user and details:', err);
    res.status(500).json({ status: false, msg: 'Failed to delete user and details: ' + err.message });
  }
};


module.exports = { getAllUsers, toggleUserStatus, getAllDonorsWithEmail,getAllNeedies, deleteUser };
