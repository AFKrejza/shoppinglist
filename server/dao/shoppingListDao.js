import { ShoppingList } from "../models/ShoppingList.js";

export const shoppingListDao = {
	async findById(listId, ownerId) {
		return await ShoppingList.findOne({_id: listId, ownerId: ownerId });
	},

	async findList(listId) {
		return await ShoppingList.findOne({ _id: listId });
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

	async listAll() {
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
	},

	async removeItem(listId, itemId) {
		return await ShoppingList.findByIdAndUpdate(
			listId,
			{ $pull: { itemList: { _id: itemId }}},
			{new: true}
		);
	},

	async removeMember(listId, memberId) {
		return await ShoppingList.findByIdAndUpdate(
			listId,
			{ $pull: { memberList: { _id: memberId }}},
			{new: true}
		);
	}
};