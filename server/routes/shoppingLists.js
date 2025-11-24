import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { ShoppingList } from "../models/ShoppingList.js";
import shoppingListController from "../controllers/shoppinglistController.js";

const shoppingListRouter = express.Router();

shoppingListRouter.get("/listAll", shoppingListController.listAll);

shoppingListRouter.get("/:id", authMiddleware, (req, res) => {
	try {
		shoppingListController.get(req, res);
	} catch (err) {
		console.log(err);
	}
})

shoppingListRouter.put("/", authMiddleware, shoppingListController.create);


// the items array will be updated here
// because they're part of the shopping list document
shoppingListRouter.patch("/:id", (req, res) => {

})


shoppingListRouter.delete("/:id", (req, res) => {

})

export {
	shoppingListRouter
}