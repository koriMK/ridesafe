import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const userData = await apiService.getProfile();
      setUser(userData);
    } catch (err) {
      localStorage.removeItem('token');
      apiService.clearToken();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    setUser(userData);
    apiService.setToken(token);
  };

  const logout = () => {
    setUser(null);
    apiService.clearToken();
    window.location.href = '/';
  };

  const isRole = (role) => {
    return user?.role === role;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isRole,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};