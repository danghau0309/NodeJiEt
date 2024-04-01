const Product = require("../models/product");
const Order = require("../models/orders");
class AdminController {
	admin(req, res, next) {
		res.render("admin/home");
	}
	async showOrderManager(req, res, next) {
		const orderList = await Order.find({});

		res.render("admin/order_manager", { orderList });
	}
	async orderDetails(req, res, next) {
		const { id } = req.params;
		const orderDetail = await Order.findById(id);
		const custommerOfOrder = orderDetail.customerOrder;
		res.render("admin/orderDetail", { custommerOfOrder });
		// res.status(200).json(custommerOfOrder);
	}
	async order_confirmation(req, res, next) {
		const { id } = req.params;
		try {
			const order = await Order.findById(id);
			if (order.order_status === "Đã xác nhận") {
				await Order.findByIdAndUpdate(id, { order_status: "Pending" }, { new: true });
				res.status(200).redirect("/admin/order_manager");
			} else if (order.order_status === "Pending") {
				await Order.findByIdAndUpdate(id, { order_status: "Đã xác nhận" }, { new: true });
				res.status(200).redirect("/admin/order_manager");
			}
		} catch (error) {
			res.status(404).json({ error: error.message });
		}
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
			console.log(req.file);
			const { name, price, description, image } = req.body;
			if (!name || !price || !description) {
				return res.status(400).send("Vui lòng cung cấp đủ thông tin sản phẩm.");
			}
			const newProduct = await Product.create({
				name,
				price,
				description,
				image: req.file.originalname,
				bestselling_Product: 0,
				view: 1,
				category_id: 2
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
