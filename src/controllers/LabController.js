const Categories = require("../models/categories");
const Product = require("../models/product");

class LabController {
	lab(req, res) {
		res.send("ok");
	}
	async cate(req, res) {
		const { id } = req.params;
		try {
			const productList = await Product.find({ category_id: id });
			res.status(200).json(productList);
		} catch (error) {
			res.status(404).json({ error: error.message });
		}
	}
	async getOutstandingProducts(req, res) {
		const outstandingProductList = await Product.find({ bestselling_Product: 1 });
		res.json(outstandingProductList);
	}
	async getProductLimit(req, res) {
		const { limit } = req.query;
		const productList = await Product.find().limit(limit);
		res.json(productList);
	}
	async searchProduct(req, res) {
		const { name } = req.query;
		const searchProduct = await Product.findOne({ name: name });
		res.json(searchProduct);
	}

	async getProductListIncreasePrice(req, res) {
		const { limit } = req.query;
		const productListWithIncreasePrice = await Product.find().limit(limit);
		productListWithIncreasePrice.sort((a, b) => a.price - b.price);
		res.json(productListWithIncreasePrice);
	}
	async getRelatedProducts(req, res) {
		const productList = await Product.find().limit(5);
		res.json(productList);
	}
	async findAndDeleteItem(req, res) {
		const { id } = req.params;
		const findProduct = await Product.findById(id);
		const deleteItem = await Product.findByIdAndDelete(id);
	}
	async productsManyViews(req, res) {
		const { value } = req.query;
		const productListWithManyViews = await Product.find({ view: { $gte: value } });
		res.json(productListWithManyViews);
	}
}
module.exports = new LabController();
