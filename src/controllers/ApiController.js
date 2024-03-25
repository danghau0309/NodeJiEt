const Product = require("../models/product");
class ApiController {
	async api(req, res, next) {
		const _id = req.query.id;
		try {
			const products = await Product.find({});
			res.json(products);
		} catch (error) {
			next(error);
		}
	}
	async delete(req, res, next) {
		try {
			await Product.deleteOne({ _id: req.params.id });
			res.redirect("/admin/addProduct");
		} catch (error) {
			console.log(error.message);
		}
	}
	addToCart(req, res, next) {
		res.send("oke");
	}
}

module.exports = new ApiController();
