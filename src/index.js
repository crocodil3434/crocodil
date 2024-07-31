import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext'; // AuthProvider'ı import et

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
    <AuthProvider> {/* App'i AuthProvider ile sarmala */}
      <App />
    </AuthProvider>
    </Router>
  </React.StrictMode>
);

// Performans ölçümü yapmak istiyorsanız, bir fonksiyonu reportWebVitals'a geçirebilirsiniz
// Örneğin: reportWebVitals(console.log)
reportWebVitals();
