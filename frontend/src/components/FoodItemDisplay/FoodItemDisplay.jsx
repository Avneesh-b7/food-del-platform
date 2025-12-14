import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext.jsx";
import { FoodItem } from "../FoodItem/FoodItem.jsx";

function FoodItemDisplay({ category, setCategory }) {
  const { foodItemsList } = useContext(StoreContext);

  const filtered_array = foodItemsList.filter(function filterFunc(food_item) {
    if (category == "all") {
      return foodItemsList;
    }

    if (food_item.category === category) {
      return true;
    } else {
      return false;
    }
  });

  return (
    <div className="w-full px-10 mt-10">
      <h2 className="text-3xl font-bold text-gray-700 mb-6">
        Menu Items in {category}{" "}
      </h2>

      <div className="grid grid-cols-4 gap-8">
        {filtered_array.map((food_item) => (
          <FoodItem
            key={food_item._id}
            id={food_item._id}
            name={food_item.name}
            image={food_item.image}
            price={food_item.price}
            description={food_item.description}
            category={food_item.category}
          />
        ))}
      </div>
    </div>
  );
}

export { FoodItemDisplay };
