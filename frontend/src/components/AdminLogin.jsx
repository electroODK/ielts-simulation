import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { loginAdmin } from '../api/api';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginAdmin(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '64px auto' }}>
      <h2>Admin Login</h2>
      <form onSubmit={submit}>
        <div>
          <label>Username</label>
          <input value={username} onChange={(e)=>setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button disabled={loading} type='submit'>{loading ? '...' : 'Login'}</button>
      </form>
    </div>
  );
};

export default AdminLogin;

