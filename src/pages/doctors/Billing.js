import React, { useState } from 'react';

export default function Billing() {
  const [customerData, setCustomerData] = useState({
    name: '',
    surname: '',
    identityNumber: '',
    email: '',
    gsmNumber: '',
    billingAddress: {
      contactName: '',
      city: '',
      district: '',
      country: 'Turkey',
      address: '',
      zipCode: ''
    },
    shippingAddress: {
      contactName: '',
      city: '',
      district: '',
      country: 'Turkey',
      address: '',
      zipCode: ''
    }
  });
  const [iframeSrc, setIframeSrc] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e, type, field) => {
    if (type === 'customer') {
      setCustomerData({
        ...customerData,
        [field]: e.target.value,
      });
    } else {
      setCustomerData({
        ...customerData,
        [type]: {
          ...customerData[type],
          [field]: e.target.value,
        },
      });
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    const paymentData = {
      locale: 'en',
      conversationId: '123456789',
      callbackUrl: 'https://your-frontend-url.com/callback',
      pricingPlanReferenceCode: '97f93877-dfb1-417a-9c1a-0af1055ca3bb',
      subscriptionInitialStatus: 'ACTIVE',
      customer: customerData,
    };

    try {
      const response = await fetch('https://dctback.vercel.app/payment_for_customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const text = await response.text(); // Yanıtı düz metin olarak alınması
      try {
        const result = JSON.parse(text); // Yanıtın JSON'a parse edilmesi
        if (response.ok && result.checkoutFormContent) {
          const blob = new Blob([result.checkoutFormContent], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          setIframeSrc(url);
          setIsModalOpen(true);
        } else {
          alert(`Error: ${result.errorMessage || 'Ödeme sayfası açılırken bir hata oluştu.'}`);
        }
      } catch (error) {
        console.error('Error parsing JSON:', error, 'Response:', text);
        alert(`Error parsing response: ${text}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your payment.');
    }
  };

  return (
    <div className="bg-gray-100 p-6 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Fatura Bilgileri</h2>
        <form onSubmit={handlePayment}>
          <div className="mb-4">
            <label className="block text-gray-700">Ad</label>
            <input
              type="text"
              value={customerData.name}
              onChange={(e) => handleChange(e, 'customer', 'name')}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Soyad</label>
            <input
              type="text"
              value={customerData.surname}
              onChange={(e) => handleChange(e, 'customer', 'surname')}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Kimlik Numarası</label>
            <input
              type="text"
              value={customerData.identityNumber}
              onChange={(e) => handleChange(e, 'customer', 'identityNumber')}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={customerData.email}
              onChange={(e) => handleChange(e, 'customer', 'email')}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">GSM Numarası</label>
            <input
              type="text"
              value={customerData.gsmNumber}
              onChange={(e) => handleChange(e, 'customer', 'gsmNumber')}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Fatura Adresi</h3>
            <label className="block text-gray-700 mt-2">İrtibat Adı</label>
            <input
              type="text"
              value={customerData.billingAddress.contactName}
              onChange={(e) => handleChange(e, 'billingAddress', 'contactName')}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
            <label className="block text-gray-700 mt-2">Şehir</label>
            <input
              type="text"
              value={customerData.billingAddress.city}
              onChange={(e) => handleChange(e, 'billingAddress', 'city')}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
            <label className="block text-gray-700 mt-2">İlçe</label>
            <input
              type="text"
              value={customerData.billingAddress.district}
              onChange={(e) => handleChange(e, 'billingAddress', 'district')}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
            <label className="block text-gray-700 mt-2">Adres</label>
            <input
              type="text"
              value={customerData.billingAddress.address}
              onChange={(e) => handleChange(e, 'billingAddress', 'address')}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
            <label className="block text-gray-700 mt-2">Posta Kodu</label>
            <input
              type="text"
              value={customerData.billingAddress.zipCode}
              onChange={(e) => handleChange(e, 'billingAddress', 'zipCode')}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Teslimat Adresi</h3>
            <label className="block text-gray-700 mt-2">İrtibat Adı</label>
            <input
              type="text"
              value={customerData.shippingAddress.contactName}
              onChange={(e) => handleChange(e, 'shippingAddress', 'contactName')}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
            <label className="block text-gray-700 mt-2">Şehir</label>
            <input
              type="text"
              value={customerData.shippingAddress.city}
              onChange={(e) => handleChange(e, 'shippingAddress', 'city')}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
            <label className="block text-gray-700 mt-2">İlçe</label>
            <input
              type="text"
              value={customerData.shippingAddress.district}
              onChange={(e) => handleChange(e, 'shippingAddress', 'district')}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
            <label className="block text-gray-700 mt-2">Adres</label>
            <input
              type="text"
              value={customerData.shippingAddress.address}
              onChange={(e) => handleChange(e, 'shippingAddress', 'address')}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
            <label className="block text-gray-700 mt-2">Posta Kodu</label>
            <input
              type="text"
              value={customerData.shippingAddress.zipCode}
              onChange={(e) => handleChange(e, 'shippingAddress', 'zipCode')}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded mt-4 w-full"
          >
            Ödeme Yap
          </button>
        </form>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-4 w-full max-w-2xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <iframe
              src={iframeSrc}
              title="Payment"
              width="100%"
              height="600px"
              style={{ border: 'none' }}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
