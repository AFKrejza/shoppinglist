import express from "express";
import { authenticateUser, decodeUser } from "../middleware/authOLD.js";

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
		res.error(500).send(error);
	}
})

// used to authenticate. Returns a JWT
userRouter.post("/login", (req, res) => {
	const token = authenticateUser(req.body);
	return token;
})


userRouter.patch("/:id", (req, res) => {

})

userRouter.delete("/:id", (req, res) => {
	const decoded = decodeUser(req.headers.authorization);

})
