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
      orderStatus: "accepted",
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

/*
PROMPTS 
so help me write the listAll function in order.controllers.js
1. this queries all the orders from the orders document in the db
2. returns all the  required info to the admin panel 
3. general prompts are: 
*/
// ================================================
// listAll()
// USAGE: Fetches ALL orders in the system for admin panel.
// Returns complete order details sorted by newest first.
// ================================================

async function listAll(req, res) {
  console.info("[Admin][listAll] Fetching all orders...");

  try {
    // ==========================================
    // 1️⃣ Fetch all orders sorted by createdAt DESC
    // ==========================================
    const orders = await OrderModel.find({}).sort({ createdAt: -1 }).lean(); // lean() = faster, returns plain JS objects

    // ==========================================
    // 2️⃣ If no orders found
    // ==========================================
    if (!orders || orders.length === 0) {
      console.warn("[Admin][listAll] No orders found in database");
      return res.status(200).json({
        success: true,
        message: "No orders found.",
        orders: [],
      });
    }

    // ==========================================
    // 3️⃣ Return orders
    // ==========================================
    console.info(`[Admin][listAll] Found ${orders.length} orders`);
    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    // ==========================================
    // 4️⃣ ERROR HANDLING
    // ==========================================
    console.error("[Admin][listAll] Unexpected Error:", err.message || err);

    return res.status(500).json({
      success: false,
      message: "Server error while retrieving orders.",
      error: err.message || "Unknown error",
    });
  }
}

/*
PROMPTS 
so help me write the updateStatus function in order.controllers.js
1. this sends a particular order id (which has the status updated) as a part of the request
2. updates the status change in the backend
3. general prompts are: 
*/
// ======================================================================
// updateStatus()
// USAGE: Admin updates the orderStatus of a specific order.
// Request Body: { "orderId": "...", "status": "completed" }
// ======================================================================

async function updateStatus(req, res) {
  console.info("[Admin][updateStatus] Incoming request:", req.body);

  try {
    const { orderId, status } = req.body;

    // -------------------------------
    // 1️⃣ VALIDATE INPUT
    // -------------------------------
    if (!orderId || !status) {
      console.warn("[Admin][updateStatus] Missing fields");
      return res.status(400).json({
        success: false,
        message: "orderId and status are required.",
      });
    }

    // Allowed statuses
    const allowedStatuses = [
      "out for delivery",
      "preparing food",
      "completed",
      "cancelled",
      "accepted",
    ];

    if (!allowedStatuses.includes(status)) {
      console.warn("[Admin][updateStatus] Invalid status:", status);
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed statuses are: ${allowedStatuses.join(
          ", "
        )}.`,
      });
    }

    // -------------------------------
    // 2️⃣ FIND & UPDATE ORDER
    // -------------------------------
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true } // return updated document
    );

    if (!updatedOrder) {
      console.warn("[Admin][updateStatus] Order not found:", orderId);
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    console.info(`[Admin][updateStatus] Order ${orderId} updated → ${status}`);

    // -------------------------------
    // 3️⃣ SUCCESS RESPONSE
    // -------------------------------
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order: updatedOrder,
    });
  } catch (err) {
    // -------------------------------
    // 4️⃣ ERROR HANDLING
    // -------------------------------
    console.error(
      "[Admin][updateStatus] Unexpected Error:",
      err.message || err
    );

    return res.status(500).json({
      success: false,
      message: "Server error while updating order status.",
      error: err.message,
    });
  }
}

export { placeOrder, listOrders, listAll, updateStatus };
