import { UserModel } from "../models/user.model.js";
import express from "express";

//PROMPT
// function registerUser(req, res) {
// take the data coming from frontend (name , email, role and password)
// validate the data (or you tell me should we do it in another file ? how is it done in production grade software ?)
// check in the db if the user already exists
// if not then save the new user (once saved generate access and refresh tokens)
// we need to send access token to client and save refresh token to db
// send appropriate responses and handle errors gracefully (production grade error handling )
// this also needs to be secure (make it secure from a safety perspective)
// }

// {
// "name":"test123",
// "email":"abc@gmail.com",
// "role":"ADMIN",
// "pw":"thisisatestpw12345"
// }

async function registerUser(req, res) {
  try {
    const { name, email, role, password } = req.body;

    //   1. Basic Input Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    // Email format check (minimal)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    //  * 2. Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    //  * 3. Create & Save New User
    const user = new UserModel({
      name,
      email,
      password, // will be hashed by pre-save hook
      role: role || "user",
    });

    // Save user (triggers password hashing)
    await user.save();

    //generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    if (!accessToken || !refreshToken) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate tokens.",
      });
    }

    // save refresh token to db
    await user.save(); // saves refreshToken + expiry

    // send response
    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      // refreshToken is NOT sent inside "user" object
      // but returned separately so frontend can store it
      refreshToken,
    });
  } catch (err) {
    console.error("Register user error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error while registering user.",
      error: err.message,
    });
  }
}

function loginUser(req, res) {
  return res.send("sucess req here at login !");
}

export { loginUser, registerUser };
