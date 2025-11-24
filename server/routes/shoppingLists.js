import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { ShoppingList } from "../models/ShoppingList.js";
import shoppingListController from "../controllers/shoppinglistController.js";

const shoppingListRouter = express.Router();

shoppingListRouter.get("/:id", authMiddleware, (req, res) => {
	try {
		shoppingListController.get(req, res);
	} catch (err) {
		console.log(err);
	}
})

shoppingListRouter.put("/", authMiddleware, async (req, res) => {
	try {
		console.log(req.user);
		const ownerId = req.user.id;
		const listName = req.body.name;
		const shoppingList = new ShoppingList({
			ownerId: ownerId,
			name: listName
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

})


shoppingListRouter.delete("/:id", (req, res) => {

})

export {
	shoppingListRouter
}