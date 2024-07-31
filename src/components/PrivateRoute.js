// src/components/PrivateRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext'; // useAuth hook'unu import edin

const PrivateRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth(); // useAuth hook'unu kullanarak currentUser bilgisini alın
  const [userRole, setUserRole] = useState('');
  const location = useLocation();

  useEffect(() => {
    const getUserRole = async () => {
      if (currentUser?.uid) {
        // Veritabanından kullanıcının rolünü çek
        const docRef = doc(firestore, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().role) {
          setUserRole(docSnap.data().role);
        } else {
          console.log("Kullanıcı rolü bulunamadı.");
        }
      }
    };

    getUserRole();
  }, [currentUser]);

  if (!currentUser) {
    // Kullanıcı giriş yapmamışsa, login sayfasına yönlendir
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!currentUser.emailVerified) {
    // Kullanıcının e-postası doğrulanmamışsa, e-posta doğrulama sayfasına yönlendir
    return <Navigate to="/emailverification" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Kullanıcı yetkisi uygun değilse, ana sayfaya veya uygun bir sayfaya yönlendir
    const redirectPath = userRole === 'doctor' ? '/dashboard' : '/pdashboard';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
