import React, { useState, useEffect } from "react";
import {
  doc,
  collection,
  getDocs,
  query,
  writeBatch,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { firestore } from "../firebaseConfig";
import Swal from "sweetalert2";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const AddStep = ({ patientId, isOpen, closeModal }) => {
  const [therapies, setTherapies] = useState([]);
  const [selectedTherapyId, setSelectedTherapyId] = useState("");
  const [steps, setSteps] = useState([]);
  const [uploadQueue, setUploadQueue] = useState(0);
  const storage = getStorage();

  useEffect(() => {
    if (patientId) {
      const fetchTherapies = async () => {
        const q = query(collection(firestore, `patients/${patientId}/therapies`));
        const querySnapshot = await getDocs(q);
        const fetchedTherapies = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTherapies(fetchedTherapies);
      };

      fetchTherapies();
    }
  }, [patientId]);

  if (!isOpen) {
    return null;
  }

  const handleFileUpload = async (file, type, index) => {
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "Dosya Seçilmedi",
        text: "Lütfen bir dosya seçin.",
      });
      return "";
    }

    setUploadQueue((prevQueue) => prevQueue + 1);
    const storageRef = ref(
      storage,
      `patients/${patientId}/therapies/${selectedTherapyId}/${type}/${file.name}`
    );

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      handleUpdateStep(index, `${type}Url`, url); // URL'yi ilgili adımda güncelle
      return url;
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire({
        icon: "error",
        title: "Yükleme Başarısız",
        text: "Dosya yüklenirken bir hata oluştu. Lütfen tekrar deneyin.",
      });
      return "";
    } finally {
      setUploadQueue((prevQueue) => prevQueue - 1);
    }
  };

  const handleAddStep = () => {
    setSteps((prevSteps) => [
      ...prevSteps,
      {
        id: steps.length,
        content: "",
        description: "",
        completionDate: "",
        videoFile: null,
        photoFile: null,
        videoUrl: "",
        photoUrl: "",
      },
    ]);
  };

  const handleUpdateStep = (index, field, value) => {
    setSteps((prevSteps) =>
      prevSteps.map((step, idx) => {
        if (idx === index) {
          return { ...step, [field]: value };
        }
        return step;
      })
    );
  };

  const handleRemoveStep = (index) => {
    setSteps((prevSteps) => prevSteps.filter((step, idx) => idx !== index));
  };

  const handleNotifyNewStep = async () => {
    try {
      const response = await fetch('https://dctback.vercel.app/notifyNewStep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientId }),
      });
  
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        } else {
          throw new Error('Failed to send notification email');
        }
      }
  
      console.log('Notification email sent successfully');
    } catch (error) {
      console.error('Error sending notification email:', error);
    }
  };

  const handleSubmitAllSteps = async () => {
    if (!selectedTherapyId) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Bir terapi seçilmedi. Lütfen adımları kaydetmeden önce bir terapi seçin.",
      });
      return;
    }

    const batch = writeBatch(firestore);

    for (const step of steps) {
      const stepRef = doc(
        collection(
          firestore,
          `patients/${patientId}/therapies/${selectedTherapyId}/steps`
        )
      );
      const newStepData = {
        content: step.content,
        description: step.description,
        isCompleted: false,
        createdAt: new Date(),
        completionDate: step.completionDate,
        videoUrl: step.videoUrl,
        photoUrl: step.photoUrl,
      };
      batch.set(stepRef, newStepData);
    }

    try {
      await batch.commit();
      await handleNotifyNewStep(); // Notify patient about new steps
      Swal.fire({
        icon: "success",
        title: "Tüm Adımlar Kaydedildi",
        text: "Tüm adımlar başarıyla kaydedildi.",
      }).then(() => {
        closeModal();
        window.location.reload();
      });
    } catch (error) {
      console.error("Error saving steps to Firestore:", error);
      Swal.fire({
        icon: "error",
        title: "Adımlar Kaydedilemedi",
        text: `Hata: ${error.message}`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-headline"
                >
                  Terapiye Adım Ekle
                </h3>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="space-y-6 mt-3"
                >
                  <select
                    onChange={(e) => setSelectedTherapyId(e.target.value)}
                    value={selectedTherapyId}
                  >
                    <option value="">Bir Seans Seçin</option>
                    {therapies.map((therapy) => (
                      <option key={therapy.id} value={therapy.id}>
                        {therapy.therapyName}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="mt-4 inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Adım Ekle
                  </button>
                  {steps.map((step, index) => (
                    <Disclosure key={index} as="div" className="mt-2">
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-left text-sm font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75 rounded-lg">
                            <span>Adım {index + 1}</span>
                            <ChevronUpIcon
                              className={`${
                                open ? "transform rotate-180" : ""
                              } w-5 h-5 text-gray-500`}
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                            <input
                              type="text"
                              placeholder="Adım İsmi"
                              value={step.content}
                              onChange={(e) =>
                                handleUpdateStep(
                                  index,
                                  "content",
                                  e.target.value
                                )
                              }
                              className="block w-full p-2 border rounded"
                              required
                            />
                            <textarea
                              placeholder="Açıklama..."
                              value={step.description}
                              onChange={(e) =>
                                handleUpdateStep(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="block w-full p-2 border rounded"
                              required
                            ></textarea>
                            <input
                              type="date"
                              placeholder="Tamamlanma Tarihi"
                              value={step.completionDate}
                              onChange={(e) =>
                                handleUpdateStep(
                                  index,
                                  "completionDate",
                                  e.target.value
                                )
                              }
                              className="block w-full p-2 border rounded"
                              required
                            />
                            <label className="my-2">
                              Fotoğraf Yükle
                              <input
                                type="file"
                                accept="image/*" // Sadece resim dosyalarını kabul et
                                onChange={(e) =>
                                  handleFileUpload(
                                    e.target.files[0],
                                    "photo",
                                    index
                                  )
                                }
                                className="block w-full"
                              />
                            </label>

                            <label className="my-2">
                              Video Yükle
                              <input
                                type="file"
                                accept="video/*" // Sadece video dosyalarını kabul et
                                onChange={(e) =>
                                  handleFileUpload(
                                    e.target.files[0],
                                    "video",
                                    index
                                  )
                                }
                                className="block w-full"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemoveStep(index)}
                              className="mt-2 inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Adımı Kaldır
                            </button>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                  {steps.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSubmitAllSteps}
                      className={classNames(
                        "mt-4 inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                        uploadQueue > 0
                          ? "pointer-events-none cursor-not-allowed brightness-75 bg-indigo-300"
                          : ""
                      )}
                    >
                      {uploadQueue > 0
                        ? `Dosyaların Yüklenmesi Devam Ediyor... (${uploadQueue} Dosya Bekleniyor)`
                        : "Tüm Adımları Kaydet"}
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStep;
