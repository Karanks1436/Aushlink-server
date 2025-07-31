// const User = require('../model/donormodel');
// const Equipment = require('../model/donorequipment');

// const getDistinctCities = async (req, res) => {
//   try {
//     const cities = await User.distinct('city');
//     res.status(200).json(cities);
//   } catch (err) {
//     console.error('Error fetching cities:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// const getEquipmentsByCity = async (req, res) => {
//   const { city, equipment } = req.body;

//   try {
//     let emails = [];
//     if (!city || city === 'all' || city === '') {
//       const allUsers = await User.find();
//       emails = allUsers.map(user => user.email);
//     } else {
//       const usersInCity = await User.find({ city });
//       emails = usersInCity.map(user => user.email);
//     }

//     const query = { email: { $in: emails } };

//     if (equipment && equipment.trim() !== '') {
//       query.equipment = { $regex: new RegExp(equipment.trim(), 'i') };
//     }

//     const equipments = await Equipment.find(query);
//     const users = await User.find({ email: { $in: emails } });
//     const contactMap = {};

//     users.forEach(user => {
//       contactMap[user.email] = user.contact;
//     });
    
//     const enrichedequipments = equipments.map(equip => ({
//       ...equip._doc,
//       contact: contactMap[equip.email] || 'N/A',
//     }));

//     res.status(200).json(enrichedequipments);
//   } catch (err) {
//     console.error('Error fetching equipments:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// module.exports = {
//   getDistinctCities,
//   getEquipmentsByCity,
// };



const User = require('../model/donormodel');
const Equipment = require('../model/donorequipment');

const getDistinctCities = async (req, res) => {
  try {
    const cities = await User.distinct('city');
    res.status(200).json(cities);
  } catch (err) {
    console.error('Error fetching cities:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getEquipmentsByCity = async (req, res) => {
  const { city, equipment } = req.body;

  try {
    let emails = [];
    if (!city || city === 'all' || city === '') {
      const allUsers = await User.find();
      emails = allUsers.map(user => user.email);
    } else {
      const usersInCity = await User.find({ city });
      emails = usersInCity.map(user => user.email);
    }

    const query = { email: { $in: emails } };

    if (equipment && equipment.trim() !== '') {
      query.equipment = { $regex: new RegExp(equipment.trim(), 'i') };
    }

    const equipments = await Equipment.find(query);
    const users = await User.find({ email: { $in: emails } });

    // Map email to full user object
    const userMap = {};
    users.forEach(user => {
      userMap[user.email] = user;
    });

    const enrichedEquipments = equipments.map(equip => {
      const donor = userMap[equip.email] || {};
      return {
        ...equip._doc,
        donorName: donor.name || 'N/A',
        donorAge: donor.age || 'N/A',
        donorGender: donor.gender || 'N/A',
        donorBloodGroup: donor.bloodgroup || 'N/A',
        donorAddress: donor.address || 'N/A',
        donorCity: donor.city || 'N/A',
        contact: donor.contact || 'N/A'
      };
    });

    res.status(200).json(enrichedEquipments);
  } catch (err) {
    console.error('Error fetching equipments:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getDistinctCities,
  getEquipmentsByCity,
};
