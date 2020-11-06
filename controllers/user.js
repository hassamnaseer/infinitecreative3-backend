const User = require("../models/user");
const _ = require("lodash");

exports.userById = (req, res, next, id) => {
	User.findById(id).exec((error, user) => {
		if (error || !user) {
			return res.status(400).json({
				error: "User not found!",
			});
		}
		req.profile = user; // adds profile object in req with user information
		next();
	});
};

exports.userByReferral = (req, res, next, id) => {
	//User.findOne({ ReferralLink: id });
	User.findOne({ ReferralLink: id }).exec((error, user) => {
		if (error || !user) {
			return res.status(400).json({
				error: "User not found!",
			});
		}
		req.profile = user; // adds profile object in req with user information
		next();
	});
};

exports.userByEmail = (req, res, next, email) => {
	//User.findOne({ ReferralLink: id });
	User.findOne({ Email: email }).exec((error, user) => {
		if (error || !user) {
			return res.status(400).json({
				error: "User not found!",
			});
		}
		req.profile = user; // adds profile object in req with user information
		next();
	});
};

exports.hasAuthorization = (req, res, next) => {
	const authorized =
		req.profile && req.auth && req.profile._id === req.auth._id;

	if (!authorized) {
		return res.status(403).json({
			error: "User is not Authorized to perform this task",
		});
	}
};

exports.allUsers = (req, res) => {
	User.find((error, users) => {
		if (error) {
			return res.status(400).json({
				error,
			});
		}
		res.json({
			users,
		});
	}).select(
		"FirstName LastName Email Address ReferralLink PV Redeemed Unilevel UsersIntroduced updated created",
	);
};

exports.getUser = (req, res) => {
	req.profile.hashed_password = undefined;
	req.profile.salt = undefined;
	return res.json(req.profile);
};

exports.updateUser = (req, res, next) => {
	let user = req.profile;
	user = _.extend(user, req.body);
	user.updated = Date.now();
	user.save((error) => {
		if (error) {
			return res.status(400).json({
				error
			});
		}
		user.hashed_password = undefined;
		user.salt = undefined;
		res.json({
			user,
		});
	});
};

exports.deleteUser = (req, res, next) => {
  let user = req.profile;
  user.remove((error) => {
    if(error) {
      return res.status(400).json({
        error
      })
    }
    res.json({
      message: "User Deleted!"
    })
  })
}