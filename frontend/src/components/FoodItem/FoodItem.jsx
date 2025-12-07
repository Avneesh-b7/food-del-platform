import React from "react";

function FoodItem({ id, name, image, price, description, category }) {
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
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <span className="shrink-0 text-lg font-bold text-green-600">
              ₹{price}
            </span>
          </div>

          <p className="text-s text-gray-500">{description}</p>

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
