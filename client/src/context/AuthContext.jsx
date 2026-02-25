import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log('✅ Auth restored from storage');
        } catch (e) {
          console.error('❌ Failed to restore auth:', e);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      console.log('🔑 Attempting login...', email);

      const res = await api.post('/auth/login', { email, password });

      const { token, ...userData } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userData);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed (server unreachable?)';
      console.error('❌ Login error:', msg);
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (username, email, password) => {
    try {
      setError(null);
      console.log('📝 Registering user...');

      const res = await api.post('/auth/register', { username, email, password });

      const { token, ...userData } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userData);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      console.error('❌ Register error:', msg);
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
  };

  const updateUser = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateUser, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);