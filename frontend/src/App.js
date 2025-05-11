import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import EntriesPage from './pages/Entries';
import PaymentsPage from './pages/Payments';
import MyGroupPage from './pages/MyGroup';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const raw = localStorage.getItem('user');
  const user = raw ? JSON.parse(raw) : null;
  console.log('[DEBUG] user:', user);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user
              ? user.role === 'EMPLOYER'
                ? <Navigate to="/dashboard/employer" replace />
                : <Navigate to="/dashboard/employee" replace />
              : <Navigate to="/login" replace />
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboards */}
        <Route
          path="/dashboard/employee"
          element={
            <PrivateRoute>
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/employer"
          element={
            <PrivateRoute>
              <EmployerDashboard />
            </PrivateRoute>
          }
        />

        {/* Inne zakładki */}
        <Route path="/group"   element={<PrivateRoute><MyGroupPage/></PrivateRoute>} />
        <Route path="/entries" element={<PrivateRoute><EntriesPage/></PrivateRoute>} />
        <Route path="/payments" element={<PrivateRoute><PaymentsPage/></PrivateRoute>} />

        {/* Wszystkie inne ścieżki */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
