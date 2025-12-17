import { UserModel } from "../models/user.model.js";
import FoodModel from "../models/food.model.js";

async function addToCart(req, res) {
  try {
    const userId = req.user.id;
    const { foodId, quantity } = req.body;

    console.log("[CART] AddToCart - payload:", { userId, foodId, quantity });

    // Input validation
    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: "Food ID is required.",
      });
    }
    const qty = Number(quantity) && Number(quantity) > 0 ? Number(quantity) : 1;

    // Find user
    const user = await UserModel.findById(userId);
    if (!user) {
      console.error("[CART] AddToCart - User not found:", userId);
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Check if food exists
    const foodExists = await FoodModel.findById(foodId);
    if (!foodExists) {
      console.error("[CART] AddToCart - Food item not found:", foodId);
      return res
        .status(404)
        .json({ success: false, message: "Food item not found." });
    }

    // Check if item already in cart
    const existingItem = user.cart.find(
      (item) => item.foodId.toString() === foodId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += qty;
      console.info("[CART] Updated quantity:", existingItem);
    } else {
      // Add new item
      user.cart.push({
        foodId,
        quantity: qty,
        addedAt: new Date(),
      });
      console.info("[CART] Added new item:", { foodId, qty });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Item added to cart.",
      cart: user.cart,
    });
  } catch (err) {
    console.error("[CART] AddToCart - Error:", err.message || err);
    return res.status(500).json({
      success: false,
      message: "Failed to add item to cart.",
      error: err.message,
    });
  }
}

async function removeFromCart(req, res) {
  try {
    const userId = req.user.id;
    const { foodId } = req.body;

    console.info("[CART] RemoveFromCart - payload:", { userId, foodId });

    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: "Food ID is required.",
      });
    }

    // Find user
    const user = await UserModel.findById(userId);
    if (!user) {
      console.error("[CART] RemoveFromCart - User not found:", userId);
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const beforeCount = user.cart.length;

    user.cart = user.cart.filter((item) => item.foodId.toString() !== foodId);

    if (beforeCount === user.cart.length) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart.",
      });
    }

    await user.save();

    console.info("[CART] Item removed. New cart size:", user.cart.length);

    return res.status(200).json({
      success: true,
      message: "Item removed from cart.",
      cart: user.cart,
    });
  } catch (err) {
    console.error("[CART] RemoveFromCart - Error:", err.message || err);
    return res.status(500).json({
      success: false,
      message: "Failed to remove item from cart.",
      error: err.message,
    });
  }
}

async function listCartItems(req, res) {
  try {
    const userId = req.user.id;

    console.info("[CART] ListCartItems - user:", userId);

    const user = await UserModel.findById(userId).populate("cart.foodId");

    if (!user) {
      console.error("[CART] ListCartItems - User not found:", userId);
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      cart: user.cart,
    });
  } catch (err) {
    console.error("[CART] ListCartItems - Error:", err.message || err);
    return res.status(500).json({
      success: false,
      message: "Failed to list cart items.",
      error: err.message,
    });
  }
}

export { removeFromCart, listCartItems, addToCart };

//PROMPT
// #context
// this is the routes
// cartRouter.post("/add", authMiddleware(), addToCart);
// cartRouter.post("/remove", authMiddleware(), removeFromCart);
// cartRouter.post("/list", authMiddleware(), listCartItems);
// #task
// 1. i want you to complete these 3 controller functions (i.e. add to cart , remove from cart , list cart items)
// 2. make it production grade and safe
// 3. handle errors gracefully and send appropriate responses and results
// 4. log items wherever neccessary to make errors easy to troubleshoot
