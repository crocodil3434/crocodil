import React, { useState } from 'react';
import { doc, setDoc, collection } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import Swal from 'sweetalert2';

const AddTherapy = ({ doctorId, patientId, isOpen, closeModal }) => {
  const [therapyStartDate, setTherapyStartDate] = useState('');
  const [therapyName, setTherapyName] = useState('');
  const [longTermGoal, setLongTermGoal] = useState('');
  const [shortTermGoal, setShortTermGoal] = useState('');
  const [generalDescription, setGeneralDescription] = useState('');

  if (!isOpen) {
    return null;
  }

  const saveTherapyToFirestore = async (e) => {
    e.preventDefault();
    const therapyDetails = {
      doctorId,
      patientId,
      therapyName,
      therapyStartDate,
      longTermGoal,
      shortTermGoal,
      generalDescription,
      createdAt: new Date()
    };

    try {
      await setDoc(doc(collection(firestore, 'patients', patientId, 'therapies')), therapyDetails);
      Swal.fire({
        title: 'Başarılı!',
        text: 'Terapi detayları başarıyla kaydedildi.',
        icon: 'success',
        confirmButtonText: 'Tamam'
      }).then(() => {
        closeModal();
        window.location.reload();
      });
    } catch (error) {
      console.error("Error saving therapy details to Firestore:", error);
      Swal.fire({
        title: 'Hata!',
        text: 'Terapi detayları kaydedilirken bir hata oluştu.',
        icon: 'error',
        confirmButtonText: 'Tamam'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                  Seans Detayları Ekle
                </h3>
                <form onSubmit={saveTherapyToFirestore} className="space-y-6 mt-3">
                  <label htmlFor="therapyName" className="block font-medium text-gray-700">Seans İsmi</label>
                  <input
                    id="therapyName"
                    type="text"
                    name="therapyName"
                    placeholder="Seans İsmi"
                    value={therapyName}
                    onChange={(e) => setTherapyName(e.target.value)}
                    className="block w-full p-2 border rounded"
                    required
                  />
                  <label htmlFor="therapyStartDate" className="block font-medium text-gray-700">Başlangıç Tarihi</label>
                  <input
                    id="therapyStartDate"
                    type="date"
                    name="therapyStartDate"
                    placeholder="Başlangıç Tarihi"
                    value={therapyStartDate}
                    onChange={(e) => setTherapyStartDate(e.target.value)}
                    className="block w-full p-2 border rounded"
                    required
                  />
                  <label htmlFor="longTermGoal" className="block font-medium text-gray-700">Uzun Vadeli Hedef</label>
                  <input
                    id="longTermGoal"
                    type="text"
                    name="longTermGoal"
                    placeholder="Uzun Vadeli Hedef"
                    value={longTermGoal}
                    onChange={(e) => setLongTermGoal(e.target.value)}
                    className="block w-full p-2 border rounded"
                    required
                  />
                  <label htmlFor="shortTermGoal" className="block font-medium text-gray-700">Kısa Vadeli Hedef</label>
                  <input
                    id="shortTermGoal"
                    type="text"
                    name="shortTermGoal"
                    placeholder="Kısa Vadeli Hedef"
                    value={shortTermGoal}
                    onChange={(e) => setShortTermGoal(e.target.value)}
                    className="block w-full p-2 border rounded"
                    required
                  />
                  <label htmlFor="generalDescription" className="block font-medium text-gray-700">Genel Açıklama</label>
                  <textarea
                    id="generalDescription"
                    name="generalDescription"
                    placeholder="Genel Açıklama"
                    value={generalDescription}
                    onChange={(e) => setGeneralDescription(e.target.value)}
                    className="block w-full p-2 border rounded"
                    required
                  ></textarea>
                  <div className="mt-5 sm:mt-6">
                    <button type="submit" className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm">
                      Kaydet
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTherapy;
