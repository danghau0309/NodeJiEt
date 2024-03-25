const { response } = require("express");
const Product = require("../models/product");
class AdminController {
	admin(req, res, next) {
		res.render("admin/admin");
	}
	async showProduct(req, res, next) {
		try {
			const productList = await Product.find({});
			res.render("admin/addProduct", { productList });
		} catch (err) {
			console.error("ERROR: ", err);
			res.status(500).send("Có lỗi xảy ra khi tìm kiếm sản phẩm.");
		}
	}

	async addProduct(req, res, next) {
		try {
			const { name, price, description, image } = req.body;
			if (!name || !price || !description || !image) {
				return res.status(400).send("Vui lòng cung cấp đủ thông tin sản phẩm.");
			}
			const newProduct = await Product.create({
				name,
				price,
				description,
				image,
				bestselling_Product: 0,
				view: 1
			});
			res.redirect("/admin/addProduct");
		} catch (error) {
			console.error("ERROR: ", error);
			res.status(500).send("Có lỗi xảy ra khi thêm sản phẩm.");
		}
	}

	async editProduct(req, res, next) {
		console.dir(req.query.deleteId);
		try {
			const productList = await Product.find({});
			const valueInput = await Product.findById(req.params.id);
			res.render("admin/updateProduct", { productList, valueInput });
		} catch (error) {
			console.error("ERROR: ", error);
			res.status(404).send("Không tìm thấy sản phẩm.");
		}
	}

	//PUT/admin/:id
	async updateProduct(req, res, next) {
		const dataUpdate = {
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			image: req.file.originalname
		};
		try {
			await Product.findOneAndUpdate({ _id: req.params.id }, dataUpdate, {
				new: true
			});
			res.redirect("/admin/addProduct");
		} catch (error) {
			console.error("ERROR: ", error);
			res.status(404).send("Failed to update");
		}
	}
}

module.exports = new AdminController();
