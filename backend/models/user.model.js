import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//PROMPT
// const UserSchema = new mongoose.Schema({
//   // 1. we have 4 feilds - name , email , password and timestamp
//   // 2. add appropriate validators
//   // 3. make is safe and production grade (keep security in mind)
//   // 4. use encryptions where necessary
//   // 5. i also need session management so maybe use jwt
//    // 6. handle errors gracefully
// });

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },

    // Refresh token (session persistence)
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },

    refreshTokenExpiry: {
      type: Date,
      default: null,
      select: false,
    },

    //  CART STRUCTURE
    cart: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "food", // This connects to your Food model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

//generate access tokens
UserSchema.methods.generateAccessToken = function () {
  try {
    return jwt.sign(
      { id: this._id, email: this.email, name: this.name, role: this.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3m" }
    );
  } catch (err) {
    console.error("Access token error:", err);
    return null;
  }
};

//refresh token
UserSchema.methods.generateRefreshToken = function () {
  try {
    const token = jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7m",
    });

    // store it on the user model
    this.refreshToken = token;
    this.refreshTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    return token;
  } catch (err) {
    console.error("Refresh token error:", err);
    return null;
  }
};

// prehook to save pw
UserSchema.pre("save", async function (next) {
  try {
    // If password is not modified, skip hashing
    if (!this.isModified("password")) {
      return;
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    console.error("Error hashing password:", err);
  }
});

//comparing pw
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    console.error("Error comparing password:", err);
    return false; // safest fallback
  }
};

const UserModel = mongoose.model.user || mongoose.model("user", UserSchema);

export { UserModel };
