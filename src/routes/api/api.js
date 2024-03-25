const express = require("express");
const router = express.Router();
const ApiController = require("../../controllers/ApiController");
router.get("/data", ApiController.api);
router.delete("/data/:id", ApiController.delete);
// router.post("/data/:id", ApiController.addToCart);

module.exports = router;
