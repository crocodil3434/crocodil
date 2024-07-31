import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const auth = getAuth();
const db = getFirestore();

export default function SubscriptionStatus() {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userId = user.uid;
          const iyzicoinfosRef = collection(db, 'doctors', userId, 'iyzicoinfos');
          const iyzicoinfosSnap = await getDocs(iyzicoinfosRef);

          if (iyzicoinfosSnap.empty) {
            setError('Mevcut abonelik bulunamadı.');
            setLoading(false);
            return;
          }

          let email = '';
          iyzicoinfosSnap.forEach(doc => {
            email = doc.data().email;
          });

          try {
            const response = await fetch('https://dctback.vercel.app/retrieveSubscription', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                conversationId: uuidv4(),
                email: email,
              }),
            });

            const result = await response.json();
            if (response.ok) {
              setSubscriptionData(result);
            } else {
              setError(`Hata: ${result.errorMessage || 'Abonelik durumu sorgulanırken bir hata oluştu.'}`);
            }
          } catch (err) {
            console.error('Error fetching subscription status:', err);
            setError('Abonelik durumu sorgulanırken bir hata oluştu.');
          }
        } else {
          setError('Kullanıcı oturumu bulunamadı.');
        }
        setLoading(false);
      });
    };

    fetchSubscriptionStatus();
  }, []);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button
          onClick={() => navigate('/billing2')}
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          Ödeme Yap
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Abonelik Durumu</h2>
        <p>Abonelik Durumu: {subscriptionData.status}</p>
        <p>Mevcut Ödeme Aktif mi: {subscriptionData.status === 'ACTIVE' ? 'Evet' : 'Hayır'}</p>
        <p>Gelecek Ödeme Tarihi: {subscriptionData.nextPaymentDate}</p>
        <button
          onClick={() => navigate('/billing2')}
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          Ödeme Yap
        </button>
      </div>
    </div>
  );
}
