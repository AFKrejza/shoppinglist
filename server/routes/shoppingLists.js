import express from "express";
import validate from "../middleware/validate.js";

const shoppingListRouter = express.Router();

shoppingListRouter.get("/:id", (req, res) => {
	const shoppingList = {};
})

// validate it too!
shoppingListRouter.put("/", (req, res) => {
	const isValid = validate(req.body);
	if (!isValid) throw new Error(""); // figure out how mongoose returns schema errors
	// add stuff
	return req.body;
})

shoppingListRouter.delete("/", (req, res) => {

})

export {
	shoppingListRouter
}