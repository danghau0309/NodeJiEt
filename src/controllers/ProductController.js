const Product = require("../models/product");
const Cart = require("../models/cart");
const moment = require("moment");

class ProductController {
	async productDetail(req, res, next) {
		const showDetail = await Product.findOne({ slug: req.params.slug });
		await Product.findOneAndUpdate({ slug: req.params.slug }, { $inc: { view: 1 } });
		const commentList = showDetail.comments;
		res.render("showDetails/detail", { showDetail, commentList });
	}

	async showHome(req, res, next) {
		try {
			const products = await Product.find({});
			const bestSelling = await Product.find({ bestselling_Product: 1 });
			const productsWithManyViews = await Product.find({ view: { $gte: 50 } });
			res.render("home", {
				products,
				bestSelling,
				productsWithManyViews
			});
		} catch (error) {
			next(error);
		}
	}

	async apiCart(req, res, next) {
		const apiCartList = await Cart.find({});
		res.json(apiCartList);
	}
	async comments(req, res, next) {
		try {
			const { slug } = req.params;
			const { content } = req.body;
			const product = await Product.findOne({ slug });
			const commentTime = new Date(Date.now());
			const formattedTime = moment(commentTime).format("D/M/YYYY HH:mm");
			product.comments.push({
				content,
				username: req.session.username,
				commentTime: formattedTime
			});
			await product.save();
			res.redirect(`/product/${slug}`);
		} catch (err) {
			res.status(500).json(err);
		}
	}
}
module.exports = new ProductController();
