const express = require("express");
const {
 equipmentform,
  findEquipment,
  getAllEquipments,
  updateEquipment,
  deleteequipment,
} = require("../controller/equipmentcontroller");

const router = express.Router();
router.post("/upload-equipment", equipmentform);
router.get("/find", findEquipment);
router.get("/all-equipment", getAllEquipments);
router.put("/update-equipment/:id", updateEquipment);
router.delete('/delete/:id', deleteequipment);   

module.exports = router;
