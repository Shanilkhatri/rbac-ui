import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../services/authService'; // Adjust import as needed

const ProtectedRoute: React.FC = () => {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  // If authenticated, render the nested routes using Outlet
  return <Outlet />;
};

export default ProtectedRoute;
