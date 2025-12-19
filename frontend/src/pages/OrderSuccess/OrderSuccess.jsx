import React from "react";
import { useParams, Link } from "react-router-dom";

const OrderSuccess = () => {
  const { orderId } = useParams(); // Get ID from URL

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-4xl">
            ✓
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Order Placed Successfully! 🎉
        </h1>

        {/* Order ID */}
        {orderId && (
          <p className="text-gray-600 text-sm mb-4">
            Your order ID:{" "}
            <span className="font-semibold text-gray-800">{orderId}</span>
          </p>
        )}

        {/* Message */}
        <p className="text-gray-500 mb-6">
          Thank you for shopping with QuickBite. You will receive updates about
          your order soon.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            to="/orders/myorders"
            className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-600 transition"
          >
            View My Orders
          </Link>

          <Link
            to="/"
            className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export { OrderSuccess };
