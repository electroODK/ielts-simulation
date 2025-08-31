import React, { useEffect, useState } from "react";
import { getUsers, createUser } from "../api/api";
import { getTests, createTest, assignTestToUser } from "../api/api";
import { createAssignment, listAssignments } from "../api/api";
import api from "../api/api";
import { getAllResults, updateResult, finalizeResult, publishResult } from "../api/api";
import TestCreator from "./TestCreator";
import TestDemo from "./TestDemo";
import SpeakerCheckerPanel from "./SpeakerCheckerPanel";
import WritingCheckerPanel from "./WritingCheckerPanel";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [newUser, setNewUser] = useState({ username: "", password: "", role: "user" });
  const [newTest, setNewTest] = useState({ name: "", description: "" });
  const [assign, setAssign] = useState({ userId: "", testId: "" });
  const [assign4, setAssign4] = useState({ userId: "", listeningTestId: "", readingTestId: "", writingTestId: "", speakingTestId: "" });

  const load = async () => {
    try {
      const [u, t, r, a] = await Promise.all([getUsers(), getTests(), getAllResults(), listAssignments()]);
      setUsers(u);
      setTests(t);
      setResults(r);
      setAssignments(a);
    } catch (e) {}
  };

  useEffect(() => { load(); }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    await createUser(newUser);
    setNewUser({ username: "", password: "", role: "user" });
    load();
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    await createTest(newTest);
    setNewTest({ name: "", description: "" });
    load();
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    await assignTestToUser(assign.userId, assign.testId);
    setAssign({ userId: "", testId: "" });
    load();
  };

  const handleUpdateResult = async (id, payload) => {
    await updateResult(id, payload);
    load();
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    await createAssignment(assign4);
    setAssign4({ userId: "", listeningTestId: "", readingTestId: "", writingTestId: "", speakingTestId: "" });
    load();
  };

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <div className="admin-header">
          <h1>🎯 Admin Panel</h1>
          <p>Управление системой IELTS Simulation</p>
        </div>

        <nav className="admin-nav">
          <ul className="nav-tabs">
            <li className="nav-tab">
              <button 
                className={activeTab === 'dashboard' ? 'active' : ''}
                onClick={() => setActiveTab('dashboard')}
              >
                📊 Дашборд
              </button>
            </li>
            <li className="nav-tab">
              <button 
                className={activeTab === 'users' ? 'active' : ''}
                onClick={() => setActiveTab('users')}
              >
                👥 Пользователи
              </button>
            </li>
            <li className="nav-tab">
              <button 
                className={activeTab === 'tests' ? 'active' : ''}
                onClick={() => setActiveTab('tests')}
              >
                📝 Тесты
              </button>
            </li>
            <li className="nav-tab">
              <button 
                className={activeTab === 'assignments' ? 'active' : ''}
                onClick={() => setActiveTab('assignments')}
              >
                🔗 Назначения
              </button>
            </li>
            <li className="nav-tab">
              <button 
                className={activeTab === 'results' ? 'active' : ''}
                onClick={() => setActiveTab('results')}
              >
                📈 Результаты
              </button>
            </li>
            <li className="nav-tab">
              <button 
                className={activeTab === 'testCreator' ? 'active' : ''}
                onClick={() => setActiveTab('testCreator')}
              >
                🛠️ Создание тестов
              </button>
            </li>
            <li className="nav-tab">
              <button 
                className={activeTab === 'testDemo' ? 'active' : ''}
                onClick={() => setActiveTab('testDemo')}
              >
                🎬 Демо тестов
              </button>
            </li>
            <li className="nav-tab">
              <button 
                className={activeTab === 'speakingChecker' ? 'active' : ''}
                onClick={() => setActiveTab('speakingChecker')}
              >
                🎤 Speaking Checker
              </button>
            </li>
            <li className="nav-tab">
              <button 
                className={activeTab === 'writingChecker' ? 'active' : ''}
                onClick={() => setActiveTab('writingChecker')}
              >
                ✍️ Writing Checker
              </button>
            </li>
          </ul>
        </nav>

        <div className="admin-content">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div className="spinner"></div>
              <p>Загрузка данных...</p>
            </div>
          ) : (
            <>
              {/* Debug info */}
              <div style={{ marginBottom: '20px', padding: '10px', background: '#f8f9fa', borderRadius: '8px', fontSize: '14px' }}>
                <strong>Debug:</strong> Активная вкладка: {activeTab}
              </div>

              {activeTab === 'dashboard' && (
                <DashboardView 
                  users={users} 
                  tests={tests} 
                  results={results} 
                  assignments={assignments} 
                />
              )}

              {activeTab === 'users' && (
                <UsersView 
                  users={users}
                  newUser={newUser}
                  setNewUser={setNewUser}
                  onCreateUser={handleCreateUser}
                />
              )}

              {activeTab === 'tests' && (
                <TestsView 
                  tests={tests}
                  newTest={newTest}
                  setNewTest={setNewTest}
                  onCreateTest={handleCreateTest}
                />
              )}

              {activeTab === 'assignments' && (
                <AssignmentsView 
                  users={users}
                  tests={tests}
                  assignments={assignments}
                  assign4={assign4}
                  setAssign4={setAssign4}
                  onCreateAssignment={handleCreateAssignment}
                />
              )}

              {activeTab === 'results' && (
                <ResultsView 
                  results={results}
                  onUpdateResult={handleUpdateResult}
                />
              )}

              {activeTab === 'testCreator' && <TestCreator />}
              {activeTab === 'testDemo' && <TestDemo />}
              {activeTab === 'speakingChecker' && (
                <div>
                  <h2>🎤 Speaking Checker Panel</h2>
                  <SpeakerCheckerPanel />
                </div>
              )}
              {activeTab === 'writingChecker' && <WritingCheckerPanel />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Dashboard View Component
const DashboardView = ({ users, tests, results, assignments }) => {
  const stats = [
    { label: 'Пользователей', value: users.length, icon: '👥' },
    { label: 'Тестов', value: tests.length, icon: '📝' },
    { label: 'Результатов', value: results.length, icon: '📈' },
    { label: 'Назначений', value: assignments.length, icon: '🔗' }
  ];

  return (
    <div>
      <h2>📊 Дашборд</h2>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-number">{stat.value}</div>
            <div className="stat-label">{stat.icon} {stat.label}</div>
          </div>
        ))}
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3><span className="card-icon">📊</span>Последние результаты</h3>
          <div>
            {results.slice(0, 5).map(result => (
              <div key={result._id} style={{ padding: '10px 0', borderBottom: '1px solid #e9ecef' }}>
                <strong>{result.user?.username}</strong> - {result.test?.name}
                <span className={`status-badge status-${result.status}`} style={{ float: 'right' }}>
                  {result.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3><span className="card-icon">👥</span>Последние пользователи</h3>
          <div>
            {users.slice(0, 5).map(user => (
              <div key={user._id} style={{ padding: '10px 0', borderBottom: '1px solid #e9ecef' }}>
                <strong>{user.username}</strong> ({user.role})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Users View Component
const UsersView = ({ users, newUser, setNewUser, onCreateUser }) => {
  return (
    <div>
      <h2>👥 Управление пользователями</h2>
      
      <div className="admin-form">
        <h3>Создать нового пользователя</h3>
        <form onSubmit={onCreateUser}>
          <div className="form-row">
            <div className="form-group">
              <label>Имя пользователя</label>
              <input 
                className="form-control"
                placeholder="Введите имя пользователя" 
                value={newUser.username} 
                onChange={(e) => setNewUser(v => ({...v, username: e.target.value}))} 
              />
            </div>
            <div className="form-group">
              <label>Пароль</label>
              <input 
                className="form-control"
                type="password" 
                placeholder="Введите пароль" 
                value={newUser.password} 
                onChange={(e) => setNewUser(v => ({...v, password: e.target.value}))} 
              />
            </div>
            <div className="form-group">
              <label>Роль</label>
              <select 
                className="form-control"
                value={newUser.role} 
                onChange={(e) => setNewUser(v => ({...v, role: e.target.value}))}
              >
                <option value="user">Пользователь</option>
                <option value="admin">Администратор</option>
                <option value="speaking-checker">Speaking Checker</option>
                <option value="writing-checker">Writing Checker</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Создать пользователя</button>
          </div>
        </form>
      </div>

      <div className="admin-table">
        <h3>Список пользователей</h3>
        <table>
          <thead>
            <tr>
              <th>Имя пользователя</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Дата создания</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`status-badge status-${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Tests View Component
const TestsView = ({ tests, newTest, setNewTest, onCreateTest }) => {
  return (
    <div>
      <h2>📝 Управление тестами</h2>
      
      <div className="admin-form">
        <h3>Создать новый тест</h3>
        <form onSubmit={onCreateTest}>
          <div className="form-row">
            <div className="form-group">
              <label>Название теста</label>
              <input 
                className="form-control"
                placeholder="Введите название теста" 
                value={newTest.name} 
                onChange={(e) => setNewTest(v => ({...v, name: e.target.value}))} 
              />
            </div>
            <div className="form-group">
              <label>Описание</label>
              <input 
                className="form-control"
                placeholder="Введите описание теста" 
                value={newTest.description} 
                onChange={(e) => setNewTest(v => ({...v, description: e.target.value}))} 
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Создать тест</button>
          </div>
        </form>
        
        <div className="file-upload">
          <h4>Загрузить PDF тест</h4>
          <form onSubmit={async (e) => { 
            e.preventDefault(); 
            const file = e.currentTarget.pdf.files[0]; 
            if (!file) return; 
            const form = new FormData(); 
            form.append('pdf', file); 
            try {
              await api.post('/tests/upload-pdf', form, { headers: { 'Content-Type': 'multipart/form-data' } }); 
              alert('PDF успешно загружен!');
            } catch (error) {
              alert('Ошибка загрузки PDF: ' + error.message);
            }
          }}>
            <input type="file" name="pdf" accept="application/pdf" id="pdf-upload" />
            <label htmlFor="pdf-upload">📁 Выберите PDF файл</label>
            <button type="submit" className="btn btn-success" style={{ marginTop: '15px' }}>Загрузить PDF</button>
          </form>
        </div>
      </div>

      <div className="admin-table">
        <h3>Список тестов</h3>
        <table>
          <thead>
            <tr>
              <th>Название</th>
              <th>Описание</th>
              <th>Дата создания</th>
            </tr>
          </thead>
          <tbody>
            {tests.map(test => (
              <tr key={test._id}>
                <td>{test.name}</td>
                <td>{test.description}</td>
                <td>{new Date(test.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Assignments View Component
const AssignmentsView = ({ users, tests, assignments, assign4, setAssign4, onCreateAssignment }) => {
  return (
    <div>
      <h2>🔗 Управление назначениями</h2>
      
      <div className="admin-form">
        <h3>Создать назначение для пользователя</h3>
        <form onSubmit={onCreateAssignment}>
          <div className="form-row">
            <div className="form-group">
              <label>Пользователь</label>
              <select 
                className="form-control"
                value={assign4.userId} 
                onChange={(e) => setAssign4(v => ({...v, userId: e.target.value}))}
              >
                <option value="">Выберите пользователя</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Listening тест</label>
              <select 
                className="form-control"
                value={assign4.listeningTestId} 
                onChange={(e) => setAssign4(v => ({...v, listeningTestId: e.target.value}))}
              >
                <option value="">Listening тест</option>
                {tests.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Reading тест</label>
              <select 
                className="form-control"
                value={assign4.readingTestId} 
                onChange={(e) => setAssign4(v => ({...v, readingTestId: e.target.value}))}
              >
                <option value="">Reading тест</option>
                {tests.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Writing тест</label>
              <select 
                className="form-control"
                value={assign4.writingTestId} 
                onChange={(e) => setAssign4(v => ({...v, writingTestId: e.target.value}))}
              >
                <option value="">Writing тест</option>
                {tests.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Speaking тест</label>
              <select 
                className="form-control"
                value={assign4.speakingTestId} 
                onChange={(e) => setAssign4(v => ({...v, speakingTestId: e.target.value}))}
              >
                <option value="">Speaking тест</option>
                {tests.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Создать назначение</button>
          </div>
        </form>
      </div>

      <div className="admin-table">
        <h3>Список назначений</h3>
        <table>
          <thead>
            <tr>
              <th>Пользователь</th>
              <th>Listening</th>
              <th>Reading</th>
              <th>Writing</th>
              <th>Speaking</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(a => (
              <tr key={a._id}>
                <td>{a.user?.username}</td>
                <td>{a.listeningTest?.name || '-'}</td>
                <td>{a.readingTest?.name || '-'}</td>
                <td>{a.writingTest?.name || '-'}</td>
                <td>{a.speakingTest?.name || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Results View Component
const ResultsView = ({ results, onUpdateResult }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'submitted': return 'status-submitted';
      case 'reviewing': return 'status-reviewing';
      case 'finalized': return 'status-finalized';
      case 'published': return 'status-published';
      default: return 'status-submitted';
    }
  };

  return (
    <div>
      <h2>📈 Управление результатами</h2>
      
      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Пользователь</th>
              <th>Тест</th>
              <th>Статус</th>
              <th>Финальная оценка</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {results.map(r => (
              <tr key={r._id}>
                <td>{r.user?.username}</td>
                <td>{r.test?.name}</td>
                <td>
                  <span className={`status-badge ${getStatusBadgeClass(r.status)}`}>
                    {r.status}
                  </span>
                </td>
                <td>{r.finalBand || '-'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => onUpdateResult(r._id, { status: 'reviewing' })}
                      className="btn btn-warning"
                      style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                    >
                      На проверку
                    </button>
                    <button 
                      onClick={() => finalizeResult(r._id)}
                      className="btn btn-success"
                      style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                    >
                      Завершить
                    </button>
                    <button 
                      onClick={() => publishResult(r._id)}
                      className="btn btn-primary"
                      style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                    >
                      Опубликовать
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;

