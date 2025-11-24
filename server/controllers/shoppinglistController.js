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

export default {
	get
}