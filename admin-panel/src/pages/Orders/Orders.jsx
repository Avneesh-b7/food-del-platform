/*
//PROMPT 
1. so this the orders page of the admin panel frontend 
2. here i want to list all the orders in the db
3. i want to be able to (as an admin) select and update order statuses 
4. the varipus order status that can be put in the backend are:     
orderStatus: {
      type: String,
      enum: [
        "out for delivery",
        "preparing food",
        "completed",
        "cancelled",
        "accepted",
      ],
      default: "accepted",
    }
5. to update a order status send the update request to api post : /api/v1/orders/admin/updatestatus
6. to list all the orders in the system we do api get : /api/v1/orders/admin/list 
7. here are the routes: paymentRouter.get("/admin/list", listAll); paymentRouter.post("/admin/updatestatus", updateStatus);
8. also make sure to incorporate delivery informatin here 
9. here is how the order document looks like - {order document here}

*/

// ================================
// Admin Orders Page (Standalone Version)
// No StoreContext, uses constants.js
// ================================

import React, { useState, useEffect } from "react";
import { URL } from "../../../constants.js";
import { toast } from "react-toastify";
import axios from "axios";

// Status color mapping
const statusColors = {
  accepted: "bg-blue-100 text-blue-700",
  "preparing food": "bg-yellow-100 text-yellow-700",
  "out for delivery": "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

// Skeleton Loader
const OrderSkeleton = () => (
  <div className="animate-pulse bg-gray-100 rounded-xl p-6 mb-4 shadow-sm">
    <div className="h-6 bg-gray-300 w-1/3 rounded mb-4"></div>
    <div className="h-4 bg-gray-300 w-1/2 rounded mb-2"></div>
    <div className="h-4 bg-gray-300 w-2/3 rounded mb-4"></div>
    <div className="h-20 bg-gray-200 rounded"></div>
  </div>
);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==============================
  // 1️⃣ Fetch All Orders on Load
  // ==============================
  async function fetchOrders() {
    try {
      setLoading(true);

      const res = await axios.get(`${URL}/orders/admin/list`);

      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (err) {
      console.error("[Admin Orders] Error:", err);
      toast.error(
        err?.response?.data?.message || "Server error fetching orders"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  // ===================================
  // 2️⃣ Update Order Status (Admin Only)
  // ===================================
  async function updateOrderStatus(orderId, newStatus) {
    try {
      const res = await axios.post(`${URL}/orders/admin/updatestatus`, {
        orderId,
        status: newStatus,
      });

      if (res.data.success) {
        toast.success("Order status updated");
        fetchOrders(); // Refresh list
      } else {
        toast.error(res.data.message || "Failed to update order");
      }
    } catch (err) {
      console.error("[UpdateStatus] Error:", err);
      toast.error("Error updating order status");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>

      {loading ? (
        <>
          <OrderSkeleton />
          <OrderSkeleton />
          <OrderSkeleton />
        </>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center text-lg mt-20">
          No orders found.
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-xl p-6 shadow-md bg-white"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Order #{order._id.slice(-6)}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Placed: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[order.orderStatus] ||
                    "bg-gray-200 text-gray-700"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>

              {/* USER INFO */}
              <div className="mt-4 text-sm text-gray-700">
                <p>
                  <strong>User:</strong> {order.userName}
                </p>
                <p>
                  <strong>Email:</strong> {order.deliveryInfo.email}
                </p>
                <p>
                  <strong>Phone:</strong> {order.deliveryInfo.phone}
                </p>
                <p>
                  <strong>Address:</strong> {order.deliveryInfo.address},{" "}
                  {order.deliveryInfo.city}, {order.deliveryInfo.country} -{" "}
                  {order.deliveryInfo.pincode}
                </p>
              </div>

              {/* ORDER ITEMS */}
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Items</h3>

                <div className="space-y-2 text-sm">
                  {order.items.map((item) => (
                    <div key={item.foodId} className="flex justify-between">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>₹{item.totalItemPrice}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOTALS */}
              <div className="mt-4 text-sm text-gray-700">
                <p>
                  <strong>Subtotal:</strong> ₹{order.subtotal}
                </p>
                <p>
                  <strong>Delivery Fee:</strong>{" "}
                  {order.deliveryFee === 0 ? (
                    <span className="text-green-600 font-semibold">Free</span>
                  ) : (
                    `₹${order.deliveryFee}`
                  )}
                </p>
                <p className="text-lg font-bold mt-1">
                  Total: ₹{order.totalAmount}
                </p>
              </div>

              {/* STATUS UPDATE */}
              <div className="mt-6 flex items-center gap-4">
                <select
                  className="border px-3 py-2 rounded-lg"
                  value={order.orderStatus}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                >
                  <option value="accepted">Accepted</option>
                  <option value="preparing food">Preparing Food</option>
                  <option value="out for delivery">Out For Delivery</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  onClick={() =>
                    updateOrderStatus(order._id, order.orderStatus)
                  }
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
