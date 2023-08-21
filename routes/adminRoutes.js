const express = require("express");
const adminroutes = express.Router();
const adminController = require("../controles/adminController");
const authMidlewareadmin = require("../middleware/authMidlewareadmin");
const upload=require('../config/multer')

adminroutes.post("/login", adminController.adminLogin);
adminroutes.post("/getAdmin", authMidlewareadmin, adminController.getAdmin);
adminroutes.post("/addlocation", adminController.addlocation);
adminroutes.post("/getlocation", adminController.getLocation);
adminroutes.get("/getGuide", adminController.getGuide);
adminroutes.post("/getdetails", adminController.guideDetails);
adminroutes.post("/verifyguide", adminController.changeStatus);
adminroutes.post("/editlocation", adminController.editLocation);
adminroutes.get("/getGuest", adminController.getGuest);

adminroutes.post("/blockUser", adminController.blockGuide);
adminroutes.post("/blockGuest", adminController.blockGuest);
adminroutes.get("/getOrders", adminController.getOrders);
adminroutes.post("/addbanner",upload.upload.single("image"), adminController.addBanner);
adminroutes.get("/getbanner", adminController.getBanner);
adminroutes.post("/addguestbanner",upload.upload.array("image",3), adminController.addGuestBanner);





module.exports = adminroutes;
