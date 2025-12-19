import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  placeOrder,
  listOrders,
  listAll,
  updateStatus,
} from "../controllers/orders.controller.js";

const paymentRouter = Router();

// user routes
paymentRouter.post("/placeorder", authMiddleware, placeOrder);
paymentRouter.get("/list", authMiddleware, listOrders);

//admin routes
paymentRouter.get("/admin/list", listAll);
paymentRouter.post("/admin/updatestatus", updateStatus);

export { paymentRouter };
