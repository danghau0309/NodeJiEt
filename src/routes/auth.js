const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/AuthController");
const { storage, upload } = require("./lib/multer");
router.get("/signup", authController.signup);
router.get("/logout", authController.logout);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", authController.googleCallback);
router.get("/google/success", authController.success);
router.post("/signup/addUser", upload.single("userImage"), authController.register);
router.post("/login/handleLogin", authController.login);
router.get("/login", authController.renderLogin);

module.exports = router;
