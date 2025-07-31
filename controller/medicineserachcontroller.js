const User = require('../model/donormodel');
const Medicine = require('../model/donormedicineform');

// GET all distinct cities
const getDistinctCities = async (req, res) => {
  try {
    const cities = await User.distinct('city');
    // Ensure response is always an array
    res.status(200).json(Array.isArray(cities) ? cities : []);
  } catch (err) {
    console.error('Error fetching cities:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET medicines by city and medicine name
const getMedicinesByCity = async (req, res) => {
  const { city, medicine } = req.body;

  try {
    // Step 1: Find all users in given city (or all)
    let userQuery = {};
    if (city && city !== 'all') userQuery.city = city;

    const users = await User.find(userQuery);
    const emails = users.map(user => user.email);

    // Step 2: Query medicines by those emails (and optionally medicine name)
    const medQuery = { email: { $in: emails } };
    if (medicine && medicine.trim() !== '') {
      medQuery.medicine = { $regex: new RegExp(medicine.trim(), 'i') };
    }

    const medicines = await Medicine.find(medQuery);

    // Step 3: Map emails to full donor details
    const donorMap = {};
    users.forEach(user => {
      donorMap[user.email] = {
        name: user.name,
        contact: user.contact,
        city: user.city,
        address: user.address,
        email: user.email,
        usertype: user.usertype
      };
    });

    // Step 4: Combine medicine + donor info
    const enrichedMedicines = medicines.map(med => ({
      ...med._doc,
      donor: donorMap[med.email] || {}
    }));

    res.status(200).json(enrichedMedicines);
  } catch (err) {
    console.error('Error fetching medicines:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getDistinctCities,
  getMedicinesByCity,
};
