const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/AuthController");
const multer = require("multer");
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./src/public/img/");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});
const upload = multer({ storage: storage });

router.get("/signup", authController.signup);
router.get("/logout", authController.logout);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", authController.googleCallback);
router.get("/google/success", authController.success);
router.post("/signup/addUser", upload.single("userImage"), authController.addUser);
router.post("/login/handleLogin", authController.login);
router.get("/login", authController.renderLogin);

module.exports = router;
