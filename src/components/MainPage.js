import React, { useState } from 'react';
import Timer from './Timer'; // TimerModal'ın yolu burada örnek olarak verilmiştir.

// Ana sayfa bileşeni
function MainPage() {
  const [modalOpen, setModalOpen] = useState(false);   

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Ana Sayfa</h1>
      <p>Bu bir ana sayfa örneğidir. Buradan zamanlayıcı modalını açabilirsiniz.</p>
      <button
        onClick={openModal}
        className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Zamanlayıcıyı Aç
      </button>

      {/* TimerModal bileşenini burada çağırıyoruz */}
      <Timer isOpen={modalOpen} onClose={closeModal} />
    </div>
  );
}

export default MainPage;
