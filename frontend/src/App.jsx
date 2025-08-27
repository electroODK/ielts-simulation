import React from 'react';
import Login from './components/Login';
import EndPage from './components/EndingPage'
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';

const App = () => {
  return <div>
<AuthProvider>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/endpage' element={<EndPage/>}/>

    </Routes>
    </AuthProvider>
  </div>;
};

export default App;
