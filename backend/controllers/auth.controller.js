import express from "express";

async function verifyToken(req, res) {
  return res.status(200).json({
    success: true,
    message: "Token valid",
    user: req.user, // from middleware
  });
}

export { verifyToken };
