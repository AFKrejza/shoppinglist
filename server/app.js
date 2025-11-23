import mongoose, { connect } from "mongoose";
import express from "express";
import dotenv from "dotenv";

import { shoppingListRouter } from "./routes/shoppingLists.js";
import { userRouter } from "./routes/users.js";
import { authRouter } from "./routes/auth.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
connectDB();
app.use(express.json());
const port = process.env.SERVER_PORT;
const secret = process.env.JWT_SECRET;

app.use("/auth", authRouter);

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
