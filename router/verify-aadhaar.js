// router/verify-aadhaar.js
const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
const { aadhaarVerify } = require('../controller/aadhaarController');

// 👇 must match 'aadhaarImage' from frontend FormData key
router.post('/aadhar-verify', upload.single('aadhaarImage'), aadhaarVerify);

module.exports = router;
