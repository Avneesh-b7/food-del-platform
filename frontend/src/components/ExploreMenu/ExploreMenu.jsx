import React, { useState } from "react";
import { menu_list } from "../../assets/assets.js";

function ExploreMenu({ category, setCategory }) {
  return (
    <>
      <div
        className="w-full flex flex-col items-center mt-12"
        id="explore-menu-id"
      >
        {/* Top text */}
        <h2 className="text-4xl font-bold text-gray-800">Explore Our Menu</h2>

        <p className="text-gray-500 text-center mt-3 w-[60%]">
          Discover a variety of delicious dishes thoughtfully prepared using
          fresh ingredients. Whether you’re craving something spicy, cheesy, or
          sweet – we’ve got something for every taste!
        </p>

        {/* Card Grid */}
        <div className="grid grid-cols-6 gap-8 mt-10">
          {menu_list.map((list_element, index) => {
            return (
              <div
                key={index}
                className={`flex flex-col items-center p-4 rounded-md cursor-pointer transition-all duration-300 ease-out 
                            ${
                              category === list_element.name
                                ? "scale-110 shadow-xl border border-red-500"
                                : "border border-gray-200"
                            }`}
                onClick={() => {
                  if (category === list_element.name) {
                    setCategory("all");
                  } else {
                    setCategory(list_element.name);
                  }
                }}
              >
                <img
                  src={list_element.img}
                  alt={list_element.name}
                  className="w-32 h-32 object-cover rounded-full border-[3px] border-transparent hover:border-red-500 transition-all duration-300"
                />
                <h3 className="text-md font-semibold mt-3 text-center text-gray-700">
                  {list_element.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ExploreMenu;
