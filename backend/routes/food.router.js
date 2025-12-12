import express, { Router } from "express";
import {
  addFoodItem,
  listFoodItems,
  removeFoodItem,
} from "../controllers/food.controller.js";
import { upload, uploadToS3 } from "../utils/multer.js";

const foodRouter = Router();

foodRouter.post("/add", upload.single("image"), addFoodItem);
foodRouter.get("/list", listFoodItems);
foodRouter.post("/remove", removeFoodItem);

export { foodRouter };
