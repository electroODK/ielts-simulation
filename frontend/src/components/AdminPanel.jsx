import React, { useEffect, useState } from "react";
import { getUsers, createUser } from "../api/api";
import { getTests, createTest, assignTestToUser } from "../api/api";
import { getAllResults, updateResult, finalizeResult, publishResult } from "../api/api";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);

  const [newUser, setNewUser] = useState({ username: "", password: "", role: "user" });
  const [newTest, setNewTest] = useState({ name: "", description: "" });
  const [assign, setAssign] = useState({ userId: "", testId: "" });

  const load = async () => {
    try {
      const [u, t, r] = await Promise.all([getUsers(), getTests(), getAllResults()]);
      setUsers(u);
      setTests(t);
      setResults(r);
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

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Panel</h1>

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
        <h2>Create test</h2>
        <form onSubmit={handleCreateTest}>
          <input placeholder="name" value={newTest.name} onChange={(e)=>setNewTest(v=>({...v, name:e.target.value}))} />
          <input placeholder="description" value={newTest.description} onChange={(e)=>setNewTest(v=>({...v, description:e.target.value}))} />
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
    </div>
  );
};

export default AdminPanel;

