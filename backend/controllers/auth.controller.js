import express from "express";

async function verifyAccessToken(req, res) {
  return res.status(200).json({
    success: true,
    message: " Access Token valid",
    user: req.user, // from middleware
  });
}

export { verifyAccessToken };
