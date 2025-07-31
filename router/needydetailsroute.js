const express = require("express");
const { needydetails, updateNeedyDetails, findNeedy } = require("../controller/needydetailscontroller");

const router = express.Router();

router.post("/needy-details", needydetails);
router.post("/update", updateNeedyDetails); 
router.get("/findneedy", findNeedy);


module.exports = router;
