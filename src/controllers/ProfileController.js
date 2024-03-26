const passport = require("passport");
const User = require("../models/user");
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
}
module.exports = new ProfileController();
