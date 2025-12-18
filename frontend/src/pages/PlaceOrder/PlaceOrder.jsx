import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext.jsx";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

function PlaceOrder() {
  const {
    cartItems,
    totalAmount,
    itemsInCart,
    deliveryFee,
    base_url,
    accessToken,
    setCartItems,
    loadCartFromDB,
  } = useContext(StoreContext);

  const [deliveryInfo, setDeliveryInfo] = useState({
    deliveryInfo: {
      firstName: "", //req
      lastName: "",
      address: "",
      email: "", //req
      pincode: "", //req
      city: "",
      phone: "", //req
      country: "",
    },
    paymentStatus: true,
  });

  async function handlePlaceOrder() {
    console.info("[PlaceOrder] Starting order placement...");

    try {
      const info = deliveryInfo.deliveryInfo;

      // ---------------------------
      // 1️⃣ VALIDATIONS
      // ---------------------------
      if (!info.firstName || !info.email || !info.pincode || !info.phone) {
        toast.error("Please fill all required fields.");
        return;
      }

      if (!accessToken) {
        toast.error("Please login to place an order.");
        return;
      }

      if (itemsInCart.length === 0) {
        toast.error("Your cart is empty.");
        return;
      }

      // ---------------------------
      // 2️⃣ REQUEST BODY
      // ---------------------------
      const payload = {
        deliveryInfo: info,
        paymentStatus: deliveryInfo.paymentStatus,
      };

      console.info("[PlaceOrder] Sending payload:", payload);

      // ---------------------------
      // 3️⃣ API CALL
      // ---------------------------
      const res = await axios.post(`${base_url}/orders/placeorder`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // ---------------------------
      // 4️⃣ HANDLE SUCCESS
      // ---------------------------
      if (res.data.success) {
        toast.success("Order placed successfully!");
        setCartItems({});
        setDeliveryInfo({});
        await loadCartFromDB();
        console.log("[PlaceOrder] Order response:", res.data);

        // Optional: redirect to success page
        // navigate(`/order-success/${res.data.orderId}`);
      } else {
        toast.error(res.data.message || "Order failed");
      }
    } catch (err) {
      // ---------------------------
      // 5️⃣ ERROR HANDLING
      // ---------------------------
      console.error("[PlaceOrder] Error placing order:", err);

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Server error while placing order.";

      toast.error(msg);
    }
  }

  // useEffect(() => {
  //   console.log(deliveryInfo);
  // }, [deliveryInfo]);

  function handleChange(e) {
    const { name, value } = e.target;

    setDeliveryInfo((prev) => ({
      ...prev,
      deliveryInfo: {
        ...prev.deliveryInfo,
        [name]: value,
      },
    }));
  }

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
            name="firstName"
            onChange={handleChange}
            value={deliveryInfo.deliveryInfo.firstName}
            placeholder="First name"
            className="border p-2 rounded-lg text-sm focus:border-red-500 outline-none"
          />
          <input
            type="text"
            onChange={handleChange}
            placeholder="Last name"
            value={deliveryInfo.deliveryInfo.lastName}
            name="lastName"
            className="border p-2 rounded-lg text-sm focus:border-red-500 outline-none"
          />
        </div>

        <div className="mt-4 space-y-3">
          <input
            type="text"
            onChange={handleChange}
            placeholder="Street & Address"
            value={deliveryInfo.deliveryInfo.address}
            name="address"
            className="border w-full p-2 rounded-lg text-sm focus:border-red-500 outline-none"
          />
          <input
            type="email"
            value={deliveryInfo.deliveryInfo.email}
            name="email"
            onChange={handleChange}
            placeholder="Email Address"
            className="border w-full p-2 rounded-lg text-sm focus:border-red-500 outline-none"
          />

          <input
            type="number"
            onChange={handleChange}
            placeholder="Pin Code"
            name="pincode"
            value={deliveryInfo.deliveryInfo.pincode}
            className="border w-full p-2 rounded-lg text-sm focus:border-red-500 outline-none"
          />

          <input
            type="text"
            onChange={handleChange}
            placeholder="City"
            value={deliveryInfo.deliveryInfo.city}
            name="city"
            className="border w-full p-2 rounded-lg text-sm focus:border-red-500 outline-none"
          />

          <input
            type="text"
            onChange={handleChange}
            name="country"
            value={deliveryInfo.deliveryInfo.country}
            placeholder="Country"
            className="border w-full p-2 rounded-lg text-sm focus:border-red-500 outline-none"
          />

          <input
            type="number"
            value={deliveryInfo.deliveryInfo.phone}
            onChange={handleChange}
            name="phone"
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

        <button
          onClick={handlePlaceOrder}
          className="mt-6 w-full bg-gray-700 hover:bg-red-500 text-white py-2 rounded-lg font-medium"
        >
          Place Your Order!
        </button>
      </div>
    </div>
  );
}

export { PlaceOrder };
