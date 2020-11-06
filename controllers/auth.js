const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require('express-jwt');
require("dotenv").config();
const _ = require("lodash");

exports.signup = async (req, res) => {
	let referredByUser = await User.findOne({ ReferralLink: req.body.referredBy });
	const arr = referredByUser.UsersIntroduced
	const userExists = await User.findOne({ Email: req.body.Email });
	if (userExists)
		return res.status(403).json({
			error: "Email is taken!",
		});

	const user = await new User(req.body);
	arr.push(user._id);
	referredByUser = _.extend(referredByUser, {UsersIntroduced: arr});
	const arrLength = arr.length
	
	await referredByUser.save();
	const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

	res.cookie("t", token, { expire: new Date() + 9999 });
	await user.save();

	const { _id, FirstName, LastName, Email } = user;
	return res.status(200).json({
		token,
		user: { _id, FirstName, LastName, Email },
	});
};

exports.login = (req, res) => {
	// find the user based on email
	const { Email, Password } = req.body;
	User.findOne({ Email }, (err, user) => {
		if (err || !user) {
			return res.status(401).json({
				error: "User with this email does not exist. Please sign up before.",
			});
		}
		if (!user.authenticate(Password)) {
			return res.status(401).json({
				error: "Email and Password do not match!",
			});
		}
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

		res.cookie("t", token, { expire: new Date() + 9999 });

		const { _id, FirstName, LastName, Email } = user;
		return res.json({
			token,
			user: { _id, FirstName, LastName, Email },
		});
	});
};

exports.logout = (req, res) => {
	res.clearCookie("t")
	return res.json({
		message: "Logout Success!"
	})
}

exports.requireLogin = expressJwt({
	secret: process.env.JWT_SECRET,
	userProperty: "auth",
	algorithms: ["HS256"],
  userProperty: "auth",
})