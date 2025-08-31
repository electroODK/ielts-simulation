import React, { useState, useEffect } from 'react';
import { getUsers, submitSpeakingGrades } from '../api/api';
import { useAuth } from '../components/AuthContext';
import './SpeakerCheckerPanel.css';

const SpeakerCheckerPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [grades, setGrades] = useState({}); // { userId: { questionId: grade } }
  const [submitting, setSubmitting] = useState(false);

  console.log('SpeakerCheckerPanel render - user:', user, 'loading:', loading, 'error:', error);

  // Загрузить список пользователей
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await getUsers();
      
      console.log('Loaded users data:', usersData);
      
      // Для демонстрации показываем всех пользователей
      // В реальном приложении здесь должна быть логика фильтрации по Speaking результатам
      setUsers(usersData);
      
      // Инициализируем пустые оценки для всех пользователей
      const initialGrades = {};
      usersData.forEach(user => {
        initialGrades[user._id] = {};
      });
      setGrades(initialGrades);
      
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Ошибка загрузки пользователей: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('SpeakerCheckerPanel useEffect - user:', user);
    if (user) {
      loadUsers();
    } else {
      console.log('SpeakerCheckerPanel: user is null/undefined');
    }
  }, [user]);

  // Обновить оценку для конкретного вопроса
  const updateGrade = (userId, questionId, grade) => {
    setGrades(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [questionId]: grade
      }
    }));
  };

  // Вычислить среднюю оценку для пользователя
  const calculateAverageGrade = (userId) => {
    const userGrades = grades[userId];
    if (!userGrades) return 0;
    
    const gradeValues = Object.values(userGrades).filter(grade => 
      grade !== '' && grade !== null && grade !== undefined
    );
    
    if (gradeValues.length === 0) return 0;
    
    const sum = gradeValues.reduce((acc, grade) => acc + parseFloat(grade), 0);
    return (sum / gradeValues.length).toFixed(1);
  };

  // Отправить все оценки
  const handleSubmitGrades = async () => {
    try {
      setSubmitting(true);
      
      // Подготавливаем данные для отправки
      const gradesData = Object.keys(grades).map(userId => ({
        userId,
        grades: grades[userId],
        averageGrade: calculateAverageGrade(userId)
      }));
      
      await submitSpeakingGrades(gradesData);
      alert('Оценки успешно отправлены!');
      
      // Перезагружаем данные
      await loadUsers();
      
    } catch (err) {
      console.error('Error submitting grades:', err);
      alert('Ошибка отправки оценок: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Проверить, все ли оценки заполнены
  const areAllGradesFilled = () => {
    return Object.keys(grades).every(userId => {
      const userGrades = grades[userId];
      return Object.keys(userGrades).every(questionId => 
        userGrades[questionId] !== '' && userGrades[questionId] !== null && userGrades[questionId] !== undefined
      );
    });
  };

  if (loading) {
    return (
      <div className="speaker-checker-panel">
        <div className="loading">
          <div className="spinner"></div>
          <p>Загрузка пользователей...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="speaker-checker-panel">
        <div className="error-message">
          <h3>Ошибка</h3>
          <p>{error}</p>
          <button onClick={loadUsers} className="retry-button">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="speaker-checker-panel">
        <div className="no-users">
          <h3>Нет пользователей с Speaking заданиями</h3>
          <p>Пользователи с Speaking заданиями не найдены.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="speaker-checker-panel">
      <div className="panel-header">
        <h2>Speaker Checker Panel</h2>
        <p>Проверка Speaking заданий и выставление оценок</p>
      </div>

            <div className="users-list">
        {users.map(user => (
          <div key={user._id} className="user-card">
            <div className="user-header">
              <h3>{user.username || user.email}</h3>
              <div className="user-info">
                <span>Email: {user.email}</span>
                <span>Роль: {user.role}</span>
              </div>
            </div>

            <div className="speaking-submissions">
              <div className="submission-section">
                <h4>Демо Speaking задание</h4>
                <div className="submission-info">
                  <p><strong>Инструкции:</strong> Расскажите о своем хобби в течение 2 минут</p>
                  <p><strong>Временной лимит:</strong> 120 сек</p>
                  <p><strong>Дата выполнения:</strong> {new Date().toLocaleString()}</p>
                </div>

                <div className="questions-section">
                  <h5>Вопросы:</h5>
                  <div className="question-item">
                    <div className="question-content">
                      <div className="question-text">
                        <strong>Вопрос 1:</strong> Какое у вас хобби и почему вы им занимаетесь?
                      </div>
                      <div className="question-instructions">
                        <em>Расскажите подробно о своем хобби, когда вы начали им заниматься и что оно вам дает</em>
                      </div>
                      <div className="question-answer">
                        <strong>Ответ студента:</strong>
                        <div className="audio-player">
                          <span className="no-audio">Аудио не загружено (демо режим)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grade-section">
                      <label htmlFor={`grade-${user._id}-demo1`}>
                        Оценка (1-9):
                      </label>
                      <input
                        type="number"
                        id={`grade-${user._id}-demo1`}
                        min="1"
                        max="9"
                        step="0.5"
                        value={grades[user._id]?.['demo1'] || ''}
                        onChange={(e) => updateGrade(
                          user._id, 
                          'demo1', 
                          e.target.value
                        )}
                        className="grade-input"
                        placeholder="1-9"
                      />
                    </div>
                  </div>

                  <div className="question-item">
                    <div className="question-content">
                      <div className="question-text">
                        <strong>Вопрос 2:</strong> Как часто вы занимаетесь своим хобби?
                      </div>
                      <div className="question-instructions">
                        <em>Опишите, как часто и в какое время вы обычно занимаетесь своим хобби</em>
                      </div>
                      <div className="question-answer">
                        <strong>Ответ студента:</strong>
                        <div className="audio-player">
                          <span className="no-audio">Аудио не загружено (демо режим)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grade-section">
                      <label htmlFor={`grade-${user._id}-demo2`}>
                        Оценка (1-9):
                      </label>
                      <input
                        type="number"
                        id={`grade-${user._id}-demo2`}
                        min="1"
                        max="9"
                        step="0.5"
                        value={grades[user._id]?.['demo2'] || ''}
                        onChange={(e) => updateGrade(
                          user._id, 
                          'demo2', 
                          e.target.value
                        )}
                        className="grade-input"
                        placeholder="1-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="submission-summary">
                  <div className="average-grade">
                    <strong>Средняя оценка:</strong> {calculateAverageGrade(user._id)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="submit-section">
        <div className="submit-info">
          <p>
            <strong>Всего пользователей:</strong> {users.length}
          </p>
          <p>
            <strong>Все оценки заполнены:</strong> {areAllGradesFilled() ? '✅ Да' : '❌ Нет'}
          </p>
        </div>
        
        <button
          onClick={handleSubmitGrades}
          disabled={submitting || !areAllGradesFilled()}
          className="submit-button"
        >
          {submitting ? 'Отправка...' : 'Отправить все оценки'}
        </button>
        
        {!areAllGradesFilled() && (
          <p className="warning">
            ⚠️ Необходимо заполнить все оценки перед отправкой
          </p>
        )}
      </div>
    </div>
  );
};

export default SpeakerCheckerPanel;