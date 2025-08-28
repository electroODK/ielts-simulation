import React from 'react';
import Login from './components/Login';
import EndPage from './components/EndingPage'
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import AdminPanel from './components/AdminPanel';
import SpeakingCheckerPanel from './components/SpeakingCheckerPanel';
import WritingCheckerPanel from './components/WritingCheckerPanel';
import ListeningExam from './components/ListeningExam';
import ReadingExam from './components/ReadingExam';
import StartPage from './components/StartPage';
import WritingExam from './components/WritingExam';
import SpeakingExam from './components/SpeakingExam';
import AdminLogin from './components/AdminLogin';

const ProtectedRoute = ({ children, allow }) => {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn) return <Navigate to="/" replace />;
  if (allow && Array.isArray(allow) && !allow.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return <div>
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/admin/login' element={<AdminLogin/>}/>
        <Route path='/endpage' element={<EndPage/>}/>
        <Route path='/admin' element={
          <ProtectedRoute allow={["admin"]}>
            <AdminPanel />
          </ProtectedRoute>
        }/>
        <Route path='/exam/listening/:id' element={
          <ProtectedRoute allow={["user", "admin"]}>
            <ListeningExam />
          </ProtectedRoute>
        }/>
        <Route path='/checker/speaking' element={
          <ProtectedRoute allow={["admin", "speaking-checker"]}>
            <SpeakingCheckerPanel />
          </ProtectedRoute>
        }/>
        <Route path='/checker/writing' element={
          <ProtectedRoute allow={["admin", "writing-checker"]}>
            <WritingCheckerPanel />
          </ProtectedRoute>
        }/>
        <Route path='/exam/reading/:id' element={
          <ProtectedRoute allow={["user", "admin"]}>
            <ReadingExam />
          </ProtectedRoute>
        }/>
        <Route path='/exam/start/:id' element={
          <ProtectedRoute allow={["user", "admin"]}>
            <StartPage />
          </ProtectedRoute>
        }/>
        <Route path='/exam/writing/:id' element={
          <ProtectedRoute allow={["user", "admin"]}>
            <WritingExam />
          </ProtectedRoute>
        }/>
        <Route path='/exam/speaking/:id' element={
          <ProtectedRoute allow={["user", "admin"]}>
            <SpeakingExam />
          </ProtectedRoute>
        }/>
      </Routes>
    </AuthProvider>
  </div>;
};

export default App;
