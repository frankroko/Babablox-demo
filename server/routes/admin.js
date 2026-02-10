import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

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

router.patch(
  "/users/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role, name } = req.body;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (role) {
      if (!["user", "admin"].includes(role)) {
        res.status(400).json({ error: "Invalid role" });
        return;
      }
      user.role = role;
    }

    if (name) {
      user.name = name;
    }

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  })
);

router.delete(
  "/users/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (req.user._id.toString() === id) {
      res.status(400).json({ error: "Cannot delete your own account" });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await Cart.deleteOne({ user: user._id });
    await user.deleteOne();
    res.json({ ok: true });
  })
);

router.get(
  "/orders",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(500);
    res.json({ items: orders });
  })
);

export default router;
