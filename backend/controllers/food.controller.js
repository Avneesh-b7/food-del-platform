import FoodModel from "../models/food.model.js";
import fs from "fs";
import { uploadToS3 } from "../utils/multer.js";

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

export { addFoodItem };
