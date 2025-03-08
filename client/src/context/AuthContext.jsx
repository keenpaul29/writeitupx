import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'https://writeitupx-server.onrender.com' : 'http://localhost:5000';
axios.defaults.withCredentials = true;

// Helper function to set auth header
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Check if token is expired
        const decodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          // Token is expired
          logout();
          setLoading(false);
          return;
        }
        
        // Set auth header
        setAuthToken(token);
        
        // Get user data
        const response = await axios.get('/api/auth/check-status');
        
        if (response.data.authenticated) {
          setCurrentUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Auth check error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  const login = async (token) => {
    try {
      localStorage.setItem('token', token);
      
      // Set auth header
      setAuthToken(token);
      
      // Get user data
      const response = await axios.get('/api/auth/check-status');
      
      if (response.data.authenticated) {
        setCurrentUser(response.data.user);
        setIsAuthenticated(true);
        setError(null);
        return true;
      } else {
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
    localStorage.removeItem('token');
    setAuthToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post('/api/auth/refresh-token');
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      setAuthToken(token);
      
      return true;
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