import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true, // URL required
    },

    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const FoodModel = mongoose.models.food || mongoose.model("food", FoodSchema);

export default FoodModel;
