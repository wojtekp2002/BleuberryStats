import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import PrivateRoute from './components/PrivateRoute';
import axios from 'axios';
import MyGroupPage from './pages/MyGroup';
import PaymentsPage from './pages/Payments';

function App() {
  const raw = localStorage.getItem('user');
  const user = raw ? JSON.parse(raw) : null;
  axios.defaults.baseURL = 'http://localhost:3001';

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              {user?.role === 'EMPLOYER'
                ? <EmployerDashboard />
                : <EmployeeDashboard />
              }
            </PrivateRoute>
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard/employee"
          element={<PrivateRoute><EmployeeDashboard /></PrivateRoute>}
        />
        <Route
          path="/dashboard/employer"
          element={<PrivateRoute><EmployerDashboard /></PrivateRoute>}
        />


        <Route path='/group' element={<PrivateRoute><MyGroupPage/></PrivateRoute>}/>
        <Route path='/payments' element={<PrivateRoute><PaymentsPage/></PrivateRoute>}/>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
