import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const router = express.Router();

// create user by admin
router.post("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ message: "username and password required" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed, role: role || "user" });
    return res.status(201).json({ id: user._id, username: user.username, role: user.role });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// list users
router.get("/", authenticate, authorize("admin"), async (_req, res) => {
  const users = await User.find({}, { password: 0, access_token: 0, refresh_token: 0 });
  return res.json(users);
});

// get user by id
router.get("/:id", authenticate, authorize("admin"), async (req, res) => {
  const user = await User.findById(req.params.id, { password: 0, access_token: 0, refresh_token: 0 });
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json(user);
});

export default router;

