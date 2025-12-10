import express, { Router } from "express";
import { addFoodItem } from "../controllers/food.controller.js";
import { upload } from "../utils/multer.js";

const foodRouter = Router();

foodRouter.post("/add", upload.single("image"), addFoodItem);

export { foodRouter };
