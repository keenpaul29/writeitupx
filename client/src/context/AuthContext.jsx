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
  try {
    if (token) {
      // Store token in localStorage first
      localStorage.setItem('token', token);
      // Then set axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Token stored in localStorage:', localStorage.getItem('token')); // Verify storage
      console.log('Token set in headers:', axios.defaults.headers.common['Authorization']); // Verify header
      return true;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      console.log('Token removed from localStorage and headers');
      return false;
    }
  } catch (error) {
    console.error('Error setting auth token:', error);
    return false;
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
        console.log('No token provided to checkAuthStatus');
        return false;
      }

      // Check if token is expired
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        console.log('Token is expired');
        return false;
      }

      // Set auth header and verify token storage
      const tokenSet = setAuthToken(token);
      if (!tokenSet) {
        console.log('Failed to set auth token');
        return false;
      }

      // Verify token is in localStorage
      const storedToken = localStorage.getItem('token');
      console.log('Stored token matches:', storedToken === token);

      // Get user data
      console.log('Making auth status request...');
      const response = await axios.get('/api/auth/check-status');
      console.log('Auth status response:', response.data);

      if (response.data.authenticated) {
        setCurrentUser(response.data.user);
        setIsAuthenticated(true);
        setError(null);
        console.log('Authentication successful:', response.data.user);
        return true;
      }

      console.log('Server returned not authenticated');
      return false;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const token = localStorage.getItem('token');
        console.log('Found token in localStorage:', token ? 'yes' : 'no');
        
        const isValid = await checkAuthStatus(token);
        console.log('Token validation result:', isValid);
        
        if (!isValid) {
          console.log('Invalid token, logging out');
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
      if (!token) {
        console.error('No token provided to login');
        return false;
      }

      console.log('Starting login process with token');
      const isValid = await checkAuthStatus(token);

      if (isValid) {
        console.log('Login successful, token stored and validated');
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
    try {
      setAuthToken(null);
      setCurrentUser(null);
      setIsAuthenticated(false);
      setError(null);
      console.log('Logout complete, auth state cleared');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshToken = async () => {
    try {
      console.log('Attempting to refresh token...');
      const response = await axios.post('/api/auth/refresh-token');
      const { token } = response.data;
      
      if (!token) {
        console.log('No token received from refresh request');
        return false;
      }

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