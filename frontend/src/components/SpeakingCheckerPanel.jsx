import React, { useState, useEffect } from 'react';
import { getAllResults, updateResult, getUsers } from '../api/api';
import './SpeakerCheckerPanel.css';

const SpeakingCheckerPanel = () => {
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [grades, setGrades] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resultsData, usersData] = await Promise.all([
        getAllResults(),
        getUsers()
      ]);
      
      // Фильтруем только результаты с Speaking секциями
      const speakingResults = resultsData.filter(result => 
        result.speaking && result.speaking.answers && result.speaking.answers.length > 0
      );
      
      setResults(speakingResults);
      setUsers(usersData);
      
      // Инициализируем оценки и комментарии
      const initialGrades = {};
      const initialComments = {};
      
      speakingResults.forEach(result => {
        if (result.speaking && result.speaking.answers) {
          result.speaking.answers.forEach((answer, index) => {
            const key = `${result._id}_${index}`;
            initialGrades[key] = result.speaking.grades?.[index] || '';
            initialComments[key] = result.speaking.comments?.[index] || '';
          });
        }
      });
      
      setGrades(initialGrades);
      setComments(initialComments);
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (resultId, questionIndex, grade) => {
    const key = `${resultId}_${questionIndex}`;
    setGrades(prev => ({
      ...prev,
      [key]: grade
    }));
  };

  const handleCommentChange = (resultId, questionIndex, comment) => {
    const key = `${resultId}_${questionIndex}`;
    setComments(prev => ({
      ...prev,
      [key]: comment
    }));
  };

  const calculateOverallBand = (resultId) => {
    const resultGrades = [];
    const result = results.find(r => r._id === resultId);
    
    if (!result || !result.speaking || !result.speaking.answers) return 0;
    
    result.speaking.answers.forEach((_, index) => {
      const key = `${resultId}_${index}`;
      const grade = grades[key];
      if (grade && grade !== '') {
        resultGrades.push(parseFloat(grade));
      }
    });
    
    if (resultGrades.length === 0) return 0;
    
    const sum = resultGrades.reduce((acc, grade) => acc + grade, 0);
    return (sum / resultGrades.length).toFixed(1);
  };

  const saveGrades = async (resultId) => {
    try {
      const result = results.find(r => r._id === resultId);
      if (!result || !result.speaking || !result.speaking.answers) return;
      
      const gradesArray = [];
      const commentsArray = [];
      
      result.speaking.answers.forEach((_, index) => {
        const key = `${resultId}_${index}`;
        gradesArray.push(grades[key] || '');
        commentsArray.push(comments[key] || '');
      });
      
      const overallBand = calculateOverallBand(resultId);
      
      await updateResult(resultId, {
        speaking: {
          ...result.speaking,
          grades: gradesArray,
          comments: commentsArray,
          overallBand: parseFloat(overallBand),
          gradedAt: new Date().toISOString(),
          gradedBy: 'admin' // В реальном приложении брать из контекста авторизации
        }
      });
      
      alert('Оценки сохранены успешно!');
      await loadData(); // Перезагружаем данные
      
    } catch (error) {
      console.error('Error saving grades:', error);
      alert('Ошибка сохранения оценок: ' + error.message);
    }
  };

  const getBandColor = (band) => {
    const num = parseFloat(band);
    if (num >= 8) return '#27ae60'; // Зеленый для высоких баллов
    if (num >= 6) return '#f39c12'; // Оранжевый для средних
    if (num >= 4) return '#e74c3c'; // Красный для низких
    return '#95a5a6'; // Серый для неоцененных
  };

  if (loading) {
    return (
      <div className="speaking-checker-panel">
        <div className="loading">Загрузка Speaking результатов...</div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="speaking-checker-panel">
        <div className="no-results">
          <h2>Нет Speaking результатов для проверки</h2>
          <p>Пользователи еще не проходили Speaking тесты или результаты не загружены.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="speaking-checker-panel">
      <div className="panel-header">
        <h1>🎤 Speaking Checker Panel</h1>
        <p>Проверка и оценка Speaking тестов пользователей</p>
      </div>

      <div className="results-container">
        {results.map((result) => {
          const user = users.find(u => u._id === result.userId);
          const overallBand = calculateOverallBand(result._id);
          
          return (
            <div key={result._id} className="result-card">
              <div className="result-header">
                <div className="user-info">
                  <h3>👤 {user?.username || 'Неизвестный пользователь'}</h3>
                  <p>📋 Тест: {result.test?.name || 'Неизвестный тест'}</p>
                  <p>📅 Дата: {new Date(result.createdAt).toLocaleDateString('ru-RU')}</p>
                </div>
                
                <div className="overall-score">
                  <div 
                    className="band-display"
                    style={{ backgroundColor: getBandColor(overallBand) }}
                  >
                    {overallBand > 0 ? `Band ${overallBand}` : 'Не оценено'}
                  </div>
                </div>
              </div>

              <div className="speaking-answers">
                <h4>🗣️ Speaking ответы:</h4>
                
                {result.speaking.answers.map((answer, index) => {
                  const key = `${result._id}_${index}`;
                  const question = result.speaking.questions?.[index] || `Вопрос ${index + 1}`;
                  
                  return (
                    <div key={index} className="answer-item">
                      <div className="question-section">
                        <h5>❓ {question}</h5>
                        <div className="answer-text">
                          <strong>Ответ пользователя:</strong>
                          <p>{answer}</p>
                        </div>
                      </div>
                      
                      <div className="grading-section">
                        <div className="grade-input">
                          <label>Оценка (Band 1-9):</label>
                          <select
                            value={grades[key] || ''}
                            onChange={(e) => handleGradeChange(result._id, index, e.target.value)}
                          >
                            <option value="">Выберите оценку</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(band => (
                              <option key={band} value={band}>
                                Band {band}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="comment-input">
                          <label>Комментарий:</label>
                          <textarea
                            placeholder="Введите комментарий к ответу..."
                            value={comments[key] || ''}
                            onChange={(e) => handleCommentChange(result._id, index, e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="result-actions">
                <button 
                  className="save-button"
                  onClick={() => saveGrades(result._id)}
                >
                  💾 Сохранить оценки
                </button>
                
                <div className="grade-summary">
                  <span>Средний балл: <strong>{overallBand}</strong></span>
                  {result.speaking.gradedAt && (
                    <span>Оценено: {new Date(result.speaking.gradedAt).toLocaleDateString('ru-RU')}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpeakingCheckerPanel;

