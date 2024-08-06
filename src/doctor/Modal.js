import React, { useState } from "react";
import Swal from "sweetalert2";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const Modal = ({ isOpen, closeModal, doctorId, refetchPatients }) => {
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPassword, setPatientPassword] = useState("");
  const [files, setFiles] = useState([]);
  const [caregiverName, setCaregiverName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    const validFiles = newFiles.filter((file) => {
      const isValidType = /\.(jpg|jpeg|png|gif)$/i.test(file.name);
      const isValidSize = file.size <= 100 * 1024 * 1024; // 100 MB

      if (!isValidType) {
        Swal.fire({
          icon: "error",
          title: "Geçersiz Dosya Türü",
          text: `${file.name} geçersiz bir dosya türüne sahip. Lütfen yalnızca resim dosyaları yükleyin.`,
        });
      }

      if (!isValidSize) {
        Swal.fire({
          icon: "error",
          title: "Dosya Çok Büyük",
          text: `${file.name} dosyası çok büyük. Lütfen maksimum 100 MB boyutunda dosyalar yükleyin.`,
        });
      }

      return isValidType && isValidSize;
    });

    setFiles((prev) => [...prev, ...validFiles]);
    event.target.value = null; // File input'u sıfırla
  };

  // Remove file from local state
  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    setIsLoading(true);
    try {
      const uploadPromises = files.map((file) => {
        const fileRef = ref(storage, `uploads/${file.name}`);
        return uploadBytes(fileRef, file).then((snapshot) =>
          getDownloadURL(snapshot.ref)
        );
      });
      const fileUrls = await Promise.all(uploadPromises);
      console.log("Uploaded files:", fileUrls);
      return fileUrls;
    } catch (error) {
      console.error("Error uploading files:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId) {
      alert("Doctor ID not found. Please login.");
      return;
    }

    const fileUrls = await uploadFiles(); // Upload files first and get their URLs

    const patientDetails = {
      email: patientEmail,
      phone: patientPhone,
      firstName: patientName.split(" ")[0],
      lastName: patientName.split(" ")[1] || "",
      files: fileUrls ?? [],
      caregiverName: caregiverName ?? "",
      description: description ?? "",
      doctorId,
    };

    try {
      // Firestore'a hasta bilgilerini ekleyin
      await addDoc(collection(firestore, "patients"), patientDetails);

      Swal.fire({
        icon: "success",
        title: "Danışan Başarılı Bir Şekilde Eklendi",
      });
      refetchPatients();

      closeModal();
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Failed to register patient");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
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
          <button
            onClick={closeModal}
            className="float-right text-lg font-bold"
          >
            &times;
          </button>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Danışan Ekle
          </h3>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="loader"></div>
              <p className="mt-2">Lütfen bekleyiniz...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Danışan Adı & Soyadı
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    id="patient-name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-primary-500 "
                    placeholder="Danışan Adı & Soyadı"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Telefon Numarası
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    id="patient-phone"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="0555 555 55 55"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Danışan Email Adresi
                  </label>
                  <input
                    type="email"
                    required
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="danisan@ornek.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="caregiver-name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Bakım Veren Adı & Soyadı
                  </label>
                  <input
                    type="text"
                    value={caregiverName}
                    onChange={(e) => setCaregiverName(e.target.value)}
                    id="caregiver-name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Bakım Veren Adı & Soyadı"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Terapi Açıklaması
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Burada terapiyle ilgili açıklamalarınızı yazınız"
                  ></textarea>
                </div>
              </div>
              <div className="mb-4">
                <span className="block mb-2 text-sm font-medium text-gray-900 ">
                  Fotoğraf & Videolar
                </span>
                <div className="flex justify-center items-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="space-y-4">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <span>{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      {files.length < 5 && (
                        <label className="block cursor-pointer bg-blue-500 text-white p-2 rounded">
                          Add More Files
                          <input
                            type="file"
                            accept="image/*" // Sadece resim dosyalarını kabul et
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    <input id="dropzone-file" type="file" className="hidden" />
                  </label>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 text-white rounded-md hover:bg-teal-800"
                >
                  Kaydet
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
