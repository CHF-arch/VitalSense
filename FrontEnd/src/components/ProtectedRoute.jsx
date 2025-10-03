import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../context/authStore';

const ProtectedRoute = () => {
    const token = useAuthStore.getState().token; // Check for access token

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
