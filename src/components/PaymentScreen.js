import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const PaymentScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Kullanıcı bilgilerini yükleyin veya yönlendirme yapın
  }, []);

  const completePayment = async () => {
    setIsLoading(true); // Yükleme durumunu etkinleştir

    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (!userId) {
      setIsLoading(false);
      console.error("Kullanıcı girişi yapılmamış.");
      Swal.fire('Hata!', 'Ödeme işlemi için kullanıcı girişi gereklidir.', 'error');
      return;
    }

    try {
      // Burada ödeme işlemini gerçekleştirin. Örnek olarak statik bir API isteği gösterilmiştir.
      // Gerçek uygulamada, ödeme sağlayıcınızın belirlediği parametreleri kullanın.
      const response = await fetch('http://https://dctback-talhaelmali.vercel.app/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIP: "85.105.242.11",
          userEmail: "customer@example.com",
          paymentAmount: "10000",
        }),
      });

      const data = await response.json();
      setIsLoading(false); // Yükleme durumunu devre dışı bırak

      if (data.success) {
        // Firebase'de ödeme durumunu güncelle
        await setDoc(doc(firestore, "doctors", userId), { paymentStatus: true }, { merge: true });
        Swal.fire('Başarılı!', 'Ödeme işleminiz başarıyla tamamlandı.', 'success');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setIsLoading(false); // Hata durumunda yükleme durumunu devre dışı bırak
      console.error("Ödeme işleminde hata: ", error);
      Swal.fire('Hata!', `Ödeme işleminiz sırasında bir hata oluştu: ${error.message}`, 'error');
    }
  };

  return (
    <div>
      <h2>Ödeme Ekranı</h2>
      <p>Lütfen ödemenizi tamamlayın.</p>
      <button onClick={completePayment}>Ödemeyi Tamamla</button>
    </div>
  );
};

export default PaymentScreen;
