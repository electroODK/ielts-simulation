import React, { useEffect, useState } from "react";
import { getUsers, createUser } from "../api/api";
import { getTests, createTest, assignTestToUser } from "../api/api";
import { createAssignment, listAssignments } from "../api/api";
import api from "../api/api";
import { getAllResults, updateResult, finalizeResult, publishResult } from "../api/api";
import TestCreator from "./TestCreator";
import TestDemo from "./TestDemo";

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
    <div style={{ padding: 24 }}>
      <h1>Admin Panel</h1>
      
      <div style={{ marginBottom: 20 }}>
        <button 
          onClick={() => setActiveTab('main')} 
          style={{ 
            marginRight: 10, 
            padding: '10px 20px',
            backgroundColor: activeTab === 'main' ? '#3498db' : '#ecf0f1',
            color: activeTab === 'main' ? 'white' : '#2c3e50',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Основная панель
        </button>
        <button 
          onClick={() => setActiveTab('testCreator')} 
          style={{ 
            padding: '10px 20px',
            backgroundColor: activeTab === 'testCreator' ? '#3498db' : '#ecf0f1',
            color: activeTab === 'testCreator' ? 'white' : '#2c3e50',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Создание тестов
        </button>
        <button 
          onClick={() => setActiveTab('testDemo')} 
          style={{ 
            padding: '10px 20px',
            backgroundColor: activeTab === 'testDemo' ? '#3498db' : '#ecf0f1',
            color: activeTab === 'testDemo' ? 'white' : '#2c3e50',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Демо тестов
        </button>
      </div>

      {activeTab === 'testCreator' ? (
        <TestCreator />
      ) : activeTab === 'testDemo' ? (
        <TestDemo />
      ) : (
        <>
          <section>
            <h2>Create user</h2>
            <form onSubmit={handleCreateUser}>
              <input placeholder="username" value={newUser.username} onChange={(e)=>setNewUser(v=>({...v, username:e.target.value}))} />
              <input placeholder="password" type="password" value={newUser.password} onChange={(e)=>setNewUser(v=>({...v, password:e.target.value}))} />
              <select value={newUser.role} onChange={(e)=>setNewUser(v=>({...v, role:e.target.value}))}>
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="speaking-checker">speaking-checker</option>
                <option value="writing-checker">writing-checker</option>
              </select>
              <button type="submit">Create</button>
            </form>
          </section>


          <section>
            <h2>Assign test to user</h2>
            <form onSubmit={handleAssign}>
              <select value={assign.userId} onChange={(e)=>setAssign(v=>({...v, userId:e.target.value}))}>
                <option value="">Select user</option>
                {users.map(u=> <option key={u._id} value={u._id}>{u.username}</option>)}
              </select>
              <select value={assign.testId} onChange={(e)=>setAssign(v=>({...v, testId:e.target.value}))}>
                <option value="">Select test</option>
                {tests.map(t=> <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
              <button type="submit">Assign</button>
            </form>
          </section>

          {/* <section>
            <h2>Assign 4 sections to user</h2>
            <form onSubmit={handleCreateAssignment}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                <select value={assign4.userId} onChange={(e)=>setAssign4(v=>({...v, userId:e.target.value}))}>
                  <option value="">Select user</option>
                  {users.map(u=> <option key={u._id} value={u._id}>{u.username}</option>)}
                </select>
                <select value={assign4.listeningTestId} onChange={(e)=>setAssign4(v=>({...v, listeningTestId:e.target.value}))}>
                  <option value="">Listening test</option>
                  {tests.map(t=> <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
                <select value={assign4.readingTestId} onChange={(e)=>setAssign4(v=>({...v, readingTestId:e.target.value}))}>
                  <option value="">Reading test</option>
                  {tests.map(t=> <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
                <select value={assign4.writingTestId} onChange={(e)=>setAssign4(v=>({...v, writingTestId:e.target.value}))}>
                  <option value="">Writing test</option>
                  {tests.map(t=> <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
                <select value={assign4.speakingTestId} onChange={(e)=>setAssign4(v=>({...v, speakingTestId:e.target.value}))}>
                  <option value="">Speaking test</option>
                  {tests.map(t=> <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>
              <button type="submit" style={{ marginTop: 8 }}>Create Assignment</button>
            </form>
            <div style={{ marginTop: 12 }}>
              <h3>Assignments</h3>
              <ul>
                {assignments.map(a => (
                  <li key={a._id}>
                    {a.user?.username}: L={a.listeningTest?.name} | R={a.readingTest?.name} | W={a.writingTest?.name} | S={a.speakingTest?.name}
                  </li>
                ))}
              </ul>
            </div>
          </section> */}

          <section>
            <h2>Results</h2>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Test</th>
                  <th>Status</th>
                  <th>Final</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              {results.map(r=> (
                <tr key={r._id}>
                  <td>{r.user?.username}</td>
                  <td>{r.test?.name}</td>
                  <td>{r.status}</td>
                  <td>{r.finalBand}</td>
                  <td>
                    <button onClick={()=>handleUpdateResult(r._id, { status: 'reviewing' })}>Mark reviewing</button>
                    <button onClick={()=>finalizeResult(r._id).then(load)}>Finalize</button>
                    <button onClick={()=>publishResult(r._id).then(load)}>Publish</button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
