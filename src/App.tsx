import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import DashboardLayout from './components/DashboardLayout';
import PermissionsPage from './pages/PermissionsPage';
import { isAuthenticated } from './services/authService';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
const App: React.FC = () => {
  console.log("isAuthenticated:",isAuthenticated());
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/permissions" element={<PermissionsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
};

export default App;
