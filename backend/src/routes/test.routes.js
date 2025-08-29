import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { createTest, listTests, getTest, assignTest, getTestPublic, updateTest, deleteTest } from "../controllers/test.controller.js";
import multer from "multer";
import path from "path";

const router = express.Router();

router.post("/", authenticate, authorize("admin"), createTest);
router.get("/", authenticate, authorize("admin"), listTests);
router.get("/:id", authenticate, authorize("admin", "speaking-checker", "writing-checker"), getTest);
router.put("/:id", authenticate, authorize("admin"), updateTest);
router.delete("/:id", authenticate, authorize("admin"), deleteTest);
router.get("/:id/public", authenticate, authorize("user", "admin"), getTestPublic);
router.post("/assign", authenticate, authorize("admin"), assignTest);

// rudimentary PDF upload (future: parse to test structure via AI service)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), "backend", "uploads", "pdf")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });
router.post("/upload-pdf", authenticate, authorize("admin"), upload.single("pdf"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file" });
  return res.json({ ok: true, url: `/uploads/pdf/${req.file.filename}` });
});

export default router;

