import React, { useEffect, useState } from "react";
import { getAllResults, updateResult, getUsers, checkWritingWithTRAI } from "../api/api";
import { useAuth } from "./AuthContext";
import "./WritingCheckerPanel.css";

const WritingCheckerPanel = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isTRAIChecking, setIsTRAIChecking] = useState(false);
  const [traiResult, setTraiResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔍 Текущий пользователь:", user);
      console.log("🔑 Роль пользователя:", user?.role);
      console.log("🆔 ID пользователя:", user?._id);
      
      // Проверяем токен
      const token = localStorage.getItem('access_token');
      console.log("🎫 Токен в localStorage:", token ? 'Есть' : 'Нет');
      
      if (!token) {
        throw new Error('Токен доступа не найден. Войдите в систему заново.');
      }
      
      console.log("📡 Начинаем загрузку данных...");
      
      const [r, u] = await Promise.all([getAllResults(), getUsers()]);
      console.log("📊 Загружено результатов:", r.length);
      console.log("👥 Загружено пользователей:", u.length);
      
      setResults(r);
      // Фильтруем только обычных пользователей (не админов)
      const regularUsers = u.filter(user => user.role === 'user');
      console.log("👤 Обычных пользователей:", regularUsers.length);
      setUsers(regularUsers);
    } catch (error) {
      console.error('❌ Ошибка загрузки данных:', error);
      console.error('❌ Детали ошибки:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      setError(error.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (user) {
      load(); 
    }
  }, [user]);

  const grade = async (id, band, comment) => {
    try {
      await updateResult(id, { 
        writing: { band, comment },
        writingSubmission: {
          reviewedBy: 'current-user-id', // TODO: get from auth context
          reviewedAt: new Date()
        }
      });
      load();
      alert('Оценка успешно сохранена!');
    } catch (error) {
      alert('Ошибка при сохранении оценки: ' + error.message);
    }
  };

  const checkWithTRAI = async (task1Text, task2Text, taskType = "both") => {
    setIsTRAIChecking(true);
    setTraiResult(null);
    
    try {
      const result = await checkWritingWithTRAI(task1Text, task2Text, taskType);
      if (result.success) {
        setTraiResult(result.data);
        alert('TRAI успешно проверил работу!');
      } else {
        alert('Ошибка при проверке TRAI: ' + result.message);
      }
    } catch (error) {
      alert('Ошибка при проверке TRAI: ' + error.message);
    } finally {
      setIsTRAIChecking(false);
    }
  };

  const applyTRAIGrade = async (resultId) => {
    if (!traiResult || !traiResult.overall_band) {
      alert('Сначала получите оценку от TRAI');
      return;
    }

    const comment = `TRAI оценка: ${traiResult.overall_band}/9

Критерии:
- Task Achievement: ${traiResult.criteria?.task_achievement || 'N/A'}
- Coherence & Cohesion: ${traiResult.criteria?.coherence_cohesion || 'N/A'}
- Lexical Resource: ${traiResult.criteria?.lexical_resource || 'N/A'}
- Grammatical Range: ${traiResult.criteria?.grammatical_range || 'N/A'}

Подробный анализ: ${traiResult.detailed_feedback || ''}

Сильные стороны: ${(traiResult.strengths || []).join(', ')}

Области для улучшения: ${(traiResult.areas_for_improvement || []).join(', ')}

Рекомендации: ${traiResult.recommendations || ''}`;

    await grade(resultId, traiResult.overall_band, comment);
    setTraiResult(null);
  };

  const getUserResults = (userId) => {
    return results.filter(r => r.user?._id === userId && (
      r.writingSubmission?.task1Text || r.writingSubmission?.task2Text
    ));
  };

  const getBandOptions = () => {
    const bands = [];
    for (let i = 2; i <= 9; i++) {
      bands.push(i);
      if (i < 9) bands.push(i + 0.5);
    }
    return bands;
  };

  const UserList = () => (
    <div className="writing-checker-panel">
      <h1>Writing Checker Panel</h1>
      
      {/* Отладочная информация */}
      <div className="debug-info" style={{ 
        background: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        fontSize: '14px'
      }}>
        <h3>🔍 Отладочная информация:</h3>
        <p><strong>Текущий пользователь:</strong> {user?.username || 'Не определен'}</p>
        <p><strong>Роль:</strong> {user?.role || 'Не определена'}</p>
        <p><strong>ID пользователя:</strong> {user?._id || 'Не определен'}</p>
        <p><strong>Статус загрузки:</strong> {loading ? 'Загружается...' : 'Загружено'}</p>
        <p><strong>Ошибка:</strong> {error || 'Нет'}</p>
      </div>

      {loading ? (
        <div className="loading">
          <h3>🔄 Загрузка данных...</h3>
          <p>Пожалуйста, подождите...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <h3>❌ Ошибка загрузки</h3>
          <p>{error}</p>
          <button onClick={load} className="retry-button">
            🔄 Попробовать снова
          </button>
        </div>
      ) : users.length === 0 ? (
        <div className="no-users">
          <h3>👥 Пользователи не найдены</h3>
          <p>Возможные причины:</p>
          <ul>
            <li>У вас нет прав для просмотра пользователей</li>
            <li>В системе нет пользователей с ролью 'user'</li>
            <li>Проблема с API или базой данных</li>
          </ul>
          <button onClick={load} className="retry-button">
            🔄 Обновить
          </button>
        </div>
      ) : (
        <div className="users-grid">
          {users.map(user => {
            const userResults = getUserResults(user._id);
            const pendingCount = userResults.filter(r => !r.writing?.band).length;
            const gradedCount = userResults.filter(r => r.writing?.band).length;
            
            return (
              <div 
                key={user._id} 
                className={`user-card ${pendingCount > 0 ? 'has-pending' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="user-info">
                  <h3>{user.username}</h3>
                  <p className="user-role">{user.role}</p>
                </div>
                <div className="results-summary">
                  <div className="pending-count">
                    <span className="count">{pendingCount}</span>
                    <span className="label">Ожидают оценки</span>
                  </div>
                  <div className="graded-count">
                    <span className="count">{gradedCount}</span>
                    <span className="label">Оценены</span>
                  </div>
                </div>
                {pendingCount > 0 && (
                  <div className="pending-indicator">
                    ⚠️ Требует внимания
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const UserWritingPage = () => {
    const userResults = getUserResults(selectedUser._id);
    const [selectedBand, setSelectedBand] = useState('');
    const [comment, setComment] = useState('');

    const handleGrade = async (resultId) => {
      if (!selectedBand) {
        alert('Пожалуйста, выберите оценку');
        return;
      }
      await grade(resultId, parseFloat(selectedBand), comment);
      setSelectedBand('');
      setComment('');
    };

    return (
      <div className="user-writing-page">
        <div className="page-header">
          <button 
            className="back-button"
            onClick={() => {
              setSelectedUser(null);
              setSelectedResult(null);
              setTraiResult(null);
            }}
          >
            ← Назад к списку
          </button>
          <h1>Writing работы: {selectedUser.username}</h1>
        </div>

        {userResults.length === 0 ? (
          <div className="no-results">
            <p>У этого пользователя нет письменных работ для оценки.</p>
          </div>
        ) : (
          <div className="writing-results">
            {userResults.map(result => (
              <div key={result._id} className="writing-result-card">
                <div className="result-header">
                  <h3>Тест: {result.test?.name}</h3>
                  <div className="result-status">
                    {result.writing?.band ? (
                      <span className="graded">Оценен: {result.writing.band}</span>
                    ) : (
                      <span className="pending">Ожидает оценки</span>
                    )}
                  </div>
                </div>

                <div className="writing-content">
                  <h4>Writing Task 1:</h4>
                  <div className="text-content">
                    {result.writingSubmission?.task1Text || 'Нет данных'}
                  </div>
                  
                  <h4>Writing Task 2:</h4>
                  <div className="text-content">
                    {result.writingSubmission?.task2Text || 'Нет данных'}
                  </div>
                </div>

                {result.writing?.comment && (
                  <div className="existing-comment">
                    <h4>Комментарий:</h4>
                    <p>{result.writing.comment}</p>
                    {result.writingSubmission?.reviewedAt && (
                      <p className="review-info">
                        Проверено: {new Date(result.writingSubmission.reviewedAt).toLocaleString('ru-RU')}
                      </p>
                    )}
                  </div>
                )}

                {/* TRAI Check Section */}
                <div className="trai-check-section">
                  <h4>🤖 Проверка TRAI</h4>
                  <div className="trai-actions">
                    <button 
                      onClick={() => checkWithTRAI(
                        result.writingSubmission?.task1Text,
                        result.writingSubmission?.task2Text,
                        "both"
                      )}
                      className="trai-check-button"
                      disabled={isTRAIChecking}
                    >
                      {isTRAIChecking ? 'TRAI проверяет...' : 'TRAI проверит'}
                    </button>
                  </div>

                  {traiResult && (
                    <div className="trai-result">
                      <div className="trai-score">
                        <h5>Оценка TRAI: {traiResult.overall_band}/9</h5>
                        {traiResult.criteria && Object.keys(traiResult.criteria).length > 0 && (
                          <div className="trai-criteria">
                            <p><strong>Task Achievement:</strong> {traiResult.criteria.task_achievement}</p>
                            <p><strong>Coherence & Cohesion:</strong> {traiResult.criteria.coherence_cohesion}</p>
                            <p><strong>Lexical Resource:</strong> {traiResult.criteria.lexical_resource}</p>
                            <p><strong>Grammatical Range:</strong> {traiResult.criteria.grammatical_range}</p>
                          </div>
                        )}
                      </div>
                      
                      {traiResult.detailed_feedback && (
                        <div className="trai-feedback">
                          <h6>Подробный анализ:</h6>
                          <p>{traiResult.detailed_feedback}</p>
                        </div>
                      )}

                      {traiResult.strengths && traiResult.strengths.length > 0 && (
                        <div className="trai-strengths">
                          <h6>Сильные стороны:</h6>
                          <ul>
                            {traiResult.strengths.map((strength, index) => (
                              <li key={index}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {traiResult.areas_for_improvement && traiResult.areas_for_improvement.length > 0 && (
                        <div className="trai-improvements">
                          <h6>Области для улучшения:</h6>
                          <ul>
                            {traiResult.areas_for_improvement.map((area, index) => (
                              <li key={index}>{area}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {traiResult.recommendations && (
                        <div className="trai-recommendations">
                          <h6>Рекомендации:</h6>
                          <p>{traiResult.recommendations}</p>
                        </div>
                      )}

                      <button 
                        onClick={() => applyTRAIGrade(result._id)}
                        className="apply-trai-grade-button"
                      >
                        Применить оценку TRAI
                      </button>
                    </div>
                  )}
                </div>

                <div className="grading-section">
                  <h4>Ручная оценка:</h4>
                  <div className="band-selector">
                    <select 
                      value={selectedBand} 
                      onChange={(e) => setSelectedBand(e.target.value)}
                      className="band-select"
                    >
                      <option value="">Выберите оценку</option>
                      {getBandOptions().map(band => (
                        <option key={band} value={band}>
                          {band}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="comment-section">
                    <label htmlFor={`comment-${result._id}`}>Комментарий:</label>
                    <textarea
                      id={`comment-${result._id}`}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Введите комментарий к работе..."
                      rows={4}
                      className="comment-textarea"
                    />
                  </div>

                  <div className="grading-actions">
                    <button 
                      onClick={() => handleGrade(result._id)}
                      className="grade-button"
                      disabled={!selectedBand}
                    >
                      {result.writing?.band ? 'Обновить оценку' : 'Поставить оценку'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return selectedUser ? <UserWritingPage /> : <UserList />;
};

export default WritingCheckerPanel;

