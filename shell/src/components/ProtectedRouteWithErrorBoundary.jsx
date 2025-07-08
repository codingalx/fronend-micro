// ProtectedRouteWithErrorBoundary.jsx
import React from 'react';
import ProtectedRoute from './Security/ProtectedRoute';
import ErrorBoundary from './NotFound/ErrorBoundary';

const ProtectedRouteWithErrorBoundary = ({ children }) => {
    return (
        <ProtectedRoute>
            <ErrorBoundary>
                {children}
            </ErrorBoundary>
        </ProtectedRoute>
    );
};

export default ProtectedRouteWithErrorBoundary;