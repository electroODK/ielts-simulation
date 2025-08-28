import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { createTest, listTests, getTest, assignTest } from "../controllers/test.controller.js";

const router = express.Router();

router.post("/", authenticate, authorize("admin"), createTest);
router.get("/", authenticate, authorize("admin"), listTests);
router.get("/:id", authenticate, authorize("admin", "speaking-checker", "writing-checker"), getTest);
router.post("/assign", authenticate, authorize("admin"), assignTest);

export default router;

