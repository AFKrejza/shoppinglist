import { shoppingListDao } from "../dao/shoppingListDao.js";
import { ShoppingList } from "../models/ShoppingList.js";
import { Item } from "../models/Item.js";

export const shoppingListService = {
	async findById(id, ownerId) {
		const list = await shoppingListDao.findById(id, ownerId);
		return list;
	},

	async getPage(pageSize, skip, userId) {
		const lists = await shoppingListDao.getPage(userId, skip, pageSize);
		return lists;
	},

	async listAll() {
		return await shoppingListDao.listAll();
	},

	async create(ownerId, listName) {
		const shoppingList = new ShoppingList({
			ownerId: ownerId,
			name: listName
		});
		await shoppingList.validate();
		const createdList = await shoppingListDao.createList(shoppingList);
		console.log(`List ${createdList._id} created`);
		return createdList;
	},

	async update(listId, ownerId, data) {
		const list = await shoppingListDao.findById(listId, ownerId);

		if (!list)
			throw new Error("List not found or unauthorized");
		
		if (ownerId != list.ownerId && (
			data.name		!== undefined ||
			data.isArchived	!== undefined ||
			data.memberList	!== undefined ||
			data.ownerId	!== undefined
		)) throw new Error("Missing permissions: members can only modify the item list");
		
		const updates = {};
		if (data.name !== undefined)
			updates.name = data.name;
		if (data.isArchived !== undefined)
			updates.isArchived = data.isArchived;

		// TODO: add a check for the memberList to ensure that added user IDs:
		// exist, are not the owner, and aren't already added (and partial updating)
		// note: this only updates, it can't remove IDs!

		if (data.memberList !== undefined){
			const updatedMemberList = [...list.memberList];

		data.memberList.forEach(id => {
			if (!updatedMemberList.includes(id))
				updatedMemberList.push(id);
		});

		updates.memberList = updatedMemberList;
		}
		// TODO: add owner transfer by changing ownerId as above

		// handle creating items and updating them on partial data
		// check what happens if an _id is somehow invalid (doesn't refer to an existing item)
		if (data.itemList !== undefined) {
			const updatedItemList = [...list.itemList];

			data.itemList.forEach(item => {
				const existingItem = updatedItemList.find(
					elem => elem._id.toString() === item._id
				);

				if (existingItem) {
					if (item.name !== undefined) existingItem.name = item.name;
					if (item.quantity !== undefined) existingItem.quantity = item.quantity;
					if (item.unit !== undefined) existingItem.unit = item.unit;
					if (item.ticked !== undefined) existingItem.ticked = item.ticked;
				}
				else {
					const newItem = new Item({
						name: item.name,
						quantity: item.quantity,
						unit: item.unit,
						ticked: item.ticked
					});
					newItem.validate();
					updatedItemList.push(newItem);
				}
			});
			updates.itemList = updatedItemList;
		}

		const updatedList = await shoppingListDao.updateList(listId, updates);
		return updatedList;
	},

	async remove(listId, ownerId) {
		const deleteMsg = await shoppingListDao.remove(listId, ownerId);
		if (!deleteMsg.deletedCount)
			throw new Error("Shopping list not found or invalid permissions");
		console.log(deleteMsg);
		return deleteMsg;
	}
};