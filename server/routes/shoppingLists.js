import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import shoppingListController from "../controllers/shoppinglistController.js";

const shoppingListRouter = express.Router();

shoppingListRouter.get("/listAll", authMiddleware, shoppingListController.listAll);

shoppingListRouter.put("/", authMiddleware, shoppingListController.create);

shoppingListRouter.get("/:id", authMiddleware, shoppingListController.get);

shoppingListRouter.patch("/:id", authMiddleware, shoppingListController.update);

shoppingListRouter.delete("/:id", authMiddleware, shoppingListController.remove);

export {
	shoppingListRouter
}