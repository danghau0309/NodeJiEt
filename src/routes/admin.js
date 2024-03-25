const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");
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
router.get("/addProduct", adminController.showProduct);
router.post("/addProduct", adminController.addProduct);
router.get("/:id/edit", adminController.editProduct);
router.put("/:id", upload.single("image"), adminController.updateProduct);
router.get("/", adminController.admin);
module.exports = router;
