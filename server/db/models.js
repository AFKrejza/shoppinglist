import mongoose from "mongoose";

const shoppingListSchema = new mongoose.Schema({
	ownerId: Number,
	name: String,
	memberList: Array,
	itemList: Array,
	isArchived: Boolean,
});

const userSchema = new mongoose.Schema({
	name: String,
	email: String,
});

const itemSchema = new mongoose.Schema({
	name: String,
	quantity: Number,
	unit: String,
	ticked: Boolean,
});

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);
const User = mongoose.model('User', userSchema);
const Item = mongoose.model('Item', itemSchema);

export {
	ShoppingList,
	User,
	Item,
}