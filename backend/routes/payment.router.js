import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  makePayment,
  placeOrder,
  listOrders,
} from "../controllers/payment.controller.js";

const paymentRouter = Router();

//routes
paymentRouter.post("/placeorder", authMiddleware, placeOrder);
paymentRouter.post("/payment", authMiddleware, makePayment);
paymentRouter.get("/list", authMiddleware, listOrders);

export { paymentRouter };
