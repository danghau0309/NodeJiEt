const express = require("express");
const router = express.Router();
const LabController = require("../controllers/LabController");
// CRUD user
router.get("/showUser", LabController.showUser);
router.post("/addUser", LabController.addUser);
router.delete("/deleteUser/:id", LabController.deleteUser);
router.put("/updateUser/:id", LabController.updateUser);
// CRUD category
router.get("/showCategory", LabController.showCategory);
router.post("/addCategory/", LabController.addCategory);
router.delete("/deleteCategory/:id", LabController.deleteCategory);
router.put("/updateCategory/:id", LabController.updateCategory);
//
router.get("/cate/:id", LabController.cate);
router.get("/getOutstandingProducts", LabController.getOutstandingProducts);
router.get("/pagination", LabController.pagination);
router.get("/searchProduct", LabController.searchProduct);
router.get("/getProductListIncreasePrice", LabController.getProductListIncreasePrice);
router.get("/getRelatedProducts/:product_id", LabController.getRelatedProducts);
router.delete("/findAndDeleteItem/:id", LabController.findAndDeleteItem);
router.get("/productsManyViews", LabController.productsManyViews);
router.get("/", LabController.lab);
module.exports = router;
