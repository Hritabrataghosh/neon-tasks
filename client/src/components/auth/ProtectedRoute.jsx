import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute check:', { user: user?.username, loading, path: location.pathname });

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--dark-bg)',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div className="cyber-loader" />
        <p style={{ color: 'var(--neon-cyan)', fontFamily: 'Orbitron' }}>AUTHENTICATING...</p>
      </div>
    );
  }

  if (!user) {
    console.log('❌ No user, redirecting to /auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log('✅ User authenticated, rendering protected content');
  return children;
};

export default ProtectedRoute;