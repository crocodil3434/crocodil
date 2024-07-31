import React, { useState, useEffect } from "react";
import ModalComponent from "../../components/layout/modal/Index";
import ModalDoctor from "../../doctor/Modal";
import ModalEdit from "../../doctor/ModalEdit";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  onAuthStateChanged,
} from "firebase/auth";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { auth, firestore } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import swal from "sweetalert2";

import { BuildingOfficeIcon, CheckCircleIcon } from "@heroicons/react/20/solid";
import DoctorLayout from "../../components/layout/doctor/sidebar/Index";
import { useAuth } from "../../context/AuthContext";

const placeholderImg = "/placeholder.jpeg";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [doctorId, setDoctorId] = useState("");
  const [patients, setPatients] = useState([]);
  const [user] = useAuthState(auth);
  const { userData } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [subModal, setSubModal] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [subData, setSubData] = useState(null);

  const pageCount = Math.ceil(patients.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = patients.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const updatePasswordModal = async () => {
    const { value: formValues } = await swal.fire({
      title: "Şifre Güncelle",
      html:
        '<input id="swal-input1" type="password" class="swal2-input" placeholder="Mevcut Şifre">' +
        '<input id="swal-input2" type="password" class="swal2-input" placeholder="Yeni Şifre">' +
        '<input id="swal-input3" type="password" class="swal2-input" placeholder="Yeni Şifre Tekrar">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
          document.getElementById("swal-input3").value,
        ];
      },
    });

    if (formValues) {
      const [currentPassword, newPassword, confirmPassword] = formValues;
      if (newPassword !== confirmPassword) {
        swal.fire("Hata", "Yeni şifreler uyuşmuyor.", "error");
        return;
      }

      try {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        swal.fire("Başarılı", "Şifreniz başarıyla güncellendi.", "success");
      } catch (error) {
        swal.fire("Güncellenemedi", error.message, "error");
      }
    }
  };

  const fetchPatientNameById = async (patientId) => {
    const docRef = doc(firestore, "patients", patientId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // Assuming patient's name is stored in 'firstName' and 'lastName' fields
      return `${docSnap.data().firstName} ${docSnap.data().lastName}`;
    } else {
      return "Unknown Patient"; // Fallback name in case patient ID doesn't match
    }
  };

  // Function to delete a transfer request by ID
  // Transfer talebini ID'sine göre silen fonksiyon
  const deleteTransferRequestById = async (requestId) => {
    try {
      // Kullanıcıdan silme işlemi için onay isteyen SweetAlert
      const result = await swal.fire({
        title: "Emin misiniz?",
        text: "Bu transfer talebini iptal etmek istediğinizden emin misiniz?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Evet, iptal et!",
        cancelButtonText: "Hayır, vazgeç!",
      });
      if (result.isConfirmed) {
        await deleteDoc(doc(firestore, "transferRequests", requestId));
        swal
          .fire(
            "İptal Edildi",
            "Transfer talebi başarıyla iptal edildi.",
            "success"
          )
          .then(() => fetchAndDisplayTransferRequests()); // Silme işleminden sonra transfer talepleri listesini yenile
      }
    } catch (error) {
      console.error("Transfer talebi silinirken hata oluştu:", error);
      swal.fire(
        "Hata",
        "Transfer talebi iptal edilemedi. Lütfen daha sonra tekrar deneyiniz.",
        "error"
      );
    }
  };

  // Transfer taleplerini getirip gösteren fonksiyon, iptal butonları ile birlikte
  const fetchAndDisplayTransferRequests = async () => {
    try {
      const q = query(
        collection(firestore, "transferRequests"),
        where("doctorId", "==", doctorId)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        swal.fire(
          "Transfer Talepleri Yok",
          "Şu anda herhangi bir transfer talebiniz bulunmamaktadır.",
          "info"
        );
      } else {
        const transferRequests = [];
        for (const doc of querySnapshot.docs) {
          const requestData = doc.data();
          const patientName = await fetchPatientNameById(requestData.patientId);
          transferRequests.push({
            id: doc.id,
            patientName,
            patientId: requestData.patientId,
            status: requestData.status,
            requestDate: requestData.requestDate?.toDate().toLocaleString(),
          });
        }

        const requestsHtml = transferRequests
          .map(
            (request, index) =>
              `<div id="request-${index}" style="margin-bottom: 20px;">
          Hasta İsmi: ${request.patientName}<br/>
          Talep Tarihi: ${request.requestDate}<br/>
          Durum: ${request.status}<br/>
          <button id="cancel-btn-${index}" data-request-id="${request.id}" class="swal2-confirm swal2-styled" style="border: 0; border-radius: 4px; background-color: #d33; color: white; padding: 5px 10px;">
            İptal Et
          </button>
         </div>`
          )
          .join("");

        swal.fire({
          title: "Transfer Talepleriniz",
          html: requestsHtml,
          confirmButtonText: "Kapat",
          preConfirm: () => {
            transferRequests.forEach((_, index) => {
              const btn = document.getElementById(`cancel-btn-${index}`);
              btn.removeEventListener("click", handleCancelClick); // Temizlik
            });
          },
          didOpen: () => {
            transferRequests.forEach((_, index) => {
              const btn = document.getElementById(`cancel-btn-${index}`);
              btn.addEventListener("click", handleCancelClick);
            });
          },
        });
      }
    } catch (error) {
      console.error("Transfer talepleri getirilirken hata oluştu:", error);
      swal.fire(
        "Hata",
        "Transfer talepleri getirilemedi. Lütfen daha sonra tekrar deneyiniz.",
        "error"
      );
    }
  };

  // İptal butonuna tıklanınca çalışacak olay işleyicisi
  function handleCancelClick(e) {
    const requestId = e.target.getAttribute("data-request-id");
    if (requestId) {
      deleteTransferRequestById(requestId);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDoctorId(user.uid);
        fetchPatients(user.uid);
      } else {
        setDoctorId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchPatients = async () => {
    const q = query(
      collection(firestore, "patients"),
      where("doctorId", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const patientsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatients(patientsData);
      console.log("Patients : ", patientsData);
    } else {
      console.log("No patients found.");
      setPatients([]);
    }
  };

  const openTransferModal = () => {
    swal
      .fire({
        title: "Mevcut Danışanı Transfer Et",
        input: "email",
        inputLabel: "Danışan Email Adresi",
        inputPlaceholder: "Danışanın sisteme kayıtlı email adresini giriniz",
        confirmButtonText: "Transfer",
        showCancelButton: true,
        preConfirm: (email) => {
          return transferPatient(email); // Function to transfer patient
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          swal.fire("Requested", "Transfer request has been sent.", "success");
        }
      });
  };

  const transferPatient = async (email) => {
    try {
      const patientsRef = collection(firestore, "patients");
      const q = query(patientsRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        swal.showValidationMessage(`No patient found with email: ${email}`);
        return;
      }

      const patientData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Assuming each email is unique and only one document is returned
      const patient = patientData[0];
      const transferRequestsRef = collection(firestore, "transferRequests");

      // Add transfer request
      await addDoc(transferRequestsRef, {
        doctorId: user.uid, // Assuming 'user' is the current user from Firebase Auth
        patientId: patient.id,
        status: "pending",
        requestDate: serverTimestamp(), // Import serverTimestamp from 'firebase/firestore'
      });
    } catch (error) {
      console.error("Error transferring patient:", error);
      swal.showValidationMessage(`Request failed: ${error.message}`);
    }
  };

  const openModal = () => {
    if (userData?.paymentStatus) {
      setIsOpen(true);
    } else {
      swal
        .fire({
          title: "Abonelik Paketi Yok",
          text: "Danışan eklemek için önce bir abonelik paketi satın almalısınız.",
          icon: "error",
          confirmButtonText: "Abonelik Satın Al",
          confirmButtonColor: "#3085d6",
        })
        .then((result) => {
          if (result.isConfirmed) {
            // Assuming you are using react-router-dom for routing
            window.location.href = "/billing2";
          }
        });
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setIsOpenEdit(false);
  };

  const handleCancelSub = async () => {
    const response = await fetch(
      process.env.REACT_APP_API_URL + "/cancel-sub",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
        }),
      }
    );

    const data = await response.json();

    if (data.status === 200) {
      swal.fire("Başarılı", "Aboneliğiniz başarıyla iptal edildi.", "success");
    } else {
      swal.fire(
        "Hata",
        "Abonelik iptal edilemedi. Lütfen daha sonra tekrar deneyiniz.",
        "error"
      );
    }
  };

  const toggleSubModal = async () => {
    if (!subModal) {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/lookup-sub",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.uid,
          }),
        }
      );

      const data = await response.json();

      if (data.status === 200) {
        setSubData(data.subscription);
      }
    }

    setSubModal(!subModal);
  };

  return (
    <DoctorLayout>
      <main className="flex-1 pb-8">
        {/* Page header */}
        <div className="bg-white shadow">
          <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
            <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
              <div className="min-w-0 flex-1">
                {/* Profile */}
                <div className="flex items-center">
                  <img
                    className="hidden h-16 w-16 rounded-full sm:block"
                    src={userData?.photoUrl || placeholderImg}
                    alt="Profile Photo"
                  />
                  <div>
                    <div className="flex items-center">
                      <img
                        className="h-16 w-16 rounded-full sm:hidden"
                        src={userData?.photoUrl || placeholderImg}
                        alt="Profile Photo"
                      />
                      <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                        Merhaba, {userData?.firstName || "User"}{" "}
                        {userData?.lastName}
                      </h1>
                    </div>
                    <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                      <dt className="sr-only">Company</dt>
                      <dd className="flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6">
                        <BuildingOfficeIcon
                          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        {userData?.workplace}
                      </dd>
                      <dt className="sr-only">Account status</dt>
                      <dd className="mt-3 flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6 sm:mt-0">
                        <CheckCircleIcon
                          className={`mr-1.5 h-5 w-5 flex-shrink-0 ${
                            userData?.paymentStatus
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                          aria-hidden="true"
                        />
                        {userData?.paymentStatus
                          ? "Ödeme Başarılı"
                          : "Ödeme Başarısız"}
                      </dd>
                    </dl>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsOpenEdit(true);
                  }}
                  type="button"
                  className="mt-3 w-full text-center inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                  Profil Ayarları
                </button>
              </div>
              <div className="mt-6 flex space-x-3 md:ml-4 md:mt-0">
                <button
                  onClick={updatePasswordModal}
                  type="button"
                  className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                  Şifre Güncelle
                </button>

                <button
                  type="button"
                  onClick={toggleSubModal}
                  className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                  Aboneliği Yönet
                </button>

                <button
                  onClick={openModal}
                  type="button"
                  className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                  Danışan Ekle
                </button>
                <button
                  onClick={openTransferModal}
                  type="button"
                  className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                  Mevcut Danışanı Transfer Et
                </button>
                <button
                  onClick={fetchAndDisplayTransferRequests}
                  type="button"
                  className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                  Mevcut Transfer Taleplerim
                </button>
                <ModalDoctor
                  isOpen={isOpen}
                  closeModal={closeModal}
                  refetchPatients={fetchPatients}
                  doctorId={doctorId}
                  className="z-50"
                />
                <ModalEdit
                  isOpen={isOpenEdit}
                  closeModal={closeModal}
                  doctorId={doctorId}
                  className="z-50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mx-auto mt-8 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8">
            Mevcut Danışanlarım
          </h2>

          {/* Activity list (smallest breakpoint only) */}
          <div className="shadow sm:hidden">
            <nav
              className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3"
              aria-label="Pagination"
            >
              <div className="flex flex-1 justify-between">
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Previous
                </a>
                <a
                  href="#"
                  className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Next
                </a>
              </div>
            </nav>
          </div>

          {/* Activity table (small breakpoint and up) */}
          <div className="hidden sm:block">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="mt-2 flex flex-col">
                <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-teal-400 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Danışan Adı
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-teal-400 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Telefon
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-teal-400 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Bakım veren Adı/Soyadı
                        </th>

                        {/* Diğer sütun başlıklarınızı buraya ekleyebilirsiniz */}
                      </tr>
                    </thead>
                    {/* Öğelerin dinamik olarak render edilmesi */}
                    <tbody>
                      {currentItems.map((patient) => (
                        <tr key={patient.id}>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <Link to={`/patient/${patient.id}`}>
                              {patient.firstName} {patient.lastName}
                            </Link>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {patient.phone}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {patient.caregiverName}
                          </td>
                          {/* Diğer veriler */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Pagination kontrolü ve gösterim metni */}
                  <div className="flex justify-between items-center border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div className="hidden sm:block">
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {indexOfFirstItem + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {indexOfLastItem > patients.length
                            ? patients.length
                            : indexOfLastItem}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">{patients.length}</span>{" "}
                        results
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {Array.from({ length: pageCount }, (_, i) => i + 1).map(
                        (number) => (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`px-4 py-2 ${
                              currentPage === number
                                ? "bg-teal-500"
                                : "bg-white"
                            } border border-gray-300 rounded-md`}
                          >
                            {number}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ModalComponent open={subModal} setOpen={setSubModal}>
            <ModalComponent.Title>Abonelik Bilgilerim</ModalComponent.Title>
            <ModalComponent.Content>
              <hr className="my-3" />
              <p className="text-sm text-gray-500">
                Abonelik Durumu{"  "}
                <span
                  className={
                    userData?.paymentStatus
                      ? "text-white bg-green-500 p-1 rounded-sm text-xs px-2 text-center"
                      : "bg-red-500 text-white p-1 rounded-sm text-xs px-2 text-center"
                  }
                >
                  {userData?.paymentStatus &&
                    subData?.subscriptionStatus === "ACTIVE" &&
                    "Aktif"}
                  {userData?.paymentStatus &&
                    subData?.subscriptionStatus === "CANCELED" &&
                    "Abonelik Sonuna Kadar Aktif"}
                  {userData.paymentStatus === false &&
                    subData?.subscriptionStatus === "CANCELED" &&
                    "İptal Edildi Yenilenmedi"}
                </span>
              </p>

              <hr className="my-3" />

              <p className="text-sm text-gray-500">
                Abonelik Paketi İsmi :{"  "} {subData?.productName}
              </p>

              <hr className="my-3" />

              <p className="mt-3 text-xs">
                Aboneliği iptal etmek için aşağıdaki butona tıklayınız.{" "}
                Aboneliğiniz diğer ödeme periyotuna kadar aktif kalacaktır.
              </p>
            </ModalComponent.Content>
            <ModalComponent.Footer>
              <button
                className={`${
                  subData?.subscriptionStatus === "CANCELED" &&
                  "cursor-not-allowed opacity-70 "
                } inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white mb-2`}
                onClick={handleCancelSub}
                type="button"
              >
                Abonelik İptali
              </button>
              <button
                onClick={toggleSubModal}
                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-md shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                type="button"
              >
                Kapat
              </button>
            </ModalComponent.Footer>
          </ModalComponent>
        </div>
      </main>
    </DoctorLayout>
  );
}
