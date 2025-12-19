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

/*
PROMPTS
this is the function : async function listOrders(req, res) {}
# here are some things to keep in mind -->
1. before this function executes we have the auth middleware which gives passes request in the form of this :
 req.user = {
  id: "6940c9ed3f82a330b9e7a514",
  name: "Penny",
  email: "penny@example.com",
  role: "USER"
};
2. this functions takes the user id and searches the orders table for all the orders by that user 
3. this is how the order document looks like -- {order document here pasted}
4. retunrns all the relevant info to be displayed in the front end

# general instructions 
{prompts.md here}
*/

// USAGE: listOrders() returns all orders belonging to the logged-in user.
// This function expects req.user.id (added by authMiddleware).

async function listOrders(req, res) {
  console.info("[listOrders] START");

  try {
    // ----------------------------------------
    // 1️⃣ VALIDATION: Ensure user exists in req
    // ----------------------------------------
    if (!req.user || !req.user.id) {
      console.warn("[listOrders] Missing req.user – auth middleware failure");
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User data not found.",
      });
    }

    const userId = req.user.id;
    console.info("[listOrders] Fetching orders for user:", userId);

    // ----------------------------------------
    // 2️⃣ QUERY ORDERS FROM DB
    // ----------------------------------------
    const orders = await OrderModel.find({ userId })
      .sort({ createdAt: -1 }) // latest first
      .lean(); // faster read-only docs

    // ----------------------------------------
    // 3️⃣ HANDLE CASE: No orders
    // ----------------------------------------
    if (!orders || orders.length === 0) {
      console.info("[listOrders] No orders found for user:", userId);

      return res.status(200).json({
        success: true,
        message: "No orders found for this user.",
        orders: [],
      });
    }

    // ----------------------------------------
    // 4️⃣ SUCCESS RESPONSE
    // ----------------------------------------
    console.info(`[listOrders] Found ${orders.length} orders for user`);

    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully.",
      orders,
    });
  } catch (err) {
    // ----------------------------------------
    // 5️⃣ ERROR HANDLING
    // ----------------------------------------
    console.error("[listOrders] ERROR:", err.message || err);

    return res.status(500).json({
      success: false,
      message: "Server error while retrieving orders.",
      error: err.message,
    });
  }
}

/*
sample output to list orders looks like this -->
{
  "success": true,
  "message": "Orders retrieved successfully.",
  "orders": [
    {
      "_id": "6944eebd3db5eb280f273e65",
      "userId": "6944cc8a0a177a015c33538a",
      "userName": "a1",
      "items": [
        {
          "foodId": "693bdb145cb6cdac9f7d2b88",
          "name": "paneer burger",
          "price": 399,
          "quantity": 1,
          "totalItemPrice": 399
        }
      ],
      "deliveryInfo": {
        "firstName": "Cooper",
        "lastName": "Cooper",
        "address": "princeton",
        "email": "admin@gmail.com",
        "pincode": "90099",
        "city": "princeton",
        "country": "USA",
        "phone": "9826929589"
      },
      "subtotal": 399,
      "deliveryFee": 50,
      "totalAmount": 449,
      "paymentSuccessful": true,
      "paymentTimestamp": "2025-12-19T06:20:44.999Z",
      "orderStatus": "completed",
      "createdAt": "2025-12-19T06:20:45.006Z",
      "updatedAt": "2025-12-19T06:20:45.006Z"
    }
  ]
}
*/

async function makePayment(req, res) {}

export { makePayment, placeOrder, listOrders };
