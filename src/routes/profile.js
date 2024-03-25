const express = require("express");
const router = express.Router();
const profileController = require("../controllers/ProfileController");
router.get("/", profileController.profile);
module.exports = router;
