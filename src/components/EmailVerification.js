import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import Swal from 'sweetalert2';

function EmailVerification() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const Logo = 'logo-v.png'

  useEffect(() => {
    // Kullanıcı durumunun yüklendiğinden emin olun
    const unsubscribe = auth.onAuthStateChanged(user => {
      setLoading(false);
    });

    // Cleanup
    return unsubscribe;
  }, []);

  const resendVerificationEmail = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      Swal.fire('Başarılı!', 'Doğrulama e-postası gönderildi.', 'success');
    } catch (error) {
      Swal.fire('Hata!', error.message, 'error');
    }
  };

  // Kullanıcı yüklenirken bir yükleme mesajı göster
  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  // Kullanıcı girişi yapılmamışsa yönlendirme veya bilgilendirme yap
  if (!currentUser) {
    return <div>Lütfen giriş yapın.</div>;
  }

  return (
    <>
    <main className="relative isolate min-h-screen bg-gray-50">
      <img
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        alt="Email Verification Background"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <img
          src={Logo}
          alt="Your Logo"
          className="h-20 w-auto mb-8"
        />
        <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-md rounded-xl p-8 shadow-lg">
          <h1 className="text-center text-3xl font-extrabold text-gray-900">E-posta Doğrulama</h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Lütfen <span className="font-medium">{currentUser.email}</span> adresindeki e-postanızı doğrulayın.
          </p>
          <div className="mt-6">
            <button
              onClick={resendVerificationEmail}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Doğrulama E-postasını Tekrar Gönder
            </button>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sayfayı Yenile
            </button>
          </div>
        </div>
      </div>
    </main>
  </>

  );
}

export default EmailVerification;
