import { ShoppingList } from "../models/ShoppingList.js";
import { Item } from "../models/Item.js";

// doesn't work! needs the full ID
async function get(req, res) {
	try {
		const id = req.params.id;
		const ownerId = req.user.ownerId;
		const shoppingList = await ShoppingList.findOne({_id: id, ownerId: ownerId });
		res.status(200).send(shoppingList);
	} catch (err) {
		console.log(err); // TODO: add error handling middleware
	}
}

async function listPage(req, res) {
	const page = Number(req.query.page) || 1;
	const pageSize = Number(req.query.pageSize) || 1;
	const skip = (page - 1) * pageSize;
	try {
		const userId = req.user.id;
		const lists = await ShoppingList.find({
			$or: [
				{ ownerId: userId },
				{ memberList: userId }
			]
		})
		.skip(skip)
		.limit(pageSize)
		.sort({ createdAt: -1 });
		console.log(lists);

		return res.status(200).json(lists)
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

async function listAll(req, res) {
	try {
		const lists = await ShoppingList.find();
		return res.status(200).json(lists);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

async function create(req, res) {
	try {
		const ownerId = req.user.id;
		const listName = req.body.name;
		const shoppingList = new ShoppingList({
			ownerId: ownerId,
			name: listName
		});
		await shoppingList.validate();
		const createdList = await ShoppingList.insertOne(shoppingList);
		console.log(createdList);
		res.status(201).send(createdList);
	} catch (error) {
		if (error.name === "ValidationError") {
			const messages = Object.values(error.errors).map(err => err.message);
			console.log(error);
			return res.status(400).json({ errors: messages });
		}
		console.log(error);
		res.status(500).send(error);
	}
}

// TODO: members, owner, and admins should only be allowed to change certain things
// TODO: split this function into different parts, add an abl and dao, etc
// this function can ONLY modify and create, it CANNOT delete stuff.
// create proper subcontrollers or other ways to do it.
async function update (req, res) {
	try {
		const userId = req.user.id;
		const listId = req.params.id;
		const list = await ShoppingList.findOne({
				ownerId: userId,
				_id: listId
		});
		if (!list)
			return res.status(404).json({ message: "List not found or unauthorized"});
		// if (req.user.id === list.ownerId)
		// 	req.user.

		const updates = {};
		// if (updates.ownerId) list.ownerId = updates.ownerId; // TODO: implement owner changes
		if (req.body.name !== undefined)
			updates.name = req.body.name;
		if (req.body.isArchived !== undefined)
			updates.isArchived = req.body.isArchived;

		// handle creating items and updating them on partial data
		// check what happens if an _id is somehow invalid (doesn't refer to an existing item)
		if (req.body.itemList !== undefined) {
			const updatedItemList = [...list.itemList];

			req.body.itemList.forEach(item => {
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

		// TODO: add a check for the memberList to ensure that added user IDs:
		// exist, are not the owner, and aren't already added (and partial updating)
		// note: this only updates
		if (req.body.memberList !== undefined){
			const updatedMemberList = [...list.memberList];

			req.body.memberList.forEach(id => {
				if (!updatedMemberList.includes(id))
					updatedMemberList.push(id);
			});

			updates.memberList = updatedMemberList;
		}

		const updatedList = await ShoppingList.findByIdAndUpdate(
			listId,
			{ $set: updates },
			{ new: true, runValidators: true }
		);
		return res.status(200).json(updatedList);

	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
}

async function remove(req, res) {
	try {
		const ownerId = req.user.id;
		const listId = req.body._id;
		const deletedList = await ShoppingList.deleteOne({ _id: listId, ownerId: ownerId }, { new: true });

		if (!deletedList.deletedCount)
			throw new Error("Shopping list not found or invalid permissions");

		console.log(deletedList);
		res.status(201).send(deletedList);
	} catch (error) {
		if (error.name === "ValidationError") {
			const messages = Object.values(error.errors).map(err => err.message);
			console.log(error);
			return res.status(400).json({ errors: messages });
		}
		console.log(error);
		res.status(500).send(error);
	}
}

export default {
	get,
	listPage,
	listAll,
	create,
	update,
	remove
}