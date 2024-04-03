const Cart = require("../models/cart");
const Product = require("../models/product");
const Voucher = require("../models/voucher");
const moment = require("moment");
const Order = require("../models/orders");
const User = require("../models/user");
const QRCode = require("qrcode");
const { uuid } = require("uuidv4");

class CartController {
	async cart(req, res, next) {
		try {
			const cartList = await Cart.find({});
			const cartItems = await Cart.find();
			const subTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
			const shipping = 35;
			const total = subTotal + shipping;
			const voucher = req.session.voucherCode;
			res.render("cart/cart", { cartList, subTotal, shipping, total, voucher });
		} catch (err) {
			res.status(404).json({ message: err });
		}
	}
	async increase(req, res, next) {
		const { id } = req.params;
		const increaseQuantity = await Cart.findById(id);
		increaseQuantity.quantity += 1;
		increaseQuantity.total = increaseQuantity.quantity * increaseQuantity.price;
		await increaseQuantity.save();
		res.redirect("/cart");
	}
	async decrease(req, res, next) {
		const { id } = req.params;
		const decreaseQuantity = await Cart.findById(id);
		if (decreaseQuantity.quantity === 1) {
			await Cart.findByIdAndDelete(id);
			res.redirect("/cart");
		} else {
			decreaseQuantity.quantity -= 1;
			decreaseQuantity.total = decreaseQuantity.quantity * decreaseQuantity.price;
			await decreaseQuantity.save();
			res.redirect("/cart");
		}
	}
	async addToCart(req, res, next) {
		try {
			const { id } = req.params;
			const findProduct = await Product.findById(id);
			const exitstingCartItem = await Cart.findOne({ name: findProduct.name });
			if (exitstingCartItem) {
				exitstingCartItem.quantity += 1;
				exitstingCartItem.total = exitstingCartItem.quantity * exitstingCartItem.price;
				await exitstingCartItem.save();
			} else {
				const cartItem = {
					name: findProduct.name,
					quantity: 1,
					price: findProduct.price,
					image: findProduct.image,
					total: findProduct.price
				};
				await Cart(cartItem).save();
			}
			res.redirect("/cart");
		} catch (err) {
			res.status(404).json({ message: err });
		}
	}
	async deleteCart(req, res, next) {
		const { id } = req.params;
		await Cart.findByIdAndDelete(id);
		res.redirect("/cart");
	}
	async voucherCode(req, res, next) {
		try {
			const { voucher_code } = req.body;
			const findVoucher = await Voucher.findOne({ voucher_code: voucher_code });
			if (!findVoucher) {
				return res.status(404).json({ message: "Voucher code not found !!" });
			}
			if (findVoucher.voucher_code === "SALE50%") {
				const cartItems = await Cart.find();
				const subTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
				const shipping = 35;
				const applied_code = subTotal / 2 + shipping;
				req.session.voucherCode = true;
				req.session.voucherCode = JSON.stringify(applied_code);
				res.redirect("/cart");
			} else if (findVoucher.voucher_code === "FREESHIP") {
				const cartItems = await Cart.find();

				const subTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
				const shipping = 0;
				const applied_code = subTotal / 2 + shipping;
				res.render("cart", { applied_code });
			} else {
				res.json("Ưu đãi khác !");
			}
		} catch (err) {
			res.status(404).json({ message: err.message });
		}
	}

	async form_user(req, res, next) {
		const cartItems = await Cart.find({});
		const subTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
		const shipping = 35;
		const sum = subTotal + shipping;
		res.render("cart/payment_infor", { cartItems, subTotal, sum });
	}
	async infor_older(req, res, next) {
		try {
			const { fullname, phonenumber, city, district, email } = req.body;

			const cartItems = await Cart.find({});
			const subTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
			const sum = subTotal + 35;
			req.session.customerOlder = {
				fullname,
				phonenumber,
				city,
				district,
				email
			};
			res.render("cart/infor_older.hbs", {
				customerOlder: req.session.customerOlder,
				sum
			});
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	}
	async infor_older_voucher(req, res) {
		const { voucher_code } = req.body;
		const cartItems = await Cart.find({});
		const subTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
		const findVoucher = await Voucher.findOne({ voucher_code: voucher_code });
		if (!findVoucher) {
			return res.status(404).json({ message: "Voucher code not found !!" });
		}
		if (findVoucher.voucher_code === "SALE50%") {
			const customerOlder = req.session.customerOlder;
			const cartItems = await Cart.find();
			const subTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
			const shipping = 35;
			const sum = subTotal / 2 + shipping;
			res.render("cart/infor_older", { customerOlder, sum });
		} else {
			res.send("Ưu đãi khác ");
		}
	}
	async payment(req, res, next) {
		const { fullname, phonenumber, email, city, district, total, paymentMethod } = req.body;
		try {
			const orderDate = new Date(Date.now());
			const formattedTime = moment(orderDate).format("D/M/YYYY HH:mm");
			const customerOrder = await Cart.find({});
			const username = req.session.username;
			const order_id = uuid();
			const user = await User.findOne({ username });
			if (user) {
				user.point += 10;
				await user.save();
			}
			const newOrder = {
				fullname,
				phonenumber,
				email,
				city,
				district,
				total,
				paymentMethod,
				customerOrder,
				orderDate: formattedTime,
				user_id: username || "Khách vãng lai",
				order_status: "Pending",
				order_id
			};
			let link_icon = "";
			if (paymentMethod === "zalopay") {
				link_icon = "https://cdn2.cellphones.com.vn/x/media/logo/gw2/zalopay.png";
			} else if (paymentMethod === "momo") {
				link_icon = "https://cdn2.cellphones.com.vn/x/media/logo/gw2/momo_vi.png";
			} else if (paymentMethod === "shopeepay") {
				console.log("shoppepay");
				link_icon = "https://cdn2.cellphones.com.vn/x/media/logo/gw2/shopeepay.png";
			} else {
				link_icon = "https://cdn2.cellphones.com.vn/x/media/logo/gw2/vnpay.png";
			}
			const url = req.query.url || "http://localhost:3000/cart/payment";
			const qrCode = await QRCode.toDataURL(url);
			await Order.create(newOrder);
			await Cart.deleteMany();
			res.render("cart/order_success", {
				qrCode,
				fullname,
				phonenumber,
				city,
				district,
				total,
				paymentMethod,
				orderDate: formattedTime,
				order_id,
				link_icon
			});
		} catch (error) {
			next(error);
		}
	}
}
module.exports = new CartController();
