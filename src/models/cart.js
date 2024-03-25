const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const cartSchema = new Schema(
	{
		id: ObjectId,
		name: String,
		quantity: Number,
		price: Number,
		image: String,
		discount: String,
		total: Number,
		bestselling_Product: Number
	},
	{
		timestamps: true
	}
);
module.exports = mongoose.model("cart", cartSchema);
