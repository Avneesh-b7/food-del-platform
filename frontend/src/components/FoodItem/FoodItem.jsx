import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext.jsx";

function FoodItem({ id, name, image, price, description, category }) {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  return (
    <>
      <div className="w-full max-w-xs rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
        {/* Image */}
        <div className="relative h-40 w-full overflow-hidden rounded-t-2xl">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700 backdrop-blur">
            {category}
          </span>

          {/* Plus button / counter on image */}
          {!cartItems[id] ? (
            <button
              onClick={() => {
                addToCart(id);
              }}
              className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white text-lg font-bold shadow-md hover:bg-green-500 transition-colors"
            >
              +
            </button>
          ) : (
            <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 shadow-md">
              <button
                onClick={() => {
                  removeFromCart(id);
                }}
                className="flex h-6 w-6 items-center justify-center rounded-full border bg-red-300 border-gray-300 text-sm font-bold text-gray-700 hover:bg-red-200"
              >
                -
              </button>
              <span className="min-w-6 text-center text-sm font-semibold text-gray-800">
                {cartItems[id]}
              </span>
              <button
                onClick={() => {
                  addToCart(id);
                }}
                className="flex h-6 w-6 items-center justify-center rounded-full border bg-green-300 border-gray-300 text-sm font-bold text-gray-700 hover:bg-green-200"
              >
                +
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <span className="shrink-0 text-lg font-bold text-green-600">
              ₹{price}
            </span>
          </div>

          <p className="text-sm text-gray-500">{description}</p>

          <button
            className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-red-700 px-3 py-2 
                       text-xs font-semibold text-white hover:bg-red-600 active:bg-red-700 
                       transition-colors duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}

export { FoodItem };
