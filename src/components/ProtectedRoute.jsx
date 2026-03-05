import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const userStr = localStorage.getItem('vinyl_user');
    const token = localStorage.getItem('vinyl_token');

    if (!token || !userStr) {
        // Not logged in
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userStr);
        if (allowedRoles && !allowedRoles.includes(user.role)) {
            // Logged in but doesn't have required role
            return <Navigate to="/" replace />;
        }
    } catch (error) {
        console.error("Error parsing user data", error);
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
