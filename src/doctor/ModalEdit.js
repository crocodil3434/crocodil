import React, { useState } from 'react';
import UserEdit from '../forms/user-edit/doctor/Index';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebaseConfig'; // Ensure you export `storage` from your Firebase config file


const Modal = ({ isOpen, closeModal, doctorId }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  return  (
    <>
      <style>
        {`
          .loader {
            border: 4px solid rgba(255, 255, 255, 0.3); /* Light grey */
            border-top: 4px solid #3498db; /* Blue */
            border-radius: 50%;
            width: 36px;
            height: 36px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
          <button onClick={closeModal} className="float-right text-lg font-bold">&times;</button>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Kullanıcı Ayarları
          </h3>

         {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="loader"></div>
              <p className="mt-2">Lütfen bekleyiniz...</p>
            </div>
          ) : (
            <UserEdit />
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
