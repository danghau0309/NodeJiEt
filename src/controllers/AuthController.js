const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
const nodemailer = require("nodemailer");
require("dotenv").config();
const otpGenerator = require("otp-generator");
const otplib = require("otplib");
const { application } = require("express");
class AuthController {
	renderLogin(req, res) {
		res.render("auth/login");
	}
	async login(req, res) {
		const { username, password } = req.body;
		try {
			if (!username || !password) {
				return res.status(400).redirect("/auth/login?loginInfor=true");
			}
			const user = await User.findOne({ username });
			if (!user) {
				return res.status(401).redirect("/auth/login?loginError=true");
			}
			const isCheckPassword = await bcrypt.compare(password, user.password);
			if (isCheckPassword && user.user_status === "Đang hoạt động") {
				req.session.isLoggedIn = true;
				req.session.username = user.username;
				return res.status(200).redirect("/?loginSuccess=true");
			} else if (user.user_status === "Tài khoản bị khóa") {
				return res.status(403).redirect("/auth/login?loginBlock=true");
			} else {
				return res.status(401).redirect("/auth/login?loginInfor=true");
			}
		} catch (err) {
			return res.status(400).redirect("/auth/login?loginError=true");
		}
	}

	signup(req, res) {
		res.render("auth/signup");
	}
	async register(req, res, next) {
		try {
			const { fullname, username, password, email, address } = req.body;
			if (!username || !password || !email || !fullname || !address) {
				return res.status(400).redirect("/auth/signup?signupError=true");
			}
			if (password.length < 8) {
				return res.status(400).redirect("/auth/signup?signupWarn=true");
			}
			if (!/^\S+@\S+\.\S+$/.test(email)) {
				return res.status(400).json({ message: "Invalid email format" });
			}
			const saltRounds = 10;
			const salt = await bcrypt.genSalt(saltRounds);
			const hashPassword = await bcrypt.hash(password, salt);
			const newUser = new User({
				fullname,
				username,
				password: hashPassword,
				email,
				address,
				userImage: req.file.originalname,
				user_status: "Đang hoạt động"
			});
			await newUser.save();
			res.redirect("/auth/login?success=true");
		} catch (error) {
			console.error("Error:", error);
			return res.status(500).redirect("/auth/signup?dataExist=true");
		}
	}
	logout(req, res, next) {
		req.session.destroy((err) => {
			res.redirect("/?success=true");
		});
	}

	restore_password(req, res) {
		res.render("auth/forget_password");
	}
	async forgotPassword(req, res) {
		const { email } = req.body;
		try {
			if (!email) return res.status(400).redirect("/auth/login?warn=true");
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
				res.status(403).redirect("/auth/login?error=true");
			}
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	}
	async changePassword(req, res, next) {
		const { newPassword, enterPassword, email } = req.body;
		try {
			if (newPassword === enterPassword) {
				const hashPassword = await bcrypt.hash(newPassword, 10);
				await User.findOneAndUpdate({ email }, { password: hashPassword }, { new: true });
				res.status(200).redirect("/auth/login?success=true");
			} else {
				res.status(403).redirect("/auth/login?error=true");
			}
		} catch (error) {
			res.status(500).redirect("/auth/login?error=true");
		}
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
