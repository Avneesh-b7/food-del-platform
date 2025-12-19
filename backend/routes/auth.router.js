import express, { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { verifyAccessToken } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.get("/verify", authMiddleware, verifyAccessToken);

export { authRouter };
