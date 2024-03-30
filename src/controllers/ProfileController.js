const passport = require("passport");
const User = require("../models/user");
const Order = require("../models/orders");
class ProfileController {
	async profile(req, res, next) {
		const userProfile = await User.findOne({ username: req.session.username });
		res.render("profile", { userProfile });
	}
	async updateProfile(req, res, next) {
		try {
			const { id } = req.params;
			const { fullname, email, password, address, username } = req.body;
			const updateProfileById = await User.findByIdAndUpdate(
				id,
				{ fullname, username, password, email, address },
				{ new: true }
			);
			res.redirect(`/profile`);
		} catch (err) {
			res.status(404).json({ message: err.message });
		}
	}
	async my_order(req, res, next) {
		try {
			const customer_orders = await Order.find({ user_id: req.session.username });
			const orderList = [];
			const statusList = [];
			customer_orders.forEach((order) => {
				const ordersForOneCustomer = [];
				order.customerOrder.forEach((item) => {
					ordersForOneCustomer.push(item);
				});
				orderList.push(ordersForOneCustomer);
				statusList.push(order.order_status);
			});
			res.render("my_order", { orderList, statusList });
		} catch (error) {
			next(error);
		}
	}
}
module.exports = new ProfileController();
