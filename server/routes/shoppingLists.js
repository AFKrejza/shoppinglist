import express from "express";
// import { authorizeOwner, authorizeMember } from "../middleware/auth.js";
import { ShoppingList } from "../models/Shoppinglist.js";

const shoppingListRouter = express.Router();

shoppingListRouter.get("/:id", (req, res) => {
	const authorized = authorizeMember(req.headers.authorization);
})

// the rest of the routes will follow a similar pattern.
// The main difference will be in which model is used and 
// what properties are required.
shoppingListRouter.put("/", async (req, res) => {
	try {
		const { ownerId, name } = req.body;
		const shoppingList = new ShoppingList({
			ownerId: ownerId,
			name: name
		});
		console.log(shoppingList);
		await shoppingList.validate();
		res.status(201).send(shoppingList);
	} catch (error) {
		if (error.name === "ValidationError") {
			const messages = Object.values(error.errors).map(err => err.message);
			console.log(error);
			return res.status(400).json({ errors: messages });
		}
		console.log(error);
		res.error(500).send(error);
	}
})

// the items array will be updated here
// because they're part of the shopping list document
shoppingListRouter.patch("/:id", (req, res) => {
	const authorized = authorizeMember(req.headers.authorization);
})


shoppingListRouter.delete("/:id", (req, res) => {
	const authorized = authorizeMember(req.headers.authorization);
})

export {
	shoppingListRouter
}