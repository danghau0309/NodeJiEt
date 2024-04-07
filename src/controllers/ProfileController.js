const passport = require("passport");
const User = require("../models/user");
const Order = require("../models/orders");
const Voucher = require("../models/voucher");
const bcrypt = require("bcrypt");
class ProfileController {
	async profile(req, res, next) {
		const userProfile = await User.findOne({ username: req.session.username });
		res.render("profile/profile", { userProfile });
	}
	async changePassword(req, res, next) {
		res.render("profile/changePassword");
	}
	async myVoucher(req, res, next) {
		try {
			const username = req.session.username;
			const user = await User.findOne({ username: username });
			if (!user) {
				res.status(403).send({ message: "user not found" });
			} else {
				const { voucherList, point } = user;
				res.render("profile/myVoucher", { voucherList, point });
			}
		} catch (error) {
			console.error(error);
			res.status(403).send({ message: error.message });
		}
	}
	async exchange(req, res, next) {
		try {
			const voucherList = await Voucher.find({});
			const username = req.session.username;
			const user = await User.findOne({ username });
			if (!user) {
				res.status(404).send("User not found");
			} else {
				const point = user.point;
				res.render("profile/exchange", { voucherList, point });
			}
		} catch (error) {
			console.error(error);
			res.status(500).send(error.message);
		}
	}
	async exchangePoint(req, res, next) {
		try {
			const username = req.session.username;
			const { id } = req.params;
			const user = await User.findOne({ username });
			const findExchangeValue = await Voucher.findById(id);
			if (!user) {
				res.status(404).send("User not found");
			} else {
				const { exchange_value } = findExchangeValue;
				const { point, voucherList } = user;
				const isVoucherAlreadyExchanged = voucherList.some((voucher) =>
					voucher._id.equals(findExchangeValue._id)
				);
				if (isVoucherAlreadyExchanged) {
					res.status(400).send("Bạn đã đổi voucher này rồi !");
					return;
				}
				if (point >= exchange_value) {
					const updatedPoint = point - exchange_value;
					voucherList.push(findExchangeValue);
					await User.findOneAndUpdate(
						{ username },
						{ point: updatedPoint, voucherList },
						{ new: true }
					);
					res.status(200).send("Đổi thành công");
				} else {
					res.status(404).send("Bạn không đủ điểm để đổi !");
				}
			}
		} catch (error) {
			res.status(500).send(error.message);
		}
	}
	async handleChangePassword(req, res, next) {
		try {
			const { oldPassword, newPassword, enterPassword } = req.body;
			const saltRounds = 10;
			const username = req.session.username;
			const findUser = await User.findOne({ username: username });
			const passwordMatch = await bcrypt.compare(oldPassword, findUser.password);
			const hashNewPassword = await bcrypt.hash(newPassword, saltRounds);
			if (passwordMatch && newPassword === enterPassword) {
				await User.findOneAndUpdate(
					{ username: req.session.username },
					{ password: hashNewPassword },
					{
						new: true
					}
				);
				return res.status(200).redirect("/profile");
			} else if (!passwordMatch) {
				res.status(403).json({ message: "Mật khẩu cũ nhập không đúng !" });
			} else if (newPassword !== enterPassword) {
				res.status(403).json({ message: "Mật khẩu nhập không trùng nhau !" });
			} else if (!oldPassword || !newPassword || !enterPassword) {
				res.status(403).json({ message: "Vui lòng nhập thông tin đầy đủ" });
			} else {
				res.status(403).json({ message: "error ..." });
			}
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}

	async updateProfile(req, res, next) {
		try {
			const { id } = req.params;
			const { fullname, email, address, username } = req.body;
			const updateProfileById = await User.findByIdAndUpdate(
				id,
				{ fullname, username, email, address },
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
			res.render("profile/my_order", { orderList, statusList });
		} catch (error) {
			next(error);
		}
	}
}
module.exports = new ProfileController();
