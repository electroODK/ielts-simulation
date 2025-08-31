import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { 
  submitSpeakingGrades, 
  getSpeakingResults, 
  getSpeakingResultDetails 
} from '../controllers/speaking.controller.js';

const router = express.Router();

// Отправить Speaking оценки (только для admin и speaking-checker)
router.post('/grades', authenticate, authorize('admin', 'speaking-checker'), submitSpeakingGrades);

// Получить Speaking результаты (только для admin и speaking-checker)
router.get('/results', authenticate, authorize('admin', 'speaking-checker'), getSpeakingResults);

// Получить детали конкретного Speaking результата (только для admin и speaking-checker)
router.get('/results/:resultId', authenticate, authorize('admin', 'speaking-checker'), getSpeakingResultDetails);

export default router;

