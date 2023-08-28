const guideController = require("../controles/guideController");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../config/multer");

// guide registration
router.post("/register", guideController.GuideRegitration);
router.post("/login", guideController.login);
router.post("/otp", guideController.otpVerify);
router.post("/getUser", authMiddleware, guideController.getUser);
router.post("/reset", guideController.resetPassword);
router.post("/resetotp", guideController.resetOtp);

// guide profile
router.post("/getProfile", authMiddleware, guideController.getProfile);
router.post("/getlocations", guideController.getLocation);
router.post(
  "/addDetails",
  upload.upload.single("image"),
  authMiddleware,
  guideController.addDetails
);
router.post(   
  "/editprofile",
  upload.upload.single("image"),
  authMiddleware,
  guideController.editProfile
);
router.post("/getOrder", authMiddleware, guideController.getOrder);
router.post("/sendcomplete",  guideController.sendComplete);
router.post("/checkcode",  guideController.checkCode);




module.exports = router;
