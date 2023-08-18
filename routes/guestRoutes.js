const guestController = require("../controles/guestController");
const authMiddlewareguest = require("../middleware/authMiddlewareguest");
const express = require("express");
const guestroutes = express.Router();

guestroutes.post("/register", guestController.registeration);
guestroutes.post("/otp", guestController.otpVerify);
guestroutes.post("/login", guestController.login);
guestroutes.post("/getUser", authMiddlewareguest, guestController.getUser);
guestroutes.post("/reset", guestController.resetPassword);
guestroutes.post("/resetotp", guestController.resetOtp);
guestroutes.post("/getlocation", guestController.getlocations);
guestroutes.post("/order", authMiddlewareguest, guestController.postOrder);
guestroutes.post("/sendDetails", guestController.saveDetails);
guestroutes.post("/bookorder", authMiddlewareguest, guestController.bookDeal);
guestroutes.post("/paymentUpdate", guestController.paymentUpdate);
guestroutes.post("/getOrders", authMiddlewareguest, guestController.getOrders);



module.exports = guestroutes;
