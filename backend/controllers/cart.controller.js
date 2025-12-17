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

// PROMPT
// 1. for remove from cart func i want to have the folllowing functionalities
// 1. remove one food item
// 2. remove all the quantities of the food itemfrom the cart
// 3. have proper validations in place
// 4. handle errors gracefully and give approprite responses and errror messages
// 5. log essential infomration so that it is easy for me to troubleshoot
async function removeFromCart(req, res) {
  try {
    const userId = req.user.id;
    const { foodId, removeAll } = req.body;

    console.info("[CART] removeFromCart - Request:", {
      userId,
      foodId,
      removeAll,
    });

    // ---------------------------------------------------
    // 1. VALIDATION
    // ---------------------------------------------------
    if (!foodId) {
      console.warn("[CART] removeFromCart - Missing foodId");
      return res.status(400).json({
        success: false,
        message: "Food ID is required.",
      });
    }

    // Fetch user
    const user = await UserModel.findById(userId);
    if (!user) {
      console.error("[CART] removeFromCart - User not found:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Find existing cart item
    const cartItem = user.cart.find(
      (item) => item.foodId.toString() === foodId
    );

    if (!cartItem) {
      console.warn("[CART] removeFromCart - Item not found:", foodId);
      return res.status(404).json({
        success: false,
        message: "Item not found in cart.",
      });
    }

    // Ensure quantity is always numeric
    cartItem.quantity = Number(cartItem.quantity);

    if (isNaN(cartItem.quantity) || cartItem.quantity < 1) {
      console.error(
        "[CART] removeFromCart - Invalid stored quantity:",
        cartItem.quantity
      );
      return res.status(500).json({
        success: false,
        message: "Invalid quantity stored in cart.",
      });
    }

    // ---------------------------------------------------
    // 2. REMOVE ALL QUANTITIES
    // ---------------------------------------------------
    if (removeAll === true) {
      user.cart = user.cart.filter((item) => item.foodId.toString() !== foodId);

      await user.save();

      console.info("[CART] removeFromCart - Item removed completely:", foodId);

      return res.status(200).json({
        success: true,
        message: "Item removed completely from cart.",
        cart: user.cart,
      });
    }

    // ---------------------------------------------------
    // 3. REMOVE ONE QUANTITY
    // ---------------------------------------------------

    // If quantity > 1, reduce by 1 but never go below 1
    if (cartItem.quantity > 1) {
      cartItem.quantity = cartItem.quantity - 1;

      // Prevent negative values even if somehow corrupted
      if (cartItem.quantity < 1) {
        cartItem.quantity = 1;
      }

      await user.save();

      console.info("[CART] removeFromCart - Reduced quantity:", {
        foodId,
        qty: cartItem.quantity,
      });

      return res.status(200).json({
        success: true,
        message: "Item quantity reduced.",
        cart: user.cart,
      });
    }

    // ---------------------------------------------------
    // 4. Quantity is exactly 1 → Remove item fully
    // ---------------------------------------------------

    user.cart = user.cart.filter((item) => item.foodId.toString() !== foodId);

    await user.save();

    console.info(
      "[CART] removeFromCart - Quantity was 1 → item removed:",
      foodId
    );

    return res.status(200).json({
      success: true,
      message: "Item removed from cart.",
      cart: user.cart,
    });
  } catch (err) {
    console.error("[CART] removeFromCart - Unexpected error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error while removing item from cart.",
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
