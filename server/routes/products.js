import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = express.Router();

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { q, page = 1, limit = 30, active } = req.query;
    const query = {};

    if (q) {
      query.name = { $regex: q, $options: "i" };
    }
    if (active === "true") {
      query.active = true;
    }
    if (active === "false") {
      query.active = false;
    }

    const pageNumber = Math.max(1, parseNumber(page, 1));
    const pageLimit = Math.min(100, Math.max(1, parseNumber(limit, 30)));
    const skip = (pageNumber - 1) * pageLimit;

    const [items, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageLimit),
      Product.countDocuments(query),
    ]);

    res.json({
      items,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageLimit),
    });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const product = isObjectId
      ? await Product.findById(id)
      : await Product.findOne({ slug: id });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(product);
  })
);

router.post(
  "/",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { name, price, image = "", description = "", active = true } =
      req.body;
    if (!name || price === undefined) {
      res.status(400).json({ error: "Name and price are required" });
      return;
    }

    const product = await Product.create({
      name,
      price,
      image,
      description,
      active,
    });

    res.status(201).json(product);
  })
);

router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const fields = ["name", "price", "image", "description", "active"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();
    res.json(product);
  })
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    await product.deleteOne();
    res.json({ ok: true });
  })
);

export default router;
