import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { fooditems_list } from "../../assets/assets"; // <-- IMPORT STATICALLY
import { HashLink } from "react-router-hash-link";

function Cart() {
  const {
    fooditems_list,
    addToCart,
    removeFromCart,
    getItemCount,
    cartItems,
    setCartItems,
    totalAmount,
    itemsInCart,
    deleteItem,
    deliveryFee,
  } = useContext(StoreContext);

  const [promoCode, setPromoCode] = useState("");

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Cart</h1>

      {itemsInCart.length === 0 ? (
        <p className="text-gray-500 text-sm">
          Your cart is empty. Please add some food!
        </p>
      ) : (
        <>
          {/* Table header */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border">
            <div className="grid grid-cols-6 gap-3 border-b px-4 py-2 text-xs text-gray-500 font-semibold">
              <div className="col-span-2">Item</div>
              <div>Price</div>
              <div>Qty</div>
              <div>Total</div>
              <div className="text-right">Remove</div>
            </div>

            {/* Table rows */}
            {itemsInCart.map((item) => {
              const qty = cartItems[item._id];

              return (
                <div
                  key={item._id}
                  className="grid grid-cols-6 gap-3 px-4 py-3 border-b last:border-none items-center"
                >
                  {/* Image + Name */}
                  <div className="col-span-2 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <span className="text-sm font-semibold text-gray-800">
                      {item.name}
                    </span>
                  </div>

                  <div className="text-sm text-gray-700">₹{item.price}</div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="w-6 h-6 rounded-full border flex items-center justify-center hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="text-sm font-semibold">{qty}</span>
                    <button
                      onClick={() => addToCart(item._id)}
                      className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-500"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-sm font-semibold text-gray-900">
                    ₹{item.price * qty}
                  </div>

                  <button
                    className="ml-auto text-xl text-gray-400 hover:text-red-600"
                    onClick={() => deleteItem(item._id)}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom Area */}
          <div className="flex flex-col md:flex-row justify-between mt-8 gap-6">
            {/* BILL CARD */}
            <div className="w-full md:w-1/2 bg-white border shadow-sm rounded-lg p-4">
              <h2 className="text-sm font-bold text-gray-700 mb-3">
                Bill Summary
              </h2>

              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Subtotal:</span>
                <span>₹{totalAmount}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Delivery fee :</span>
                <span className="text-red-600">-₹{deliveryFee}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-gray-900 border-t mt-3 pt-3">
                <span>Total Payable</span>
                <span>₹{totalAmount + deliveryFee}</span>
              </div>

              <button className="w-full mt-4 bg-red-600 text-white py-2 rounded-full hover:bg-red-500 text-sm">
                <HashLink smooth to="/placeorder">
                  Proceed to Checkout
                </HashLink>
              </button>
            </div>

            {/* PROMO CODE */}
            <div className="w-full md:w-1/3 bg-white border shadow-sm rounded-lg p-4">
              <h2 className="text-sm font-bold text-gray-700 mb-3">
                Promo Code
              </h2>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />

                <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export { Cart };
