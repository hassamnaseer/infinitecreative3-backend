const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
	orders: {
		type: Array,
		trim: true,
		required: true,
	},
	created: {
		type: Date,
		default: Date.now,
	},
	updated: Date,
});


module.exports = mongoose.model("Orders", ordersSchema);
