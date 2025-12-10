import { Router } from "express";
import { healthCheckController } from "../controllers/healthcheck.controller.js";

const healthCheckRouter = Router();

//routes
healthCheckRouter.get("/", healthCheckController);

export { healthCheckRouter };
