import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import shoppingListController from "../controllers/shoppinglistController.js";
import { ROLES, authRole } from "../middleware/authRole.js";

const shoppingListRouter = express.Router();

shoppingListRouter.get("/listAll", authMiddleware, authRole(ROLES.ADMIN), shoppingListController.listAll);

shoppingListRouter.put("/", authMiddleware, shoppingListController.create);

shoppingListRouter.get("/:id", authMiddleware, shoppingListController.findById);

shoppingListRouter.patch("/:id", authMiddleware, shoppingListController.update);

shoppingListRouter.delete("/:id", authMiddleware, shoppingListController.remove);

export {
	shoppingListRouter
}