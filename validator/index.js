exports.userSignupValidator = (req, res, next) => {
	// name
	req.check("FirstName", "First Name must not be empty").notEmpty();
	req.check("LastName", "Last Name must not be empty").notEmpty();

	// email
	req.check("Email", "Email must not be empty").notEmpty();
	req
		.check("Email", "Email must be between 4 to 150 characters")
		.matches(/.+\@.+\..+/)
		.withMessage("Email must contain @")
		.isLength({
			min: 3,
			max: 32,
		});

	// password
	req.check("Password", "Password must not be empty").notEmpty();
	req
		.check("Password")
		.isLength({ min: 6 })
		.withMessage("Password must contain at least 6 characters")
		.matches(/\d/)
		.withMessage("Password must contain a number");

	// ReferralLink
	req.check("ReferralLink", "ReferralLink must not be empty").notEmpty();
	req
		.check("ReferralLink")
		.isLength({ min: 16 })
		.withMessage("ReferralLink must contain at least 16 characters");

	// check for errors
	const errors = req.validationErrors();
	if (errors) {
		const firstError = errors.map((error) => error.msg)[0];
		return res.status(400).json({
			error: firstError,
		});
	}

	//proceed to next middleware
	next();
};

