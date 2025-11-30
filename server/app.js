import mongoose, { connect } from "mongoose";
import express from "express";
import dotenv from "dotenv";

import { shoppingListRouter } from "./routes/shoppingLists.js";
import { userRouter } from "./routes/users.js";
import { authRouter } from "./routes/auth.js";
import { connectDB } from "./config/db.js";
import { seedDatabase } from "./config/seed.js";

dotenv.config();

const app = express();
await connectDB();
app.use(express.json());
await seedDatabase();

const port = process.env.SERVER_PORT;

app.use("/auth", authRouter);
app.use("/shoppinglists", shoppingListRouter);
app.use("/users", userRouter);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
})
