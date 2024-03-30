const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const { uuid } = require("uuidv4");
const order = new Schema({
	id: ObjectId,
	fullname: String,
	email: String,
	district: String,
	total: Number,
	paymentMethod: String,
	orderDate: String,
	customerOrder: Array,
	user_id: String,
	order_id: { type: String, default: uuid },
	order_status: String
});
module.exports = mongoose.model("orders", order);
