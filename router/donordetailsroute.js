const express = require("express");

const { donordetails, updateDonorDetails, findDonor } = require("../controller/donordetailscontroller");

const router = express.Router();

router.post("/donordetails", donordetails);
router.post("/update", updateDonorDetails); 
router.get("/find", findDonor);


module.exports = router;
