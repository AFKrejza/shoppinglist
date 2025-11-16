import express from "express";
import validate from "../middleware/validate.js";
import { authenticateUser, authorizeUser } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.get("/:id", (req, res) => {
	const user = {};
})

// validate it too!
userRouter.put("/", (req, res) => {
	const isValid = validate(req.body);
	if (!isValid) throw new Error("Validation failed"); // figure out how mongoose returns schema errors
	// add stuff
	return req.body;
})

userRouter.delete("/", (req, res) => {
	const authorized = authorizeUser(req.body, req.headers.authorization);
	
})

export {
	userRouter
}