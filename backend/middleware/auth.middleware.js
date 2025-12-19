import express from "express";

//PROMPT
//auth middleware
// async function authMiddleware(req, res, next) {
//   //check if the req coming in has an access token
//   // check if the token is valid
//   // handle errors gracefully and give the appropriate req and response
//   // handle for all scenarios
//   // makke this production grade quality
// }

// import jwt from "jsonwebtoken";

// export async function authMiddleware(req, res, next) {
//   try {
//     // ---------------------------------------
//     // 1. Check if Authorization header exists
//     // ---------------------------------------
//     const authHeader = req.headers["authorization"];

//     if (!authHeader) {
//       console.warn("[AUTH] Missing Authorization header");
//       return res.status(401).json({
//         success: false,
//         message: "Authentication required. No token provided.",
//       });
//     }

//     // Authorization header format → "Bearer <token>"
//     const parts = authHeader.split(" ");
//     if (parts.length !== 2 || parts[0] !== "Bearer") {
//       console.warn("[AUTH] Invalid Authorization header format:", authHeader);
//       return res.status(401).json({
//         success: false,
//         message: "Invalid authorization format. Expected 'Bearer <token>'.",
//       });
//     }

//     const token = parts[1];

//     // ---------------------------------------
//     // 2. Verify the token
//     // ---------------------------------------
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//       console.log(decoded);
//     } catch (err) {
//       console.error("[AUTH] Acccess Token verification failed:", err.message);

//       if (err.name === "TokenExpiredError") {
//         return res.status(401).json({
//           success: false,
//           message: "Access token expired. Please log in again.",
//         });
//       }

//       return res.status(401).json({
//         success: false,
//         message: "Invalid access token.",
//       });
//     }

//     // ---------------------------------------
//     // 3. Attach decoded info to req.user
//     // ---------------------------------------
//     req.user = {
//       id: decoded.id,
//       name: decoded.name,
//       email: decoded.email,
//       role: decoded.role,
//     };

//     // Optional debugging log
//     console.info("[AUTH] Token valid for user:", req.user.email);

//     // Move to next handler
//     next();
//   } catch (err) {
//     console.error("[AUTH] Unexpected error:", err.message || err);

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error during authentication.",
//     });
//   }
// }

// CHAT GPT
// FINAL SUMMARY (Super Clear)
// ✔ Frontend sends the token → backend
// ✔ Backend decodes token → creates req.user
// ✔ req.user is backend-only
// ✔ Controllers send JSON responses → frontend
// ✔ Frontend stores user data itself (localStorage or React Context)

import jwt from "jsonwebtoken";

export async function authMiddleware(req, res, next) {
  try {
    // ---------------------------------------
    // 1. Check for Authorization header
    // ---------------------------------------
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      console.warn("[AUTH] Missing Authorization header");

      return res.status(401).json({
        success: false,
        error: "NO_TOKEN",
        message: "Authentication required. No token provided.",
      });
    }

    // Format → "Bearer <token>"
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      console.warn("[AUTH] Invalid auth format:", authHeader);

      return res.status(401).json({
        success: false,
        error: "INVALID_FORMAT",
        message: "Invalid authorization header format.",
      });
    }

    // ---------------------------------------
    // 2. Verify Access Token
    // ---------------------------------------
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      console.error("[AUTH] Token verification failed:", err.message);

      // Token expired → frontend should trigger refresh
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          error: "ACCESS_TOKEN_EXPIRED",
          message: "Access token expired.",
        });
      }

      // Any other error
      return res.status(401).json({
        success: false,
        error: "INVALID_ACCESS_TOKEN",
        message: "Invalid access token.",
      });
    }

    // ---------------------------------------
    // 3. Attach user info to req.user
    // ---------------------------------------
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };

    console.info("[AUTH] Token valid for:", req.user.email);

    // ---------------------------------------
    // 4. Continue to next controller
    // ---------------------------------------
    return next();
  } catch (err) {
    console.error("[AUTH] Unexpected error:", err);

    return res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: "Internal server error during authentication.",
    });
  }
}
