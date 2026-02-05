import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

const router = express.Router();

router.get(
  "/users",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
    res.json({ items: users });
  })
);

router.get(
  "/orders",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(500);
    res.json({ items: orders });
  })
);

export default router;
