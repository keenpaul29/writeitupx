import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

// Configure axios defaults
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

console.log('API URL:', API_URL); // Debug log

// Helper function to set auth header
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
    console.log('Token set in localStorage and headers'); // Debug log
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    console.log('Token removed from localStorage and headers'); // Debug log
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuthStatus = async (token) => {
    try {
      if (!token) {
        console.log('No token found'); // Debug log
        return false;
      }

      // Check if token is expired
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        console.log('Token is expired'); // Debug log
        return false;
      }

      // Set auth header
      setAuthToken(token);

      // Get user data
      console.log('Checking auth status...'); // Debug log
      const response = await axios.get('/api/auth/check-status');
      console.log('Auth status response:', response.data); // Debug log

      if (response.data.authenticated) {
        setCurrentUser(response.data.user);
        setIsAuthenticated(true);
        setError(null);
        console.log('User authenticated:', response.data.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const isValid = await checkAuthStatus(token);
        
        if (!isValid) {
          logout();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (token) => {
    try {
      console.log('Login attempt with token:', token ? 'present' : 'missing'); // Debug log
      const isValid = await checkAuthStatus(token);

      if (isValid) {
        console.log('Login successful');
        return true;
      } else {
        console.log('Login failed - invalid auth status');
        logout();
        setError('Authentication failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      logout();
      setError(error.response?.data?.message || 'Authentication failed');
      return false;
    }
  };

  const logout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setError(null);
    console.log('Logged out');
  };

  const refreshToken = async () => {
    try {
      console.log('Attempting to refresh token...'); // Debug log
      const response = await axios.post('/api/auth/refresh-token');
      const { token } = response.data;
      
      setAuthToken(token);
      return await checkAuthStatus(token);
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        refreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 