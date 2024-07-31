import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Kullanıcı zaten giriş yapmışsa kontrol et
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigateUser(user.uid);
      }
    });
  }, []);

  const navigateUser = async (userId) => {
    // Doktor kontrolü
    const docRef = doc(firestore, "doctors", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      navigate('/dashboard'); // Doktor dashboard'a yönlendir
      return;
    }

    // Hasta kontrolü
    const patientRef = doc(firestore, "patients", userId);
    const patientSnap = await getDoc(patientRef);
    if (patientSnap.exists()) {
      navigate('/pdashboard'); // Hasta dashboard'a yönlendir
      return;
    }

    // Doktor veya hasta bulunamazsa, kullanıcıyı giriş sayfasına yönlendir
    Swal.fire('Hata!', 'Kullanıcı doktorlar veya hastalar arasında bulunamadı.', 'error');
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      navigateUser(userCredential.user.uid);
    } catch (error) {
      Swal.fire('Hata!', error.message, 'error');
    }
  };

  const handleForgotPassword = () => {
    Swal.fire({
      title: 'Şifre Sıfırlama',
      input: 'email',
      inputLabel: 'E-posta Adresinizi Girin',
      inputPlaceholder: 'example@example.com',
      confirmButtonText: 'Şifre Sıfırlama Bağlantısı Gönder',
      showCancelButton: true,
      cancelButtonText: 'İptal',
      preConfirm: (email) => {
        if (!email) {
          Swal.showValidationMessage('Lütfen geçerli bir e-posta adresi girin');
        } else {
          return sendPasswordResetEmail(auth, email)
            .then(() => {
              Swal.fire('Başarılı!', 'Şifre sıfırlama bağlantınız e-posta adresinize gönderildi.', 'success');
            })
            .catch((error) => {
              Swal.showValidationMessage(`İstek başarısız: ${error.message}`);
            });
        }
      }
    });
  };

  return (
    <section className="bg-[url('https://firebasestorage.googleapis.com/v0/b/crocodil-9f989.appspot.com/o/Logos%2FWhatsApp%20Image%202024-04-18%20at%2019.30.23.jpeg?alt=media&token=0f2c7d23-d481-43a0-88da-1525a98c64b1')] bg-no-repeat bg-cover bg-center bg-gray-700 bg-blend-multiply bg-opacity-60">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen">
      <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-white">
      <img
                      className="h-8 w-auto"
                      src="https://firebasestorage.googleapis.com/v0/b/crocodil-9f989.appspot.com/o/Logos%2Flogo-v.png?alt=media&token=beb46bbe-5da9-41d8-b79d-5aca53dfc81c"
                      alt="Crocodil logo"
                    />
      </a>
      <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md">
        <div className="p-6 space-y-4 md:space-y-6 lg:space-y-8">
          <h2 className="text-xl font-bold leading-tight tracking-tight text-center text-gray-900 md:text-2xl">
            Giriş Yap
          </h2>

          <form onSubmit={login} className="space-y-4 md:space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@example.com"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
                placeholder="*********"

              />
            </div>

            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Giriş Yap</button>
            <p className="text-sm font-light text-center text-gray-500">
              <a href="#" onClick={handleForgotPassword} className="font-medium text-blue-600 hover:underline">Şifremi unuttum</a>
              </p>
              <p className="text-sm font-light text-center text-gray-500">
                <a href="/register" className="font-medium text-blue-600 hover:underline">Terapist hesabı açmak mı istiyorsunuz?</a>
              </p>
          </form>

        </div>
      </div>
    </div>
  </section>
  );
}

export default Login;
