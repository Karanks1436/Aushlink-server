const express = require("express");
const router = express.Router();
const { getAllUsers, toggleUserStatus,getAllDonorsWithEmail, getAllNeedies, deleteUser } = require("../controller/admincontroller");

router.get("/users", getAllUsers);
router.patch("/users/:userId/status", toggleUserStatus);
router.get("/donors", getAllDonorsWithEmail);
router.get("/allneedies", getAllNeedies); 
router.delete('/users/:id', deleteUser);
module.exports = router;
