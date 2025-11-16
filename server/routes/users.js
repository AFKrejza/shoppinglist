import express from "express";
import validate from "../middleware/validate.js";
import { authenticateUser, decodeUser } from "../middleware/auth.js";
import { newUser } from "../middleware/schemas/models.js";

const userRouter = express.Router();

userRouter.get("/:id", (req, res) => {

})

// validate it too!
userRouter.put("/", (req, res) => {
	const isValid = validate(req.body);
	if (!isValid) throw new Error("Validation failed"); // figure out how mongoose returns schema errors
	// add stuff
	return req.body;
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

export {
	userRouter
}