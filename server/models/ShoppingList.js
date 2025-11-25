import mongoose from "mongoose";
import { ItemSchema } from "./Item.js";

export const ShoppingListSchema = new mongoose.Schema({
	ownerId: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true
	},
	isArchived: {
		type: Boolean,
		default: false
	},
	memberList: {
		type: [String], 
		default: []
	},
	itemList: {
		type: [ItemSchema],
		default: []
	}
});

export const ShoppingList = mongoose.model('ShoppingList', ShoppingListSchema);
