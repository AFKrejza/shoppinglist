import mongoose from "mongoose";
import shoppingListSchemas from "./shoppingListSchemas.js";
import userSchemas from "./userSchemas.js";

// const shoppingListSchema = new mongoose.Schema({
// 	ownerId: Number,
// 	name: String,
// 	memberList: Array,
// 	itemList: Array,
// 	isArchived: Boolean,
// });

// const userSchema = new mongoose.Schema({
// 	name: String,
// 	email: String,
// });

// const itemSchema = new mongoose.Schema({
// 	name: String,
// 	quantity: Number,
// 	unit: String,
// 	ticked: Boolean,
// });

const itemSchemas = {};
itemSchemas.createIn = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	quantity: {
		type: String,
		required: true
	},
	unit: {
		type: String,
		required: true
	},
	ticked: {
		type: Boolean,
		required: true
	},
});

const newShoppingList = mongoose.model('ShoppingList', shoppingListSchemas.createIn);
const newUser = mongoose.model('User', userSchemas.createIn);
const newItem = mongoose.model('Item', itemSchemas.createIn);

export {
	newShoppingList,
	newUser,
	newItem,
}