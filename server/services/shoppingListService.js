import { shoppingListDao } from "../dao/shoppingListDao.js";
import { ShoppingList } from "../models/ShoppingList.js";
import { Item } from "../models/Item.js";
import { roleService, getRole } from "./roleService.js";
import { ROLES } from "../config/roles.js";
import { userService } from "./userService.js";
import mongoose from "mongoose";


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

	// this function can ONLY modify and create, it CANNOT delete stuff.
	// use remove, removeItem and removeMember instead. Those routes are much cleaner.
	async update(listId, userId, data) {
		const list = await shoppingListDao.findById(listId);

		if (!list)
			throw new Error("List not found or unauthorized");
		
		const isAdmin = await roleService(userId, ROLES.ADMIN);
		const isOwner = list.ownerId === userId;
		const isPrivileged = isOwner || isAdmin;
		const isMember = list.memberList.includes(userId); // TODO: verify that this works

		const modifyingRestrictedFields =
			data.name		!== undefined ||
			data.isArchived	!== undefined ||
			data.memberList	!== undefined ||
			data.ownerId	!== undefined;

		if (!isPrivileged && modifyingRestrictedFields)
			throw new Error("Missing permissions: members can only modify the item list");
		if (!isPrivileged && !isMember)
			throw new Error("Missing permissions: not a member");
		
		const updates = {};
		if (data.name !== undefined)
			updates.name = data.name;
		if (data.isArchived !== undefined)
			updates.isArchived = data.isArchived;

		await ownerIdHelper(list, data, updates);
		await memberHelper(list, data, updates);
		await itemHelper(list, data, updates);

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
			throw new Error("Shopping list not found");

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

		const isValidId = await validateId(memberId);
				if (!isValidId)
					throw new Error(`Invalid ID format: ${memberId}`);
		
		const deleted = await shoppingListDao.removeMember(listId, memberId);

		if (!deleted)
			throw new Error(`Member ${memberId} not found`);

		return memberId;
	}
};

// handle creating items and updating them on partial data
async function itemHelper(list, data, updates) {
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
}

async function memberHelper(list, data, updates) {
	if (data.memberList !== undefined) {
		const updatedMemberList = [...list.memberList];

		for (const id of data.memberList) {
			if (!updatedMemberList.includes(id) && id !== list.ownerId) {
				const isValidId = await validateId(id);
				if (!isValidId)
					throw new Error(`Invalid ID format: ${id}`);
				const userExists = await userService.findById(id);
				if (!userExists)
					throw new Error(`User can't be added: user doesn't exist`);

				updatedMemberList.push(id);
			}
		};
		updates.memberList = updatedMemberList;
	}
}

async function ownerIdHelper(list, data, updates) {
	if (data.ownerId !== undefined) {

		const isValidId = await validateId(data.ownerId);
		if (!isValidId)
			throw new Error(`Invalid ID format: ${data.ownerId}`);

		const userExists = await userService.findById(data.ownerId);
		if (!userExists)
			throw new Error(`Ownership can't be transferred: user doesn't exist`);

		if (list.memberList.includes(ownerId))
			list.memberList.splice(memberList.indexof(ownerId), 1);

		updates.ownerId = data.ownerId;
	}
}

async function validateId(id) {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return false;
	}
	return true;
}