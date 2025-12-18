/*
PROMPT
async function placeOrder(req, res) {
in a gist this function sends the orider to the db
before this function executes we have the auth middleware which gives passes request in the form of this :
 req.user = {
  id: "6940c9ed3f82a330b9e7a514",
  name: "Penny",
  email: "penny@example.com",
  role: "USER"
};
now next would be get the cart items from user schema (fetch user using user ID)
now you will have food id and qty , based on that i want you to calculate whatever you need (totals /subtotals etc...)
you can also make a request to the food table if you want or you figure out a better way to do it
send this to the db (using OrderModel)
display a toast if sucessful
+ general instructions attatched
}
*/

// USAGE (2 lines)
// placeOrder() — Creates a new order for the logged-in user.
// Requires deliveryInfo + valid access token; stores full order snapshot in DB.

// placeOrder(req, res)
// Creates a new order for the logged-in user using their cart + delivery info.

import OrderModel from "../models/order.model.js";
import { UserModel } from "../models/user.model.js";
import FoodModel from "../models/food.model.js";

async function placeOrder(req, res) {
  try {
    console.info("[placeOrder] START for user:", req.user.email);

    const userId = req.user.id;
    const { deliveryInfo } = req.body;

    // -----------------------------
    // 1️⃣ VALIDATE DELIVERY INFO
    // -----------------------------
    const required = ["firstName", "email", "phone", "pincode"];
    for (const f of required) {
      if (!deliveryInfo?.[f]) {
        return res.status(400).json({
          success: false,
          message: `Missing delivery field: ${f}`,
        });
      }
    }

    // -----------------------------
    // 2️⃣ FETCH USER + CART
    // -----------------------------
    const user = await UserModel.findById(userId).populate(
      "cart.foodId",
      "name price _id"
    );

    if (!user) {
      console.warn("[placeOrder] User not found:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.cart.length) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    // -----------------------------
    // 3️⃣ BUILD ORDER ITEMS
    // -----------------------------
    let subtotal = 0;
    const orderItems = [];

    for (const item of user.cart) {
      if (!item.foodId) {
        console.error("[placeOrder] Corrupted cart item:", item);
        continue;
      }

      const price = Number(item.foodId.price);
      const qty = Number(item.quantity);
      const totalItemPrice = price * qty;

      subtotal += totalItemPrice;

      orderItems.push({
        foodId: item.foodId._id,
        name: item.foodId.name,
        price,
        quantity: qty,
        totalItemPrice,
      });
    }

    const deliveryFee = subtotal >= 1000 ? 0 : 50;
    const totalAmount = subtotal + deliveryFee;

    // -----------------------------
    // 4️⃣ CREATE ORDER
    // -----------------------------
    const order = await OrderModel.create({
      userId,
      userName: req.user.name,
      items: orderItems,
      deliveryInfo,
      subtotal,
      deliveryFee,
      totalAmount,
      paymentSuccessful: true,
      paymentTimestamp: new Date(),
      orderStatus: "completed",
    });

    console.info("[placeOrder] ORDER SAVED:", order._id);

    // -----------------------------
    // 5️⃣ CLEAR CART
    // -----------------------------
    user.cart = [];
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      orderId: order._id,
      totalAmount,
    });
  } catch (err) {
    console.error("[placeOrder] ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to place order.",
      error: err.message,
    });
  }
}

async function makePayment(req, res) {}
export { makePayment, placeOrder };
