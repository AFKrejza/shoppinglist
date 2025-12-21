import express from "express";
import shoppingListController from "../controllers/shoppinglistController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { userController } from "../controllers/userController.js";

export const userRouter = express.Router();

userRouter.patch("/:id", authMiddleware, userController.update)

userRouter.delete("/:id", authMiddleware, userController.remove)

userRouter.get("/:id", userController.findById);