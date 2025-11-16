import express from "express";
import validate from "../middleware/validate.js";
import { authorizeOwner, authorizeMember } from "../middleware/auth.js";
import { newItem, newShoppingList } from "../middleware/schemas/models.js";

const shoppingListRouter = express.Router();

shoppingListRouter.get("/:id", (req, res) => {
	const authorized = authorizeMember(req.headers.authorization);
	const shoppingList = {};
})

shoppingListRouter.put("/", (req, res) => {
	const isValid = validate(req.body);
	if (!isValid) throw new Error(""); // figure out how mongoose returns schema errors
	// add stuff
	return req.body;
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