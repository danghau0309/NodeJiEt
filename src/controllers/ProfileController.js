const User = require("../models/user");
class ProfileController {
	async profile(req, res, next) {
		const userProfile = await User.findOne({ username: req.session.username });
		res.render("profile", { userProfile });
	}
}

module.exports = new ProfileController();
