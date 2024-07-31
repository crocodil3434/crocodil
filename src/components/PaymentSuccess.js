import React, { useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

function PaymentSuccess() {
  const { currentUser } = useAuth(); // Mevcut kullanıcıyı al

  useEffect(() => {
    const updatePaymentStatus = async () => {
      if (currentUser) {
        const userDocRef = doc(firestore, "doctors", currentUser.uid);
        await updateDoc(userDocRef, {
          paymentStatus: true
        });
      }
    };

    updatePaymentStatus().catch(console.error);
  }, [currentUser]);

  return (
    <div>Ödeme Başarılı! Panelinize yönlendiriliyorsunuz...</div>
  );
}

export default PaymentSuccess;
