const Categories = require("../models/categories");
const Product = require("../models/product");
const User = require("../models/user");

class LabController {
	lab(req, res) {
		res.send("ok");
	}
	// CRUD user
	async showUser(req, res, next) {
		const user = await User.find();
		res.json(user);
	}
	async addUser(req, res, next) {
		const newUser = {
			fullname: "Đặng Văn Hậu",
			age: 18,
			username: "Hackersdfdsf số 1 VN",
			password: "hacker@gmail.com",
			address: "Ở ngoài hành tinh",
			email: "hacker@gmail.com"
		};
		await User.create(newUser);
		res.status(200).send("Add user successfully");
	}
	async deleteUser(req, res, next) {
		const { id } = req.params;
		await User.findOneAndDelete({ _id: id });
		res.status(200).send("Delete user deleted");
	}
	async updateUser(req, res, next) {
		try {
			const { id } = req.params;
			const updateUser = await User.findByIdAndUpdate(
				id,
				{
					username: "ahihi",
					password: "ahihi",
					address: "ahihi"
				},
				{ new: true }
			);
			res.status(200).send("User updated successfully");
		} catch (error) {
			res.status(500).send(error);
		}
	}
	// CRUD category
	async cate(req, res) {
		const { id } = req.params;
		try {
			const productList = await Product.find({ category_id: id });
			res.status(200).json(productList);
		} catch (error) {
			res.status(404).json({ error: error.message });
		}
	}
	async getOutstandingProducts(req, res) {
		const outstandingProductList = await Product.find({ number_of_orders: { $gte: 2 } });
		res.json(outstandingProductList);
	}
	async pagination(req, res) {
		const page = parseInt(req.query) || 1;
		const limit = parseInt(req.query) || 5;
		console.log(page, limit);
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		const products = await Product.find();
		const results = {};
		if (endIndex < products.length) {
			results.next = {
				page: page + 1,
				limit: limit
			};
		}
		if (startIndex > 0) {
			results.previous = {
				page: page - 1,
				limit: limit
			};
		}
		results.results = products.slice(startIndex, endIndex);
		res.json(results);
	}
	async searchProduct(req, res) {
		const { name } = req.query;
		const searchProduct = await Product.findOne({ name: name });
		res.json(searchProduct);
	}
	// CRUD categories
	async showCategory(req, res) {
		const category = await Categories.find();
		res.json(category);
	}
	async addCategory(req, res) {
		const newCategory = {
			category_id: 5,
			category_name: "Category test"
		};
		await Categories(newCategory).save();
		res.send("Added category");
	}
	async deleteCategory(req, res) {
		const { id } = req.params;
		const findAndDeleteItem = await Categories.findByIdAndDelete(id);
		res.send("Delete category");
	}
	async updateCategory(req, res) {
		const { id } = req.params;
		const updateCategory = {
			category_name: "Ahihiihihihihihihi"
		};
		await Categories.findByIdAndUpdate(id, updateCategory, { new: true });
		res.send("Updated category");
	}
	//
	async getProductListIncreasePrice(req, res) {
		const { limit } = req.query;
		const productListWithIncreasePrice = await Product.find().limit(limit);
		productListWithIncreasePrice.sort((a, b) => a.price - b.price);
		res.json(productListWithIncreasePrice);
	}
	async getRelatedProducts(req, res) {
		const { product_id } = req.params;
		try {
			const product = await Product.findOne({ _id: product_id });
			if (!product) {
				return res.status(404).send("Product not found");
			}
			const category_id = product.category_id;
			const findAllProductWithCategoryId = await Product.find({ category_id: category_id });
			return res.json(findAllProductWithCategoryId);
		} catch (error) {
			console.error(error);
			return res.status(500).send("Internal server error");
		}
	}
	async findAndDeleteItem(req, res) {
		const { id } = req.params;
		await Categories.findByIdAndDelete(id);
		// await Product.findByIdAndDelete(id);
		res.status(200).send("Deleted");
	}
	async productsManyViews(req, res) {
		const { value } = req.query;
		const productListWithManyViews = await Product.find({ view: { $gte: value } });
		res.json(productListWithManyViews);
	}
}
module.exports = new LabController();
