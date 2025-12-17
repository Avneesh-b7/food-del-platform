import express, { Router } from "express";
import {
  addToCart,
  listCartItems,
  removeFromCart,
} from "../controllers/cart.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const cartRouter = Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/remove", authMiddleware, removeFromCart);
cartRouter.get("/list", authMiddleware, listCartItems);

export { cartRouter };
