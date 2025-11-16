import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";

import { shoppingListRouter } from "./routes/shoppingLists.js";
import { userRouter } from "./routes/users.js";
import { authenticateUser } from "./middleware/auth.js";

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.SERVER_PORT;
const secret = process.env.JWT_SECRET;

app.use("/shoppinglists", shoppingListRouter);
app.use("/users", userRouter);

// this one works
app.post("/login", (req, res) => {
	// example req.body = { userName: "John", password: "password" };
	const token = authenticateUser(req.body);
	res.status(200).send(token);
})

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
})

// async function main() {
//  	await mongoose.connect('mongodb:/127.0.0.1:27017/test');
// }
