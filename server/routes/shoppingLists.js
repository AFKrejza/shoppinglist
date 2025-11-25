import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import shoppingListController from "../controllers/shoppinglistController.js";

const shoppingListRouter = express.Router();

shoppingListRouter.get("/listAll", shoppingListController.listAll);

shoppingListRouter.get("/:id", authMiddleware, shoppingListController.get);

shoppingListRouter.put("/", authMiddleware, shoppingListController.create);

shoppingListRouter.patch("/:id", authMiddleware, shoppingListController.update)


shoppingListRouter.delete("/:id", (req, res) => {

})

export {
	shoppingListRouter
}