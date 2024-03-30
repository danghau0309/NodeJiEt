const express = require("express");
const router = express.Router();
const profileController = require("../controllers/ProfileController");
const { storage, upload } = require("./lib/multer");
router.post("/updateProfile/:id", upload.single("userImage"), profileController.updateProfile);
router.get("/my_order", profileController.my_order);
router.get("/", profileController.profile);
module.exports = router;
