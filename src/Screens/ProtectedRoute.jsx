import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdminLoggedIn');

  if (isAdmin !== 'true') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
