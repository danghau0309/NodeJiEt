const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
const nodemailer = require("nodemailer");
require("dotenv").config();
const otpGenerator = require("otp-generator");
class AuthController {
	renderLogin(req, res) {
		res.render("auth/login");
	}
	async login(req, res) {
		const { username, password } = req.body;
		if (!username || !password) {
			res.status(403).send({ message: "Lỗi rồi dm !" });
		}
		try {
			const user = await User.findOne({ username, password });
			if (user) {
				req.session.isLoggedIn = true;
				req.session.username = user.username;
				res.status(200).redirect("/");
			} else {
				res.status(401).send("Invalid username or password");
			}
		} catch (err) {
			res.status(400).send("Error ...");
		}
	}
	restore_password(req, res) {
		res.render("auth/forget_password");
	}
	async forgotPassword(req, res) {
		const { email } = req.body;
		try {
			const otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
				specialChars: false
			});
			const transporter = nodemailer.createTransport({
				service: "Gmail",
				auth: {
					user: process.env.EMAIL_ADDRESS,
					pass: process.env.APP_PASSWORD
				}
			});
			const mailOptions = {
				from: process.env.EMAIL_ADDRESS,
				to: `${email}`,
				subject: "Sending Email using Node.js",
				html: `<div class="container-otp" style="display: grid;text-align: center;border: 1px solid red;border-radius: 1rem;">
				<h2>YOUR OTP : </h2>
				<p>YOUR OTP IS : <span class="otp" style="color:red; font-size:1.3rem;">${otp}</span></p>
			</div>`
			};
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					res.status(500).json({ message: error.message });
				} else {
					console.log("Email sent: " + info.response);
					res.render("auth/otp", { otp, email });
				}
			});
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}
	async cofirmOtp(req, res, next) {
		const { customersOtp, otp, email } = req.body;
		try {
			if (customersOtp === otp) {
				res.render("auth/changePassword", { email });
			} else {
				res.status(403).json({ message: "OTP failed ! " });
			}
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	}
	async changePassword(req, res, next) {
		const { newPassword, enterPassword, email } = req.body;
		try {
			if (newPassword === enterPassword) {
				const changeUserPassword = await User.findOneAndUpdate(
					{ email },
					{ password: newPassword },
					{ new: true }
				);
				res.status(200).send("Updated successfully");
			} else {
				res.status(403).json("Passwords are not the same");
			}
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}
	// GET auth/signup
	signup(req, res) {
		res.render("auth/signup");
	}
	//POST auth/signup/register
	async register(req, res, next) {
		try {
			const { fullname, username, password, email, address, userImage } = req.body;
			if (!username || !password || !email || !fullname || !address) {
				return res.status(400).send({ message: "errr ........" });
			}
			if (password.length < 8) {
				return res.status(400).json({ message: "Password is Maximum 8 charecters " });
			}
			if (!/^\S+@\S+\.\S+$/.test(email)) {
				return res.status(400).json({ message: "Invalid email format" });
			}
			const newUser = new User({
				fullname,
				username,
				password,
				email,
				address,
				userImage: req.file.originalname
			});
			await newUser.save();
			res.redirect("/auth/login");
		} catch (error) {
			console.error("Error:", error);
			return res.status(500).json({ message: "Internal server error" });
		}
	}
	logout(req, res, next) {
		req.session.destroy((err) => {
			res.redirect("/");
		});
	}
	googleCallback(req, res, next) {
		try {
			passport.authenticate("google", {
				successRedirect: "/auth/google/success",
				failureRedirect: "/auth/google/failure"
			})(req, res, next);
		} catch (err) {
			console.log(err);
		}
	}
	success(req, res, next) {
		req.session.isLoggedInGoogle = true;
		res.redirect("/");
	}
}
module.exports = new AuthController();
