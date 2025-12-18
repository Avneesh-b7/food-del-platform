import express, { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { verifyToken } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.get("/verify", authMiddleware, verifyToken);

export { authRouter };
