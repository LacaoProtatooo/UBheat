import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ element, isAuthenticated, isAdmin, adminOnly }) => {
  if (!isAuthenticated) {
    
    toast.error('Please log in to access this page.');
    return <Navigate to="/" replace state={{ message: 'Please log in to access this page.' }} />;
  }

  if (adminOnly && !isAdmin) {
    toast.error('You are not authorized to access this page.');
    return <Navigate to="/" replace state={{ message: 'Error 401: User Unauthorized.' }} />;
  }

  return element;
};

export default ProtectedRoute;
