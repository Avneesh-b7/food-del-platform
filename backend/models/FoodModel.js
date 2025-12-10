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

const FoodModel = mongoose.models.foods || mongoose.model("foods", FoodSchema);

export default FoodModel;
