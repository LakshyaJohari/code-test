// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ adminToken, redirectPath = '/admin-login' }) => {
  if (!adminToken) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />; // Renders the child route components
};

export default ProtectedRoute;