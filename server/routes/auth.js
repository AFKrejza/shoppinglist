import express from "express";
import authController from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

export const authRouter = express.Router();

// userName, email, password
authRouter.post("/register", authController.register);

// email, password
authRouter.post("/login", authController.login);

authRouter.get("/profile", authMiddleware, authController.profile);
