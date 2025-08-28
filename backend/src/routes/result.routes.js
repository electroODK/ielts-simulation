import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { submitResult, listResults, listResultsByUser, updateResult, finalizeResult, publishResult, submitListeningAnswers } from "../controllers/result.controller.js";

const router = express.Router();

// user submit
router.post("/submit", authenticate, authorize("user"), submitResult);
router.post("/submit-listening", authenticate, authorize("user"), submitListeningAnswers);

// admin lists
router.get("/", authenticate, authorize("admin", "speaking-checker", "writing-checker"), listResults);
router.get("/user/:userId", authenticate, authorize("admin", "speaking-checker", "writing-checker"), listResultsByUser);

// grading updates
router.patch("/:id", authenticate, authorize("admin", "speaking-checker", "writing-checker"), updateResult);
router.post("/:id/finalize", authenticate, authorize("admin"), finalizeResult);
router.post("/:id/publish", authenticate, authorize("admin"), publishResult);

export default router;

