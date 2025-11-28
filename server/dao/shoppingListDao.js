import { ShoppingList } from "../models/ShoppingList.js";

export const shoppingListDao = {
	async findById(listId, ownerId) {
		return await ShoppingList.findOne({_id: listId, ownerId: ownerId });
	},

	async getPage(userId, skip, pageSize) {
		return await ShoppingList.find({
			$or: [
				{ ownerId: userId },
				{ memberList: userId }
			]
		})
		.skip(skip)
		.limit(pageSize)
		.sort({ createdAt: -1 });
	},

	async getAll() {
		return await ShoppingList.find();
	},

	async createList(shoppingList) {
		return await ShoppingList.insertOne(shoppingList);
	},

	async updateList(listId, updates) {
		return await ShoppingList.findByIdAndUpdate(
			listId,
			{ $set: updates },
			{ new: true, runValidators: true }
		);
	},

	async remove(listId, ownerId) {
		return await ShoppingList.deleteOne({ _id: listId, ownerId: ownerId });
	}
};