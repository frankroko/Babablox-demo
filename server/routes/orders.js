import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    if (req.user.role === "admin") {
      res.status(403).json({ error: "Admin accounts cannot place orders" });
      return;
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ error: "Cart is empty" });
      return;
    }

    const items = cart.items.map((item) => ({
      product: item.product,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    }));

    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user._id,
      items,
      subtotal,
      paymentMethod: req.body.paymentMethod,
      paymentStatus: req.body.paymentStatus,
      shippingAddress: req.body.shippingAddress,
    });

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  })
);

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const scope = String(req.query.scope || "");
    const query =
      req.user.role === "admin" && scope === "all"
        ? {}
        : { user: req.user._id };

    const orders = await Order.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({ items: orders });
  })
);

router.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    res.json(order);
  })
);

router.patch(
  "/:id/status",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    if (status) {
      order.status = status;
    }
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();
    res.json(order);
  })
);

export default router;
