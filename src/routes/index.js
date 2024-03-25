const Product = require("./Product");
const auth = require("./auth");
const admin = require("./admin");
const api = require("./api/api");
const profile = require("./profile");
const route = (app) => {
	app.use("/auth", auth);
	app.use("/admin", admin);
	app.use("/api", api);
	app.use("/profile", profile);
	app.use("/", Product);
};
module.exports = route;
