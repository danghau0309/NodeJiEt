const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const users = new Schema(
	{
		id: ObjectId,
		username: { type: "string", unique: true },
		password: String,
		email: { type: "string", unique: true },
		role: { type: String, default: "Người dùng" },
		userImage: { type: "string" },
		fullname: { type: "string" },
		phonenumber: { type: "string" },
		sex: { type: "string" },
		address: { type: "string" },
		point: Number,
		voucherList: Array
	},
	{
		timestamps: true
	}
);
module.exports = mongoose.model("users", users);
