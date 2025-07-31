const express = require("express");
const {
  medicineform,
  findMedicine,
  getAllMedicines,
  updateMedicine,
  deleteMedicine,
} = require("../controller/medicinescontroller");

const router = express.Router();
router.post("/upload-medicine", medicineform);
router.get("/find", findMedicine);
router.get("/all-medicines", getAllMedicines);
router.put("/update-medicine/:id", updateMedicine);
router.delete('/delete/:id', deleteMedicine);   

module.exports = router;
