const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();
const port = 3000;
const db = require("./config/db/connect");
const { engine } = require("express-handlebars");
const Handlebars = require("handlebars");
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access");
const methodOverride = require("method-override");
const route = require("./routes");
const session = require("express-session");
require("dotenv").config();

// setup Login with google
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true
	})
);
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIEANT_SECRET,
			callbackURL: process.env.URL
		},
		(accessToken, refreshToken, profile, done) => {
			return done(null, profile);
		}
	)
);
passport.serializeUser((user, done) => {
	done(null, user.id);
});
passport.deserializeUser((id, done) => {
	done(null, id);
});
app.use(passport.initialize());
app.use(passport.session());
// login session
app.use((req, res, next) => {
	if (req.session.isLoggedIn) {
		res.locals.isLoggedIn = req.session.isLoggedIn;
	} else {
		req.session.isLoggedIn = false;
		res.locals.isLoggedIn = false;
	}
	if (req.session.isLoggedInGoogle) {
		res.locals.isLoggedInGoogle = req.session.isLoggedInGoogle;
	} else {
		req.session.isLoggedInGoogle = false;
		res.locals.isLoggedInGoogle = false;
	}
	next();
});
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Connect to db
db.connect();
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.engine(
	".hbs",
	engine({ extname: ".hbs", handlebars: allowInsecurePrototypeAccess(Handlebars) })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views"));
Handlebars.registerHelper("ifCond", function (v1, v2, options) {
	if (v1 || v2) {
		return options.fn(this);
	}
	return options.inverse(this);
});
route(app);
app.listen(port, () => {
	console.log(`Example app listening on port http://localhost:${port}`);
});
