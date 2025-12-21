import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

async function verifyAccessToken(req, res) {
  return res.status(200).json({
    success: true,
    message: " Access Token valid",
    user: req.user, // from middleware
  });
}

// USAGE:
// POST /api/v1/auth/refresh-access-token
// Body: { refreshToken: "<token>" }

async function refreshAccessToken(req, res) {
  try {
    console.info("[REFRESH] Refresh attempt started");

    const { refreshToken } = req.body;

    // ---------------------------------------
    // 1. Validate request body
    // ---------------------------------------
    if (!refreshToken) {
      console.warn("[REFRESH] No refresh token provided");
      return res.status(400).json({
        success: false,
        error: "NO_REFRESH_TOKEN",
        message: "Refresh token is required.",
      });
    }

    // ---------------------------------------
    // 2. Decode + verify the refresh token
    // ---------------------------------------
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      console.error(
        "[REFRESH] Refresh token verification failed:",
        err.message
      );

      // Token expired
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          error: "REFRESH_TOKEN_EXPIRED",
          message: "Refresh token has expired. Please log in again.",
        });
      }

      // Invalid token
      return res.status(401).json({
        success: false,
        error: "INVALID_REFRESH_TOKEN",
        message: "Invalid refresh token.",
      });
    }

    // ---------------------------------------
    // 3. Find user matching token
    // ---------------------------------------
    const user = await UserModel.findById(decoded.id).select(
      "+refreshToken +refreshTokenExpiry"
    );

    if (!user) {
      console.warn("[REFRESH] No user found for token:", decoded.id);
      return res.status(404).json({
        success: false,
        error: "USER_NOT_FOUND",
        message: "User not found.",
      });
    }

    // ---------------------------------------
    // 4. Validate stored refresh token
    // ---------------------------------------
    if (user.refreshToken !== refreshToken) {
      console.warn("[REFRESH] Refresh token mismatch");
      return res.status(401).json({
        success: false,
        error: "REFRESH_TOKEN_MISMATCH",
        message: "Refresh token does not match. Please log in again.",
      });
    }

    // ---------------------------------------
    // 5. Check refreshTokenExpiry manually
    // (Fixed-window session logic)
    // ---------------------------------------
    if (user.refreshTokenExpiry < new Date()) {
      console.warn("[REFRESH] Refresh token expired in DB");

      return res.status(401).json({
        success: false,
        error: "REFRESH_TOKEN_EXPIRED",
        message: "Refresh token has expired. Please log in again.",
      });
    }

    // ---------------------------------------
    // 6. Issue NEW ACCESS TOKEN (short-lived)
    // ---------------------------------------
    const newAccessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    console.info("[REFRESH] New access token issued for:", user.email);

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully.",
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error("[REFRESH] Server error:", err);

    return res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: "Internal server error while refreshing access token.",
    });
  }
}

export { verifyAccessToken, refreshAccessToken };
//
