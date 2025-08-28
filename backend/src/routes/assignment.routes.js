import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import Assignment from "../models/assignment.model.js";

const router = express.Router();

// create assignment (admin)
router.post("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { userId, listeningTestId, readingTestId, writingTestId, speakingTestId } = req.body || {};
    if (!userId || !listeningTestId || !readingTestId || !writingTestId || !speakingTestId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const doc = await Assignment.create({
      user: userId,
      listeningTest: listeningTestId,
      readingTest: readingTestId,
      writingTest: writingTestId,
      speakingTest: speakingTestId,
    });
    return res.status(201).json(doc);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

// list assignments (admin)
router.get("/", authenticate, authorize("admin"), async (_req, res) => {
  const items = await Assignment.find({}).populate("user listeningTest readingTest writingTest speakingTest").sort({ createdAt: -1 });
  return res.json(items);
});

// get current user's latest assignment
router.get("/me", authenticate, authorize("user", "admin"), async (req, res) => {
  const userId = req.user?.id;
  const doc = await Assignment.findOne({ user: userId }).populate("listeningTest readingTest writingTest speakingTest").sort({ createdAt: -1 });
  if (!doc) return res.status(404).json({ message: "No assignment" });
  return res.json(doc);
});

// get by user id (admin)
router.get("/user/:userId", authenticate, authorize("admin"), async (req, res) => {
  const items = await Assignment.find({ user: req.params.userId }).populate("listeningTest readingTest writingTest speakingTest").sort({ createdAt: -1 });
  return res.json(items);
});

export default router;

