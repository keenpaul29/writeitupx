import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

// Configure axios defaults
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

// Debug logs for configuration
if (process.env.NODE_ENV === 'production') {
  console.log('Production environment detected');
  console.log('API URL configured as:', API_URL);
}

// Helper function to set auth header
const setAuthToken = (token) => {
  try {
    if (token) {
      console.log('Setting auth token:', token.substring(0, 10) + '...');
      
      // Store token in localStorage first
      localStorage.setItem('token', token);
      console.log('Token stored in localStorage');
      
      // Then set axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Token set in Authorization header');
      
      // Verify storage
      const storedToken = localStorage.getItem('token');
      const headerToken = axios.defaults.headers.common['Authorization'];
      
      if (!storedToken || !headerToken) {
        console.error('Token storage verification failed:', {
          localStorage: !!storedToken,
          header: !!headerToken
        });
        return false;
      }
      
      return true;
    } else {
      console.log('Clearing auth token');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      return true;
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
  const [initialized, setInitialized] = useState(false);

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

      // Get user data
      const response = await axios.get('/api/auth/check-status');

      if (response.data.authenticated) {
        setCurrentUser(response.data.user);
        setIsAuthenticated(true);
        setError(null);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  };

  const login = async (token) => {
    try {
      if (!token) {
        console.error('No token provided to login');
        return false;
      }

      console.log('Starting login process with token:', token.substring(0, 10) + '...');
      
      // First set the token
      const tokenSet = setAuthToken(token);
      if (!tokenSet) {
        throw new Error('Failed to store authentication token');
      }

      // Then check auth status
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
    try {
      console.log('Starting logout process');
      setAuthToken(null);
      setCurrentUser(null);
      setIsAuthenticated(false);
      setError(null);
      console.log('Logout complete, auth state cleared');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // Prevent multiple initializations
      if (initialized) {
        return;
      }
      
      try {
        console.log('Initializing auth...');
        const token = localStorage.getItem('token');
        
        if (token) {
          console.log('Found token in localStorage, validating...');
          const isValid = await checkAuthStatus(token);
          
          if (!isValid) {
            console.log('Token validation failed, logging out');
            logout();
          } else {
            console.log('Token validation successful');
          }
        } else {
          console.log('No token found in localStorage');
          logout();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        checkAuthStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 