import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import userService from '../../services/userService';

/**
 * ProtectedRoute component that checks if user is authenticated
 * If not authenticated, redirects to login page
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { token } = userService.getAuthData();
  
  if (!token) {
    // Redirect to login page, but remember where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

export default ProtectedRoute;