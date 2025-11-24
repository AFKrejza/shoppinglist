import express from "express";
import shoppingListController from "../controllers/shoppinglistController.js";
import { User } from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

export const userRouter = express.Router();

userRouter.get("/:id", (req, res) => {

})

// the rest of the routes will follow a similar pattern.
// The main difference will be in which model is used and 
// what properties are required.
userRouter.put("/", async (req, res) => {
	try {
		const { userName, email } = req.body;
		const user = new User({
			userName: userName,
			email: email
		});
		console.log(user);
		await user.validate();
	} catch (error) {
		if (error.name === "ValidationError") {
			const messages = Object.values(error.errors).map(err => err.message);
			console.log(error);
			return res.status(400).json({ errors: messages });
		}
		console.log(error);
		res.status(500).send(error);
	}
})

// get a page of shopping lists
// takes page & pageSize query parameters
userRouter.get(
	"/:userId/shoppinglists",
	authMiddleware,
	shoppingListController.listPage
)


userRouter.patch("/:id", (req, res) => {

})

userRouter.delete("/:id", (req, res) => {

})
