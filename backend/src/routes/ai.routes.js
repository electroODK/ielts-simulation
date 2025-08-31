import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { checkWritingWithTRAI } from "../ai/ai.controller.js";

const router = express.Router();

// Проверка writing задания с помощью TRAI
router.post("/check-writing", authenticate, authorize("admin", "writing-checker"), async (req, res) => {
  try {
    const { task1Text, task2Text, taskType = "both" } = req.body;
    
    if (!task1Text && !task2Text) {
      return res.status(400).json({ 
        success: false, 
        message: "Необходимо предоставить текст для проверки" 
      });
    }

    const result = await checkWritingWithTRAI(task1Text, task2Text, taskType);
    
    if (result.success) {
      return res.json(result);
    } else {
      return res.status(500).json({ 
        success: false, 
        message: "Ошибка при проверке с TRAI", 
        error: result.error 
      });
    }
  } catch (error) {
    console.error("Ошибка в AI роуте:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Внутренняя ошибка сервера" 
    });
  }
});

export default router;