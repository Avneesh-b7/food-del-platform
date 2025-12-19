import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

/* ============================
   SKELETON LOADER COMPONENT
   ============================ */
const OrderSkeleton = () => {
  return (
    <div className="border rounded-lg bg-white shadow-sm p-5 animate-pulse">
      <div className="h-5 bg-gray-300 rounded w-1/2 mb-4"></div>

      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>

      <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
    </div>
  );
};

/* ============================
      MAIN COMPONENT
   ============================ */
const ListOrders = () => {
  const { accessToken, base_url } = useContext(StoreContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ============================
      FETCH USER ORDERS
     ============================ */
  async function loadOrders() {
    try {
      if (!accessToken) {
        toast.error("Please log in to view orders.");
        return;
      }

      const res = await axios.get(`${base_url}/orders/list`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        toast.error(res.data.message || "Failed to load orders");
      }
    } catch (err) {
      console.error("[ListOrders] Error:", err);
      toast.error(
        err?.response?.data?.message || "Unable to fetch orders right now."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      {/* ==================================
          LOADING STATE → Skeletons
       ================================== */}
      {loading ? (
        <div className="space-y-5 max-h-[70vh] overflow-y-auto">
          <OrderSkeleton />
          <OrderSkeleton />
          <OrderSkeleton />
        </div>
      ) : orders.length === 0 ? (
        /* ==================================
            EMPTY STATE
         ================================== */
        <p className="text-gray-600 text-center py-10">
          You haven't placed any orders yet.
        </p>
      ) : (
        /* ==================================
            ORDERS LIST
         ================================== */
        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg bg-white shadow-sm p-5"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-gray-800">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h2>

                <span
                  className={`text-sm px-3 py-1 rounded-full 
                      ${
                        order.orderStatus === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.orderStatus === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : order.orderStatus === "preparing food"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.orderStatus === "out for delivery"
                          ? "bg-blue-100 text-blue-700"
                          : order.orderStatus === "accepted"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-gray-100 text-gray-600"
                      }
                    `}
                >
                  {order.orderStatus}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div
                    key={item.foodId}
                    className="flex justify-between text-sm text-gray-700"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>₹{item.totalItemPrice}</span>
                  </div>
                ))}
              </div>

              <hr className="border-gray-200 my-3" />

              {/* Totals */}
              <div className="flex justify-between text-sm text-gray-700 mb-1">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-700 mb-1">
                <span>Delivery</span>
                <span>
                  {order.deliveryFee === 0 ? "Free" : `₹${order.deliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between font-bold text-gray-900 text-base mt-2">
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>

              {/* Payment Status */}
              <p className="text-sm text-gray-600 mt-3">
                Payment:{" "}
                <span
                  className={
                    order.paymentSuccessful
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {order.paymentSuccessful ? "Successful" : "Failed"}
                </span>
              </p>

              {/* Date */}
              <p className="text-xs text-gray-500 mt-1">
                Ordered on:{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { ListOrders };
