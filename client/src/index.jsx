import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Add error logging
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

if (process.env.NODE_ENV === 'production') {
  console.log('Environment:', process.env.NODE_ENV);
  console.log('API URL:', import.meta.env.VITE_API_URL);
  console.log('Base URL:', window.location.origin);
}
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

