import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const forbidAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    res.status(403).json({ error: "Admin accounts cannot use cart" });
    return;
  }
  next();
};

router.use(requireAuth, forbidAdmin);

const getCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (cart) {
    return cart;
  }
  return Cart.create({ user: userId, items: [] });
};

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const cart = await getCart(req.user._id);
    res.json(cart);
  })
);

router.post(
  "/items",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
      res.status(400).json({ error: "productId is required" });
      return;
    }

    const qty = Math.max(1, Number(quantity) || 1);
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const cart = await getCart(req.user._id);
    const existing = cart.items.find(
      (item) => item.product?.toString() === productId
    );

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: qty,
      });
    }

    await cart.save();
    res.json(cart);
  })
);

router.patch(
  "/items/:itemId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const qty = Number(quantity);
    if (!Number.isFinite(qty)) {
      res.status(400).json({ error: "quantity must be a number" });
      return;
    }

    const cart = await getCart(req.user._id);
    const item = cart.items.id(itemId);
    if (!item) {
      res.status(404).json({ error: "Cart item not found" });
      return;
    }

    if (qty <= 0) {
      item.remove();
    } else {
      item.quantity = qty;
    }

    await cart.save();
    res.json(cart);
  })
);

router.delete(
  "/items/:itemId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const cart = await getCart(req.user._id);
    const item = cart.items.id(itemId);
    if (!item) {
      res.status(404).json({ error: "Cart item not found" });
      return;
    }

    item.remove();
    await cart.save();
    res.json(cart);
  })
);

router.delete(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const cart = await getCart(req.user._id);
    cart.items = [];
    await cart.save();
    res.json(cart);
  })
);

export default router;
