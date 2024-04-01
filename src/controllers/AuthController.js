const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
const Swal = require("sweetalert2");
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
