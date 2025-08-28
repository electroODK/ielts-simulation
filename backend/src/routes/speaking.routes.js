import express from "express";
import multer from "multer";
import path from "path";
import { authenticate, authorize } from "../middleware/auth.js";
import Result from "../models/result.model.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "backend", "uploads", "speaking"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/upload", authenticate, authorize("user"), upload.single("recording"), async (req, res) => {
  try {
    const userId = req.user?.id;
    const { testId, duration, size } = req.body || {};
    if (!testId || !req.file) return res.status(400).json({ message: "testId and file are required" });
    let result = await Result.findOne({ user: userId, test: testId });
    if (!result) result = await Result.create({ user: userId, test: testId, status: "submitted" });
    const url = `/uploads/speaking/${req.file.filename}`;
    const rec = { url, duration: Number(duration||0), size: Number(size||req.file.size||0) };
    const existing = Array.isArray(result.speakingSubmission?.recordings) ? result.speakingSubmission.recordings : [];
    result.speakingSubmission = { ...(result.speakingSubmission||{}), recordings: [...existing, rec] };
    if (result.status === "submitted") result.status = "reviewing";
    await result.save();
    return res.json({ ok: true, url });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;

