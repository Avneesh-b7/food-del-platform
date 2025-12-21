import express, { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  verifyAccessToken,
  refreshAccessToken,
} from "../controllers/auth.controller.js";

const authRouter = Router();

// authRouter.get("/verify-access-token", authMiddleware, verifyAccessToken);
authRouter.get("/verify-access-token", authMiddleware, verifyAccessToken);
authRouter.post("/refresh-access-token", refreshAccessToken);

export { authRouter };
