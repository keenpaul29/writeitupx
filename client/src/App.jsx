import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from './hooks/useAuth';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LetterEditor from './pages/LetterEditor';
import AuthSuccess from './pages/AuthSuccess';
import NotFound from './pages/NotFound';

// Components
import Layout from './components/Layout';

<<<<<<< HEAD
// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

=======
>>>>>>> 2a5f2f12f9bce822fb160c1e7cc8688cfe67684b
// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
<<<<<<< HEAD
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="auth/success" element={<AuthSuccess />} />
            <Route 
              path="dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="editor/:id" 
              element={
                <ProtectedRoute>
                  <LetterEditor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="editor" 
              element={
                <ProtectedRoute>
                  <LetterEditor />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App; 
=======
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="auth/success" element={<AuthSuccess />} />
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="editor/:id" 
            element={
              <ProtectedRoute>
                <LetterEditor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="editor" 
            element={
              <ProtectedRoute>
                <LetterEditor />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App; 
>>>>>>> 2a5f2f12f9bce822fb160c1e7cc8688cfe67684b
