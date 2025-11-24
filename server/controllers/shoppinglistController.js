import { ShoppingList } from "../models/ShoppingList.js";

// req.user should exist here
const get = async (req, res) => {
	try {
		// TODO: check that ID is a number
		const id = req.params.id;
		const ownerId = req.user.ownerId;
		const shoppingList = await ShoppingList.findOne({_id: id,});
		res.status(200).send(shoppingList);
	} catch (err) {
		console.log(err); // TODO: add error handling middleware
	}
}

const listPage = async (req, res) => {
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

const listAll = async (req, res) => {
	try {
		const lists = await ShoppingList.find();
		return res.status(200).json(lists);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

const create = async (req, res) => {
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

export default {
	get,
	listPage,
	listAll,
	create
}