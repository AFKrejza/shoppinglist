import { shoppingListService } from "../services/shoppingListService.js";

async function findById(req, res) {
	try {
		const id = req.params.id;
		const ownerId = req.user.id;
		const shoppingList = await shoppingListService.findById(id, ownerId);
		res.status(200).send(shoppingList);
	} catch (err) {
		console.log(err); // TODO: add error handling middleware
		res.status(500).json({ error: error.message });
	}
}

// note: page size change must reset page to 1 on the frontend, else it'll skip some
async function getPage(req, res) {
	try{
		const page = Number(req.query.page) || 1;
		const pageSize = Number(req.query.pageSize) || 1;
		const skip = (page - 1) * pageSize;

		const userId = req.user.id;
		const updatedList = await shoppingListService.getPage(pageSize, skip, userId);

		res.json(updatedList);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error.message });
	}
}

async function listAll(req, res) {
	try {
		const lists = await shoppingListService.listAll();
		return res.status(200).json(lists);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

async function create(req, res) {
	try {
		const ownerId = req.user.id;
		const listName = req.body.name;
		const createdList = await shoppingListService.create(ownerId, listName);
		res.status(201).send(createdList);
	} catch (error) {
		if (error.name === "ValidationError") {
			const messages = Object.values(error.errors).map(err => err.message);
			console.log(error);
			return res.status(400).json({ errors: messages });
		}
		console.log(error);
		res.status(500).json({ error: error.message });
	}
}

// TODO: members, owner, and admins should only be allowed to change certain things
// this function can ONLY modify and create, it CANNOT delete stuff.
// create proper subcontrollers or other ways to do it.
async function update(req, res) {
	try {
		const listId = req.params.id;
		const userId = req.user.id;
		const updatedList = await shoppingListService.update(listId, userId, req.body);
		// if (!updatedList)
		// 	return res.status(404).json({ message: "List not found or unauthorized"});

		return res.status(200).json(updatedList);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message })
	}
}

async function remove(req, res) {
	try {
		const userId = req.user.id;
		const listId = req.params.id;
		const deleteMsg = await shoppingListService.remove(listId, userId);
		res.status(201).send(deleteMsg);
	} catch (error) {
		if (error.name === "ValidationError") {
			const messages = Object.values(error.errors).map(err => err.message);
			console.log(error);
			return res.status(400).json({ errors: messages });
		}
		console.log(error);
		res.status(500).json({ error: error.message });
	}
}

async function removeItem(req, res) {
	try {
		const userId = req.user.id;
		const listId = req.params.id;
		const itemId = req.params.itemId;
		const updatedList = await shoppingListService.removeItem(userId, listId, itemId);
		res.status(201).send(updatedList);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
}

async function removeMember(req, res) {
	try {
		const userId = req.user.id;
		const listId = req.params.id;
		const memberId = req.params.memberId;
		const updatedList = await shoppingListService.removeMember(userId, listId, memberId);
		res.status(201).send(updatedList);
	} catch(error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
}

export default {
	findById,
	getPage,
	listAll,
	create,
	update,
	remove,
	removeItem,
	removeMember
}