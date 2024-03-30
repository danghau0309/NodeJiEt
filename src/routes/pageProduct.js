const express = require("express");
const router = express.Router();
const pageProducts = require("../controllers/PageProductController");
router.get("/", pageProducts.pageProduct);
module.exports = router;
