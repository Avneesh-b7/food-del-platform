import FoodModel from "../models/food.model.js";
import mongoose from "mongoose";
import { uploadToS3, removeFromS3 } from "../utils/multer.js";

// helper function
function now() {
  return new Date().toISOString();
}

//function to add food item
//PROMPT
// async function addFoodItem(req, res) {
//   // what does this function do
//   // takes a request and checks if all the requred items are present
//   // takes the image and uploads it to s3 using upload to s3 function
//   // takes the public url (return by the upload to S3 function) and all the other feilds and pushes then to mongodb
//   // we use FoodModel and the required items are name , image , price, description , category and timestamp
//   // handles all errors gracefully and maintains industry standard practises
// }

// export { addFoodItem };

/**
 * addFoodItem
 * Expects multipart/form-data with:
 * - fields: name, description, price, category
 * - file: image (field name: "image")
 *
 * Uses upload.single('image') as middleware in route before this controller.
 */
async function addFoodItem(req, res) {
  try {
    // 1) Basic validation of body fields
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields. Required: name, description, price, category",
      });
    }

    const parsedPrice = Number(price);
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid price. Must be a positive number.",
      });
    }

    // 2) Upload image to S3 (this will validate req.file and file size)
    let imageUrl;
    try {
      imageUrl = await uploadToS3(req, "FoodItemImages");
    } catch (uploadErr) {
      // uploadToS3 throws errors with statusCode property
      console.error("S3 Upload error:", uploadErr);
      return res.status(uploadErr.statusCode || 500).json({
        success: false,
        message: uploadErr.message || "Failed to upload image",
      });
    }

    // 3) Create DB document
    const newFood = await FoodModel.create({
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      category: category.trim(),
      image: imageUrl,
    });

    // 4) Return created resource
    return res.status(201).json({
      success: true,
      message: "Food item created",
      data: newFood,
    });
  } catch (err) {
    console.error("addFoodItem error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while adding food item",
      error: err.message || "Unknown error",
    });
  }
}

// PROMPT
// async function listFoodItems() {
// get all the food items from the mongodb (FoodModel is the model)
// handle errors gracefully
// be descriptive in logs so that erros can be trouble shot easily
// return an appropriate sucess //error respones
// in the respones i need an array of objects (where each object is the food item with all its properties)
// }

async function listFoodItems(req, res) {
  try {
    console.info(`[${now()}] listFoodItems - fetching all food items...`);

    // Get all items (up to ~50, safe to load at once)
    const items = await FoodModel.find().sort({ createdAt: -1 }).lean();

    console.info(`[${now()}] listFoodItems - success`, {
      count: items.length,
    });

    return res.status(200).json({
      success: true,
      message: "Food items fetched successfully",
      data: items, // array of objects
    });
  } catch (err) {
    console.error(`[${now()}] listFoodItems - error`, {
      error: err?.message || err,
    });

    return res.status(500).json({
      success: false,
      message: "Server error while fetching food items",
      error: err?.message,
    });
  }
}

//PROMPT
// async function removeFoodItem(req, res) {
// takes the id of the food item passed in the request body
// checks if id is valid
// removes the image related to the id from S3
// removes the entry from the database

// returns industry standard API response codes and errors/ response messages
// logs all the necessary information to console
// handles errors gracefully
// has a verbosity level of medium for all respones/logs so that it is easier for the user to troubleshoot the error
// }

async function removeFoodItem(req, res) {
  try {
    const { id } = req.body;

    console.info(`[${now()}] deleteFoodItem - start`, { id });

    // 1) Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      console.warn(`[${now()}] deleteFoodItem - invalid or missing id`, { id });
      return res.status(400).json({
        success: false,
        message: "Invalid or missing food item ID.",
      });
    }

    // 2) Fetch food item from DB
    const food = await FoodModel.findById(id);
    if (!food) {
      console.warn(`[${now()}] deleteFoodItem - item not found`, { id });
      return res.status(404).json({
        success: false,
        message: "Food item not found.",
      });
    }

    console.info(`[${now()}] deleteFoodItem - item found`, {
      id,
      image: food.image,
      name: food.name,
    });

    // 3) Delete image from S3
    let s3Result;
    if (food.image) {
      s3Result = await removeFromS3(food.image);
      console.info(`[${now()}] deleteFoodItem - S3 delete result`, s3Result);
    } else {
      console.warn(`[${now()}] deleteFoodItem - no image URL found for item`, {
        id,
      });
      s3Result = { success: false, message: "No image to delete" };
    }

    // 4) Delete DB record
    await FoodModel.deleteOne({ _id: id });
    console.info(`[${now()}] deleteFoodItem - DB delete success`, { id });

    // 5) Response
    return res.status(200).json({
      success: true,
      message: "Food item deleted successfully.",
      s3: s3Result,
    });
  } catch (err) {
    console.error(`[${now()}] deleteFoodItem - unexpected error`, {
      error: err?.message || err,
    });

    return res.status(500).json({
      success: false,
      message: "Server error while deleting food item.",
      error: err?.message,
    });
  }
}

export { addFoodItem, listFoodItems, removeFoodItem };
