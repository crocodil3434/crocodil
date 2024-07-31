import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { signOut } from 'firebase/auth';
import Swal from 'sweetalert2';
import { auth } from './firebaseConfig';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './doctor/Dashboard';
import PDashboard from './patient/PDashboard';
import PatientDetail from './doctor/PatientDetail';
import EmailVerification from './components/EmailVerification';

function App() {
  const { currentUser, userType } = useAuth();

  const requireAuth = (destination) => {
    if (!currentUser) {
      Swal.fire('Giriş Yapınız', 'Bu sayfayı görüntülemek için giriş yapmalısınız.', 'warning');
      return <Navigate to="/login" />;
    } else if (userType === 'doctor' && destination === 'patient') {
      return <Navigate to="/dashboard" />;
    } else if (userType === 'patient' && destination === 'doctor') {
      return <Navigate to="/pdashboard" />;
    }
    return null;
  };

  const Logout = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
      try {
        await signOut(auth);
        Swal.fire('Başarıyla Çıkış Yapıldı', '', 'success').then(() => navigate('/login'));
      } catch (error) {
        Swal.fire('Çıkış Yapılırken Hata Oluştu', error.message, 'error');
      }
    };

    React.useEffect(() => {
      handleLogout();
    }, []);

    return null;
  };

  return (
    <Router>
      <div>
        <Routes>
        <Route path="/emailverification" element={<EmailVerification />} />
          <Route path="/" element={<Home />} />
          <Route path="/register" element={!currentUser ? <Register /> : userType === 'unverified' ? <Navigate to="/emailverification" /> : userType === 'doctor' ? <Navigate to="/dashboard" /> : <Navigate to="/pdashboard" />} />
          <Route path="/login" element={!currentUser ? <Login /> : userType === 'unverified' ? <Navigate to="/emailverification" /> : userType === 'doctor' ? <Navigate to="/dashboard" /> : <Navigate to="/pdashboard" />} />
          <Route path="/dashboard" element={currentUser ? userType === 'patient' ? <Navigate to="/pdashboard" /> : <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/pdashboard" element={currentUser ? userType === 'doctor' ? <Navigate to="/dashboard" /> : <PDashboard /> : <Navigate to="/login" />} />
          <Route path="/patient/:id" element={currentUser ? requireAuth('patient') || <PatientDetail /> : <Navigate to="/login" />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
