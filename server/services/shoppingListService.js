import { shoppingListDao } from "../dao/shoppingListDao.js";
import { ShoppingList } from "../models/ShoppingList.js";
import { Item } from "../models/Item.js";
import { roleService, getRole } from "./roleService.js";
import { ROLES } from "../config/roles.js";

export const shoppingListService = {
	async findById(id, userId) {
		const list = await shoppingListDao.findById(id);
		if (!list)
			throw new Error("List not found");

		const isAdmin = await roleService(userId, ROLES.ADMIN);
		const isOwner = list.ownerId === userId;
		const isMember = list.memberList.includes(userId);

		if (!isAdmin && !isOwner && !isMember)
			throw new Error("Unauthorized");



		return list;
	},

	async getPage(pageSize, skip, userId) {
		const lists = await shoppingListDao.getPage(userId, skip, pageSize);

		if (!list)
			throw new Error("List not found or unauthorized");

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

	async update(listId, userId, data) {
		const list = await shoppingListDao.findById(listId, userId);

		if (!list)
			throw new Error("List not found or unauthorized");
		
		const isAdmin = await roleService(userId, ROLES.ADMIN);
		const isOwner = list.ownerId === userId;
		const isPrivileged = isOwner || isAdmin;

		const modifyingRestrictedFields =
			data.name		!== undefined ||
			data.isArchived	!== undefined ||
			data.memberList	!== undefined ||
			data.ownerId	!== undefined;

		if (!isPrivileged && modifyingRestrictedFields)
			throw new Error("Missing permissions: members can only modify the item list");
		
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

	// TODO: all 3 remove functions still need privilege checks!
	async remove(listId, userId) {
		const existingList = await shoppingListDao.findById(listId);

		if (!existingList)
			throw new Error("Shopping list not found");

		const isAdmin = await roleService(userId, ROLES.ADMIN);
		if (userId !== existingList.ownerId && !isAdmin) {
			throw new Error("Invalid permissions");
		}
		const deleteMsg = await shoppingListDao.remove(listId);
		
		if (!deleteMsg.deletedCount)
			throw new Error("Shopping list not found or invalid permissions");

		console.log(deleteMsg);
		return deleteMsg;
	},

	// members, the owner, and admins+ can use this
	async removeItem(userId, listId, itemId) {
		const existingList = await shoppingListDao.findById(listId);
		if (!existingList)
			throw new Error("Shopping list not found");
		
		if (userId !== existingList.ownerId &&
			!existingList.memberList.includes(userId) &&
			!(await roleService(userId, ROLES.ADMIN))) {
				throw new Error("Missing permissions");
		}

		const deleted = await shoppingListDao.removeItem(listId, itemId);

		if (!deleted)
			throw new Error(`Item ${itemId} not found`);

		return itemId;
	},

	async removeMember(userId, listId, memberId) {
		const existingList = await shoppingListDao.findById(listId);

		if (!existingList)
			throw new Error("Shopping list not found");

		if (userId !== existingList.ownerId &&
			!existingList.memberList.includes(userId) &&
			!(await roleService(userId, ROLES.ADMIN))) {
				throw new Error("Missing permissions");
		}
		
		const deleted = await shoppingListDao.removeMember(listId, memberId);

		if (!deleted)
			throw new Error(`Member ${memberId} not found`);

		return memberId;
	}
};