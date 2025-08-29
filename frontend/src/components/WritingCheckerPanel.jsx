import React, { useEffect, useState } from "react";
import { getAllResults, updateResult, getUsers } from "../api/api";
import "./WritingCheckerPanel.css";

const WritingCheckerPanel = () => {
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);

  const load = async () => {
    try {
      const [r, u] = await Promise.all([getAllResults(), getUsers()]);
      setResults(r);
      setUsers(u);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => { load(); }, []);

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

                <div className="grading-section">
                  <h4>Оценка:</h4>
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

