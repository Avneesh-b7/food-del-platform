import { UserModel } from "./user.model.js";
import FoodModel from "./food.model.js";
import mongoose from "mongoose";

// PROMPT
// const OrderSchema = new mongoose.Schema({});
// i need to store all orders for a particular user here
// one document for each order
// the document should have the userID , user name , items that user has ordered, quantity of items,
// total amount of the cart , amount of each item
// another feild should be is the payment sucessfull or not (so true /false)
// timestamp of payment
// another feild for if the order is: ( completed / cancelled or in progress )
//-- make sure to handle errors gracefully
//-- ensure production grade code quality
// make sure to include apropriate validations

// ------------------------------
// SUB-SCHEMA: Order Item
// ------------------------------
const OrderItemSchema = new mongoose.Schema(
  {
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "food",
      required: [true, "Food item ID is required"],
    },
    name: {
      type: String,
      required: [true, "Food item name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    totalItemPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

// ------------------------------
// SUB-SCHEMA: Delivery Info
// ------------------------------
const DeliveryInfoSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastName: {
      type: String,
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

    address: {
      type: String,
      trim: true,
      maxlength: [200, "Address too long"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      match: [/^\d{5,6}$/, "Invalid pincode format"],
    },

    city: {
      type: String,
      trim: true,
      minlength: [2, "City must be at least 2 characters"],
      maxlength: [50, "City cannot exceed 50 characters"],
    },

    country: {
      type: String,
      trim: true,
      default: "India",
      minlength: [2, "Country must be at least 2 characters"],
      maxlength: [50, "Country cannot exceed 50 characters"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
  },
  { _id: false }
);

// ------------------------------
// MAIN ORDER SCHEMA
// ------------------------------
const OrderSchema = new mongoose.Schema(
  {
    // 1️⃣ USER REFERENCE
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User ID is required"],
      index: true,
    },

    userName: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
    },

    // 2️⃣ ITEMS
    items: {
      type: [OrderItemSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Order must contain at least one item",
      },
    },

    // 3️⃣ DELIVERY INFO
    deliveryInfo: {
      type: DeliveryInfoSchema,
      required: [true, "Delivery information is required"],
    },

    // 4️⃣ BILLING
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // 5️⃣ PAYMENT
    paymentSuccessful: {
      type: Boolean,
      default: false,
    },
    paymentTimestamp: {
      type: Date,
      default: null,
    },

    // 6️⃣ ORDER STATUS
    orderStatus: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// {
//   "_id": "6940c9ed3f82a330b9e7a514",
//   "userId": "693f92bbdc61f3046e55d9e0",
//   "userName": "Penny",
//   "items": [
//
//     {
//       "foodId": "693b879582ec5d492d34a62b",
//       "name": "Veg Burger",
//       "price": 120,
//       "quantity": 1,
//       "totalItemPrice": 120
//     }
//   ],
//   "deliveryInfo": {
//     "firstName": "Penny",
//     "lastName": "Harrington",
//     "address": "221B Baker Street",
//     "email": "penny@example.com",
//     "pincode": "560001",
//     "city": "Bangalore",
//     "country": "India",
//     "phone": "9876543210"
//   },
//   "subtotal": 518,
//   "deliveryFee": 50,
//   "totalAmount": 568,
//   "paymentSuccessful": true,
//   "paymentTimestamp": "2025-02-15T12:45:12.000Z",
//   "orderStatus": "completed",
//   "createdAt": "2025-02-15T12:44:50.000Z",
//   "updatedAt": "2025-02-15T12:45:12.000Z",
//   "__v": 0
// }

const OrderModel =
  mongoose.models.order || mongoose.model("order", OrderSchema);

export default OrderModel;
