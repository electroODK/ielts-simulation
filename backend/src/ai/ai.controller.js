import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// TRAI - AI ассистент для проверки IELTS Writing
const TRAI_SYSTEM_PROMPT = `Ты TRAI (Трай) - эксперт по проверке IELTS Writing заданий. Твоя задача - объективно оценивать письменные работы по критериям IELTS.

Критерии оценки:
1. Task Achievement (TA) - выполнение задания
2. Coherence and Cohesion (CC) - связность и логичность
3. Lexical Resource (LR) - словарный запас
4. Grammatical Range and Accuracy (GRA) - грамматика

Для каждого критерия дай оценку от 1 до 9 (можно использовать половинные баллы: 6.5, 7.5 и т.д.).

Формат ответа:
{
  "overall_band": 7.0,
  "criteria": {
    "task_achievement": 7.0,
    "coherence_cohesion": 6.5,
    "lexical_resource": 7.5,
    "grammatical_range": 7.0
  },
  "detailed_feedback": "Подробный анализ по каждому критерию...",
  "strengths": ["Сильные стороны работы..."],
  "areas_for_improvement": ["Области для улучшения..."],
  "recommendations": "Конкретные рекомендации для улучшения..."
}

Будь объективным, но поддерживающим. Объясняй свои решения четко и конструктивно.`;

export const checkWritingWithTRAI = async (task1Text, task2Text, taskType = "both") => {
  try {
    let prompt = "";
    
    if (taskType === "both" || taskType === "task1") {
      prompt += `Writing Task 1:\n${task1Text || "Не предоставлено"}\n\n`;
    }
    
    if (taskType === "both" || taskType === "task2") {
      prompt += `Writing Task 2:\n${task2Text || "Не предоставлено"}\n\n`;
    }
    
    prompt += `Пожалуйста, проверь это IELTS Writing задание и дай оценку по критериям IELTS.`;

    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: TRAI_SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    const aiResponse = response.choices[0].message.content;
    
    try {
      // Пытаемся распарсить JSON ответ
      const parsedResponse = JSON.parse(aiResponse);
      return {
        success: true,
        data: parsedResponse,
        rawResponse: aiResponse
      };
    } catch (parseError) {
      // Если не удалось распарсить JSON, возвращаем текстовый ответ
      return {
        success: true,
        data: {
          overall_band: null,
          criteria: {},
          detailed_feedback: aiResponse,
          strengths: [],
          areas_for_improvement: [],
          recommendations: ""
        },
        rawResponse: aiResponse
      };
    }
  } catch (error) {
    console.error("Ошибка при проверке с TRAI:", error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

export default {
  checkWritingWithTRAI
};
