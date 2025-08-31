import Result from '../models/result.model.js';

// Отправить Speaking оценки
export const submitSpeakingGrades = async (req, res) => {
  try {
    const { gradesData } = req.body;
    
    if (!gradesData || !Array.isArray(gradesData)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Неверный формат данных оценок' 
      });
    }

    const results = [];

    for (const gradeData of gradesData) {
      const { userId, grades, averageGrade } = gradeData;
      
      if (!userId || !grades || !averageGrade) {
        return res.status(400).json({ 
          success: false, 
          message: 'Неполные данные для пользователя' 
        });
      }

      // Ищем существующий результат для пользователя
      let result = await Result.findOne({ 
        user: userId, 
        'sections.type': 'speaking' 
      });

      if (!result) {
        return res.status(404).json({ 
          success: false, 
          message: `Результат для пользователя ${userId} не найден` 
        });
      }

      // Обновляем Speaking секцию
      const speakingSection = result.sections.find(s => s.type === 'speaking');
      if (!speakingSection) {
        return res.status(404).json({ 
          success: false, 
          message: `Speaking секция для пользователя ${userId} не найдена` 
        });
      }

      // Обновляем оценки для каждого вопроса
      Object.keys(grades).forEach(questionId => {
        const grade = grades[questionId];
        if (grade !== '' && grade !== null && grade !== undefined) {
          // Ищем вопрос и обновляем оценку
          speakingSection.questions.forEach(question => {
            if (question.id === questionId || question._id.toString() === questionId) {
              question.grade = parseFloat(grade);
              question.gradedAt = new Date();
              question.gradedBy = req.user._id;
            }
          });
        }
      });

      // Обновляем общую оценку для Speaking секции
      speakingSection.overallGrade = parseFloat(averageGrade);
      speakingSection.gradedAt = new Date();
      speakingSection.gradedBy = req.user._id;
      speakingSection.status = 'graded';

      // Сохраняем результат
      await result.save();
      results.push(result);
    }

    res.json({
      success: true,
      message: 'Оценки успешно сохранены',
      results: results.map(r => ({
        userId: r.userId,
        speakingGrade: r.sections.find(s => s.type === 'speaking')?.overallGrade
      }))
    });

  } catch (error) {
    console.error('Error submitting speaking grades:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера при сохранении оценок' 
    });
  }
};

// Получить Speaking результаты для проверки
export const getSpeakingResults = async (req, res) => {
  try {
    const { userId } = req.params;
    
    let query = { 'sections.type': 'speaking' };
    if (userId) {
      query.userId = userId;
    }

    const results = await Result.find(query)
      .populate('userId', 'username email')
      .populate('speakingTestId', 'title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      results: results.map(result => {
        const speakingSection = result.sections.find(s => s.type === 'speaking');
        return {
          _id: result._id,
          userId: result.userId,
          speakingTest: result.speakingTestId,
          speakingSection,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt
        };
      })
    });

  } catch (error) {
    console.error('Error getting speaking results:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера при получении результатов' 
    });
  }
};

// Получить детальную информацию о Speaking результате
export const getSpeakingResultDetails = async (req, res) => {
  try {
    const { resultId } = req.params;
    
    const result = await Result.findById(resultId)
      .populate('userId', 'username email')
      .populate('speakingTestId', 'title instructions');

    if (!result) {
      return res.status(404).json({ 
        success: false, 
        message: 'Результат не найден' 
      });
    }

    const speakingSection = result.sections.find(s => s.type === 'speaking');
    if (!speakingSection) {
      return res.status(404).json({ 
        success: false, 
        message: 'Speaking секция не найдена' 
      });
    }

    res.json({
      success: true,
      result: {
        _id: result._id,
        userId: result.userId,
        speakingTest: result.speakingTestId,
        speakingSection,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      }
    });

  } catch (error) {
    console.error('Error getting speaking result details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера при получении деталей результата' 
    });
  }
};