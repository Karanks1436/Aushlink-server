var express = require("express");
const dotenv = require('dotenv');
var signuprouter = require("./router/signuprouter");
var loginrouter = require("./router/loginrouter");
var donordetailsroute = require("./router/donordetailsroute");
var needydetailsroute = require("./router/needydetailsroute");
const verifyAadhaar = require("./router/verify-aadhaar");
const otpRoutes = require("./router/otpRoutes"); 

const resetRoute = require('./router/resetRoute');
const medicineformrouter = require('./router/medicineformrouter');
const equipmentformrouter = require('./router/equipmentformrouter');
const adminroutes = require('./router/adminroutes');


const aadhaarRoutes = require('./router/verify-aadhaar');
const medicineRoutes = require('./router/medicinesearchroute');
const equipmentsearchroute = require('./router/equipmentsearchroute');

var app = express();
var fileuploader = require("express-fileupload");
var mongoose = require("mongoose");
const cors = require('cors');

app.listen(1400, () => {
  console.log("server is running on port 1400");
});
 
 dotenv.config();
  console.log(process.env.SEC_KEY);
let url =
  (process.env.url);
mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use(fileuploader());
// app.use(express.json()); 
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cors());

app.use("/signup", signuprouter);
app.use("/login", loginrouter);
app.use("/donor", donordetailsroute);
app.use("/needy", needydetailsroute);

app.use("/otp", otpRoutes);

app.use('/reset', resetRoute);
app.use('/medicine', medicineformrouter);
app.use('/equipment', equipmentformrouter);
app.use('/admin', adminroutes);


app.use('/verify-aadhaar', aadhaarRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/equipment', equipmentsearchroute);



app.use("/", (req, res) => {
  res.send("hello world");
});

