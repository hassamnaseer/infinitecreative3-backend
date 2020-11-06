const mongoose = require("mongoose");
const uuidv1 = require("uuidv1");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
	FirstName: {
		type: String,
		trim: true,
		required: true,
	},
	LastName: {
		type: String,
		trim: true,
		required: true,
	},
	Email: {
		type: String,
		trim: true,
		required: true,
	},
	hashed_password: {
		type: String,
		required: true,
	},
	Address: {
		type: String,
		trim: true,
		required: true,
	},
	ReferralLink: {
		type: String,
		trim: true,
		required: true,
	},
	PV: {
		type: Number,
		trim: true,
		required: true,
	},
	Redeemed: {
		type: Number,
		trim: true,
		required: true,
	},
	Unilevel: {
		type: Number,
		trim: true,
		required: true,
	},
	UsersIntroduced: {
		type: Array,
		trim: true,
		required: true,
	},
	referredBy: {
		type: String
	},

	salt: String,
	created: {
		type: Date,
		default: Date.now,
	},
	updated: Date,
});

// virtual field
userSchema
	.virtual("Password")
	.set(function (password) {
		// create temp var called _password
		this._password = password;
		// generate a timestamp
		this.salt = uuidv1();
		// encrypt the password
		this.hashed_password = this.encryptPassword(password);
	})
	.get(function () {
		return this._password;
	});

// virtual methods
userSchema.methods = {
	authenticate: function (plainText) {
		return this.encryptPassword(plainText) === this.hashed_password;
	},

	// setReferredBy: function (referredBy) {
	// 	this.referredBy = referredBy;
	// },

	encryptPassword: function (password) {
		if (!password) return "";
		try {
			return crypto
				.createHmac("sha1", this.salt)
				.update(password)
				.digest("hex");
		} catch (error) {
			return "";
		}
	},
};

module.exports = mongoose.model("User", userSchema);
