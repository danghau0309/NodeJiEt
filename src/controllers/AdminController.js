const Product = require("../models/product");
const Order = require("../models/orders");
const User = require("../models/user");
class AdminController {
	async admin(req, res, next) {
		try {
			const user = await User.findOne({ username: req.session.username });
			if (!user) {
				res.status(404).send("Please Login before entering Admin");
			} else if (Number(user.role) !== 1) {
				res.status(404).send("Your account is not allowed to Admin");
			} else {
				res.render("admin/home");
			}
		} catch (error) {
			console.error(error);
			res.status(404).send(error.message);
		}
	}
	async user_manager(req, res, next) {
		try {
			const userList = await User.find({});
			res.render("admin/users_manager", { userList });
		} catch (error) {
			console.error(error);
			res.status(404).send(error.message);
		}
	}
	async user_managerLock(req, res, next) {
		try {
			const { id } = req.params;
			const user = await User.findById(id);
			if (user.user_status === "Đang hoạt động" && user.role === "Người dùng") {
				user.user_status = "Tài khoản bị khóa";
				await user.save();
				res.status(200).redirect("/admin/user_manager?success=true");
			} else if (user.user_status === "Tài khoản bị khóa") {
				res.status(200).redirect("/admin/user_manager?warning=true");
			} else {
				res.status(200).redirect("/admin/user_manager?error=true");
			}
		} catch (error) {
			console.error(error);
			res.status(404).send(error.message);
		}
	}
	async statistical(req, res, next) {
		try {
			res.render("statistical/statistical");
		} catch (error) {
			console.log(error);
			res.status(404).send(error.message);
		}
	}
	async user_managerOpen(req, res, next) {
		try {
			const { id } = req.params;
			const user = await User.findById(id);
			if (user.user_status === "Tài khoản bị khóa") {
				user.user_status = "Đang hoạt động";
				user.save();
				res.redirect("/admin/user_manager");
			}
		} catch (error) {
			console.error(error);
			res.status(404).send(error.message);
		}
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

	async showCRUD(req, res, next) {
		try {
			const productList = await Product.find({});
			res.render("admin/addProduct", { productList });
		} catch (err) {
			console.error("ERROR: ", err);
			res.status(500).send("Có lỗi xảy ra khi tìm kiếm sản phẩm.");
		}
	}

	async CRUD(req, res, next) {
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
			res.redirect("/admin/CRUD");
		} catch (error) {
			console.error("ERROR: ", error);
			res.status(500).send("Có lỗi xảy ra khi thêm sản phẩm.");
		}
	}

	async editProduct(req, res, next) {
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
			res.redirect("/admin/CRUD");
		} catch (error) {
			console.error("ERROR: ", error);
			res.status(404).send("Failed to update");
		}
	}
	async deleteProduct(req, res, next) {
		const { id } = req.params;
		await Product.findByIdAndDelete(id);
		res.status(200).redirect("/admin/CRUD");
	}
}

module.exports = new AdminController();
