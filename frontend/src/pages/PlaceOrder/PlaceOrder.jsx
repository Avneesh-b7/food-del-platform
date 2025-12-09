import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext.jsx";

function PlaceOrder() {
  const { cartItems, totalAmount, itemsInCart, deliveryFee } =
    useContext(StoreContext);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* ==================== LEFT SECTION (FORM) ==================== */}
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Delivery Information
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First name"
            className="border p-2 rounded-lg text-sm focus:border-red-500 outline-none"
          />
          <input
            type="text"
            placeholder="Last name"
            className="border p-2 rounded-lg text-sm focus:border-red-500 outline-none"
          />
        </div>

        <div className="mt-4 space-y-3">
          <input
            type="text"
            placeholder="Street & Address"
            className="border w-full p-2 rounded-lg text-sm focus:border-red-500 outline-none"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="border w-full p-2 rounded-lg text-sm focus:border-red-500 outline-none"
          />

          <input
            type="number"
            placeholder="Pin Code"
            className="border w-full p-2 rounded-lg text-sm focus:border-red-500 outline-none"
          />

          <input
            type="text"
            placeholder="City"
            className="border w-full p-2 rounded-lg text-sm focus:border-red-500 outline-none"
          />

          <input
            type="text"
            placeholder="Country"
            className="border w-full p-2 rounded-lg text-sm focus:border-red-500 outline-none"
          />

          <input
            type="number"
            placeholder="Phone Number"
            className="border w-full p-2 rounded-lg text-sm focus:border-red-500 outline-none"
          />
        </div>

        <button className="mt-6 w-full bg-gray-700 hover:bg-red-500 text-white py-2 rounded-lg font-medium">
          Save & Continue
        </button>
      </div>

      {/* ================= RIGHT SECTION (ORDER SUMMARY) ================= */}
      <div className="bg-white border rounded-xl shadow-sm p-6 h-fit">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>

        <div className="space-y-3 mb-6">
          {itemsInCart.map((item) => (
            <div
              className="flex justify-between text-sm text-gray-700"
              key={item._id}
            >
              <span>
                {item.name} × {cartItems[item._id]}
              </span>
              <span>₹{item.price * cartItems[item._id]}</span>
            </div>
          ))}
        </div>

        <hr className="border-gray-300 my-4" />

        <div className="flex justify-between text-sm text-gray-700">
          <span>Subtotal</span>
          <span>₹{totalAmount}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-700 mt-2">
          <span>Delivery Fee</span>
          <span
            className={deliveryFee === 0 ? "text-green-600 font-semibold" : ""}
          >
            {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
          </span>
        </div>

        <div className="flex justify-between text-base font-bold text-gray-900 border-t mt-4 pt-4">
          <span>Total</span>
          <span>₹{totalAmount + deliveryFee}</span>
        </div>

        <button className="mt-6 w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg font-medium">
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}

export { PlaceOrder };
