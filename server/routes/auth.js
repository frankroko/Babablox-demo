import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import { createAccessToken } from "../utils/tokens.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

const shouldSendCookie = () =>
  String(process.env.JWT_COOKIE || "").toLowerCase() === "true";

const sendAuthResponse = (res, user) => {
  const token = createAccessToken(user);
  if (shouldSendCookie()) {
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: String(process.env.COOKIE_SECURE || "").toLowerCase() === "true",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }
  res.json({ user: sanitizeUser(user), token });
};

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email, and password are required" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }

    const role =
      process.env.ADMIN_EMAIL &&
      email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()
        ? "admin"
        : "user";

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
    });

    res.status(201);
    sendAuthResponse(res, user);
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+passwordHash"
    );
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    if (
      process.env.ADMIN_EMAIL &&
      user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase() &&
      user.role !== "admin"
    ) {
      user.role = "admin";
      await user.save();
    }

    sendAuthResponse(res, user);
  })
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ user: sanitizeUser(req.user) });
  })
);

router.post(
  "/logout",
  requireAuth,
  asyncHandler(async (req, res) => {
    if (shouldSendCookie()) {
      res.clearCookie("token");
    }
    res.json({ ok: true });
  })
);

export default router;
