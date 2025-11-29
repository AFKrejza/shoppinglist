import express from "express";
import shoppingListController from "../controllers/shoppinglistController.js";
import { User } from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { userController } from "../controllers/userController.js";

export const userRouter = express.Router();

userRouter.get("/:id", (req, res) => {

})

// get a page of shopping lists that the user is a member or owner of
// takes page & pageSize query parameters
userRouter.get("/:userId/shoppinglists", authMiddleware, shoppingListController.getPage)


userRouter.patch("/:id", authMiddleware, userController.update)

userRouter.delete("/:id", authMiddleware, userController.remove)
