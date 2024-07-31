import React, { useState, useEffect, Fragment, useCallback } from "react";
import PatientLayout from "../../components/layout/patients/Index";
import ModalEdit from "../../patient/ModalEdit";
import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  where,
  deleteDoc,
} from "firebase/firestore";
import { auth, firestore } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { Dialog, Menu, Transition, Disclosure } from "@headlessui/react";
import Swal from "sweetalert2";
import ReactPlayer from "react-player/lazy";
import { archievePatient } from "../../functions/index";
import {
  Bars3CenterLeftIcon,
  CogIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  XMarkIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import withReactContent from "sweetalert2-react-content";
import swal from "sweetalert2";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  onAuthStateChanged,
} from "firebase/auth";

const navigation = [{ name: "Home", href: "#", icon: HomeIcon, current: true }];
const secondaryNavigation = [
  { name: "Settings", href: "#", icon: CogIcon },
  { name: "Help", href: "#", icon: QuestionMarkCircleIcon },
  { name: "Privacy", href: "#", icon: ShieldCheckIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const Logo = "/logo2.png";
  const placeholderImg = "/placeholder.jpeg";
  const [therapies, setTherapies] = useState([]);
  const [selectedBox, setSelectedBox] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isAnimated, setIsAnimated] = useState(false);
  const MySwal = withReactContent(Swal);
  const [notes, setNotes] = useState([]);
  const [transferRequests, setTransferRequests] = useState([]);
  const [requestToUpdate, setRequestToUpdate] = useState(null);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

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

  const fetchAndDisplayTransferRequests = async () => {
    if (!user) {
      Swal.fire("Error", "User information not loaded.", "error");
      return;
    }

    const q = query(
      collection(firestore, "transferRequests"),
      where("patientId", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      Swal.fire("Information", "No active transfer requests.", "info");
    } else {
      const requests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        requestDate: doc.data().requestDate
          ? new Date(doc.data().requestDate.seconds * 1000).toLocaleString()
          : "Unknown",
      }));

      const pendingRequests = await requests.filter(
        (request) => String(request.status).toLowerCase() === "pending"
      );

      setTransferRequests(pendingRequests);
      showRequests(pendingRequests);
    }
  };

  const showRequests = (requests) => {
    Swal.fire({
      title: "Your Transfer Requests",
      html: createHtmlForRequests(requests),
      showCancelButton: true,
      confirmButtonText: "Close",
      preConfirm: () => Swal.close(),
      didOpen: () => {
        requests.forEach((request) => {
          document
            .getElementById(`confirm-${request.id}`)
            .addEventListener("click", () =>
              updateRequestStatus(request.id, "approved")
            );
        });
      },
    });
  };

  const createHtmlForRequests = (requests) => {
    return requests
      .map(
        (request) => `
      <div>
        <p>Patient ID: ${request.patientId}</p>
        <p>Request Date: ${request.requestDate}</p>
        <p>Status: ${request.status}</p>
        <button id="confirm-${request.id}" class="swal2-confirm swal2-styled">
          Confirm
        </button>
      </div>
    `
      )
      .join("");
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    console.log("Old user", userData);
    try {
      const requestRef = doc(firestore, "transferRequests", requestId);
      const requestDoc = await getDoc(requestRef);
      if (!requestDoc.exists()) {
        throw new Error("Request document does not exist!");
      }

      const requestInfo = requestDoc.data();
      const formerDoctor = userData.doctorId;
      const patientId = requestInfo.patientId;
      const doctorId = requestInfo.doctorId; // Talebi yapan doktorun ID'si

      console.table((requestInfo, formerDoctor, patientId, doctorId));

      if (typeof doctorId === "undefined") {
        throw new Error(
          "Doctor ID is undefined. Cannot update patient record."
        );
      }

      // Transfer talebinin durumunu güncelle
      await updateDoc(requestRef, { status: newStatus });

      // Eğer yeni durum 'approved' ise, hastanın doktor ID'sini ve terapilerini güncelle
      if (newStatus === "approved") {
        const response = await archievePatient(formerDoctor, patientId);
        // Hastanın doktor ID'sini güncelle
        const patientRef = doc(firestore, "patients", patientId);
        await updateDoc(patientRef, { doctorId: doctorId });

        // Mevcut terapileri çek ve geçmiş terapilere kaydet
        const therapiesRef = collection(
          firestore,
          `patients/${patientId}/therapies`
        );
        const pastTherapiesRef = collection(
          firestore,
          `patients/${patientId}/Past Therapies`
        );
        const querySnapshot = await getDocs(therapiesRef);
        const therapies = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        //Geçmiş Terapileri Sil
        if (pastTherapiesRef && pastTherapiesRef.length > 0) {
          for (const therapy of pastTherapiesRef) {
            await deleteDoc(doc(pastTherapiesRef, therapy.id));
          }
        }

        //Delete the steps collection of each therapy Doc
        for (const therapy of therapies) {
          const stepsRef = collection(
            firestore,
            `patients/${patientId}/therapies/${therapy.id}/steps`
          );
          const stepsSnapshot = await getDocs(stepsRef);
          const steps = stepsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          //Delete the steps collection of each therapy Doc
          for (const step of steps) {
            await deleteDoc(doc(stepsRef, step.id));
          }
        }

        //Doktorun Hasta hakkındaki notlarını yeni doktora ekle ve eskisinden sil
        // try {
        //   const notesRef = collection(
        //     firestore,
        //     `doctors/${formerDoctor}/notes`
        //   );
        //   const q = query(notesRef, where("patientId", "==", patientId));
        //   const querySnapshot = await getDocs(q);
        //   const notes = querySnapshot.docs.map((doc) => ({
        //     id: doc.id,
        //     ...doc.data(),
        //   }));

        //   for (const note of notes) {
        //     console.log("Adding note to new doctor:", note);
        //     await addDoc(collection(firestore, `doctors/${doctorId}/notes`), {
        //       ...note,
        //       isTransferedNote: true,
        //       createdAt: new Date(),
        //     });
        //     await deleteDoc(doc(notesRef, note.id));
        //   }
        // } catch (error) {
        //   console.error("Notlar yüklenirken bir hata oluştu:", error);
        // }
      }

      Swal.fire(
        "Success",
        "Request status and patient data updated successfully.",
        "success"
      ).then(() => {
        fetchAndDisplayTransferRequests(); // Transfer taleplerini tekrar çek
      });
    } catch (error) {
      console.error("Error updating request: ", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  const fetchNotes = async () => {
    if (!user) {
      console.log("Kullanıcı bilgisi yükleniyor veya mevcut değil.");
      return;
    }

    try {
      const notesRef = collection(firestore, `patients/${user.uid}/notes`);
      const q = query(notesRef);
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log("Hiç not bulunamadı.");
        setNotes([]);
        return;
      }
      const fetchedNotes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Notlar yüklenirken bir hata oluştu: ", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchTherapies = async () => {
    if (!user) {
      return;
    }
    try {
      const therapiesSnapshot = await getDocs(
        collection(firestore, `patients/${user.uid}/therapies`)
      );
      const therapiesWithSteps = await Promise.all(
        therapiesSnapshot.docs.map(async (doc) => {
          const therapy = { id: doc.id, ...doc.data() };
          const stepsSnapshot = await getDocs(
            collection(
              firestore,
              `patients/${user.uid}/therapies/${doc.id}/steps`
            )
          );

          const steps = stepsSnapshot.docs.map((stepDoc) => ({
            id: stepDoc.id,
            ...stepDoc.data(),
          }));

          return {
            ...therapy,
            steps: steps,
            test: "test",
          };
        })
      );

      console.log("Therapies With Steps", therapiesWithSteps); // Check if the modifications are present in the therapiesWithSteps array

      return therapiesWithSteps;
    } catch (error) {
      console.error("Error fetching therapies and steps:", error);
    }
  };

  // Fetch therapies and set state
  useEffect(() => {
    fetchTherapies().then((therapies) => {
      setTherapies(therapies);
    });
  }, [user?.uid]);

  useEffect(() => {
    // Hasta için görevleri çekme
    const fetchTasks = async () => {
      const tasksRef = collection(firestore, `patients/${user.uid}/tasks`);
      const q = query(tasksRef);
      const querySnapshot = await getDocs(q);
      const fetchedTasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(fetchedTasks);
    };

    fetchTasks();
  }, [user]);

  const handleAddNote = async () => {
    const { value: formValues } = await MySwal.fire({
      title: "Not Ekle",
      html:
        '<input id="title" class="swal2-input" placeholder="Başlık">' +
        '<textarea id="description" class="swal2-textarea" placeholder="Açıklama">',
      focusConfirm: false,
      preConfirm: () => {
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        if (!title || !description) {
          Swal.showValidationMessage("Lütfen tüm alanları doldurun");
        }
        return { title, description };
      },
    });

    if (formValues) {
      const { title, description } = formValues;
      try {
        const notesRef = collection(firestore, `patients/${user.uid}/notes`);
        await addDoc(notesRef, {
          title,
          description,
          createdAt: new Date(),
        });
        Swal.fire("Başarılı!", "Notunuz başarıyla eklendi.", "success");
      } catch (error) {
        console.error("Not eklenirken bir hata oluştu:", error);
        Swal.fire("Hata!", "Not eklenemedi.", "error");
      }
    }
  };

  const boxContents = {
    "Terapi Takip Sistemi": (
      <div className="w-full space-y-2">
        {therapies?.map((therapy, index) => (
          <div
            className={`content ${isAnimated ? "animate-slideIn" : ""}`}
            style={{ animationDelay: `${(index + 1) * 100}ms` }}
          >
            <div key={index} className="px-4 pb-2 text-sm text-gray-500">
              <div className="mt-2">
                <Fragment key={index + "-genel-terapi"}>
                  <div>Genel Açıklama: {therapy.generalDescription}</div>
                  <div>
                    Tarih Aralığı: {therapy.therapyStartDate} -{" "}
                    {therapy.therapyEndDate}
                  </div>
                </Fragment>
              </div>
            </div>
          </div>
        ))}
        {therapies.length === 0 && (
          <div
            className={`content ${isAnimated ? "animate-slideIn" : ""}`}
            style={{ animationDelay: "100ms" }}
          >
            <div className="text-left text-sm text-gray-500">
              Henüz bir terapi bulunmamaktadır.
            </div>
          </div>
        )}
      </div>
    ),
    Ödevlendirme: (
      <div className="w-full space-y-2">
        {therapies.map((therapy, index) => {
          if (
            therapy.steps?.length === 0 ||
            therapy.steps === undefined ||
            therapy.steps === null
          )
            return null;
          return (
            <div
              className={`content ${isAnimated ? "animate-slideIn" : ""}`}
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
              key={index + "-therapy"}
            >
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {therapy.therapyName}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {therapy.generalDescription}
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    {therapy.steps.map((step, stepIndex) => (
                      <Disclosure key={stepIndex} as={Fragment}>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm text-left text-gray-900 font-medium bg-gray-100 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75 rounded-lg">
                              <span>
                                Adım {stepIndex + 1}: {step.content}
                              </span>
                              <ChevronUpIcon
                                className={`${
                                  open ? "transform rotate-180" : ""
                                } w-5 h-5 text-gray-500`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-900">
                              <p>{step.description}</p>
                              {step?.photoUrl && (
                                <div className="bg-white border border-gray-300 shadow-sm rounded-md overflow-hidden w-max m-3 ml-0 flex flex-col">
                                  <img
                                    className="w-36 h-36 aspect-square"
                                    src={step?.photoUrl}
                                    alt=""
                                  />
                                  <a
                                    className="text-xs  text-center py-1"
                                    href={step?.photoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    download
                                  >
                                    Download
                                  </a>
                                </div>
                              )}
                              {step?.videoUrl && (
                                <ReactPlayer
                                  url={step?.videoUrl}
                                  controls
                                  width="50%"
                                  height="50%"
                                />
                              )}
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          );
        })}
        {therapies?.length === 0 && (
          <div
            className={`content ${isAnimated ? "animate-slideIn" : ""}`}
            style={{ animationDelay: "100ms" }}
          >
            <div className="text-left text-sm text-gray-500">
              Henüz bir Ödev bulunmamaktadır.
            </div>
          </div>
        )}
      </div>
    ),
    Notlar: (
      <div className="w-full space-y-2">
        {notes &&
          notes.map((note, index) => (
            <div
              className={`content ${isAnimated ? "animate-slideIn" : ""}`}
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <div key={index} className="px-4 pb-2 text-sm text-gray-500">
                <div className="mt-2">
                  <h3 className="text-md font-semibold">{note.title}</h3>
                  <p>{note.description}</p>
                </div>
              </div>
            </div>
          ))}
        {notes.length === 0 && (
          <div
            className={`content ${isAnimated ? "animate-slideIn" : ""}`}
            style={{ animationDelay: "100ms" }}
          >
            <p className="text-sm text-gray-500">Not Bulunamadı</p>
          </div>
        )}
      </div>
    ),
  };

  const handleBoxClick = (boxName) => {
    setSelectedBox(selectedBox === boxName ? "" : boxName);
  };
  const toggleTaskCompletion = async (therapyId, stepIndex, isCompleted) => {
    const therapyRef = doc(
      firestore,
      `patients/${user.uid}/therapies/${therapyId}`
    );

    try {
      const therapyDoc = await getDoc(therapyRef);
      if (!therapyDoc.exists()) {
        throw new Error("Therapy document does not exist!");
      }

      // Retrieve current data and update it
      let therapyData = therapyDoc.data();
      if (!therapyData.steps || therapyData.steps.length <= stepIndex) {
        throw new Error("Step index out of bounds");
      }

      // Update the specific step
      therapyData.steps[stepIndex].isCompleted = !isCompleted;

      // Update the entire steps array back to Firestore
      await updateDoc(therapyRef, {
        steps: therapyData.steps,
      });

      Swal.fire({
        title: "Başarılı!",
        text: isCompleted
          ? "Görev tamamlama iptal edildi."
          : "Görev başarıyla tamamlandı.",
        icon: "success",
        confirmButtonText: "Tamam",
      });

      // Refresh the therapies data
      fetchTherapies();
    } catch (error) {
      console.error("Görev güncelleme hatası:", error);
      Swal.fire({
        title: "Hata!",
        text: "İşlem sırasında bir hata meydana geldi: " + error.message,
        icon: "error",
        confirmButtonText: "Tamam",
      });
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const docRef = doc(firestore, "patients", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.log("No user data found in Firestore");
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    console.log("userData:", userData);
  }, [userData]);

  return (
    <PatientLayout>
      <main className="flex-1 pb-8">
        {/* Page header */}
        <div className="bg-white shadow">
          <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
            <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
              <div className="min-w-0">
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
                      <dd className="flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6">
                        <PhoneIcon
                          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        {userData?.phone}
                      </dd>
                      <dd className="flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6">
                        <UserIcon
                          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        {userData?.caregiverName}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end flex-1 space-x-3 md:ml-4 md:mt-0">
                <button
                  onClick={() => {
                    setIsModalEditOpen(true);
                  }}
                  type="button"
                  className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                  Profil Ayarları
                </button>
                <button
                  onClick={updatePasswordModal}
                  type="button"
                  className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                  Şifre Güncelle
                </button>
                <button
                  onClick={handleAddNote}
                  type="button"
                  className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                  Not Ekle
                </button>

                <button
                  onClick={fetchAndDisplayTransferRequests}
                  type="button"
                  className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                  Show Transfer Requests{" "}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-6 lg:mx-auto lg:max-w-6xl lg:px-8">
          <h1 className="text-lg font-semibold">Terapi ve Görev Detayları</h1>
          {Object.keys(boxContents).map((box, index) => (
            <Fragment key={index}>
              <div
                className={`box ${isAnimated ? "animate-slideIn" : ""} ${
                  selectedBox === box ? "selected" : ""
                }`}
                onClick={() => handleBoxClick(box)}
                style={{ animationDelay: `${index * 100}ms` }} // Her kutu için gecikme süresi
              >
                {box}
              </div>
              {selectedBox === box && boxContents[box]}
            </Fragment>
          ))}
        </div>
      </main>
      <ModalEdit
        isOpen={isModalEditOpen}
        closeModal={() => {
          setIsModalEditOpen(false);
        }}
        doctorId={user.uid}
        className="z-50"
      />
      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }

        .box,
        .content {
          opacity: 0; /* Başlangıçta kutu ve içerikler görünmez */
          animation: slideIn 0.5s ease-out forwards; /* Slide-in animasyonu */
          z-index: 0;
        }

        .box {
          cursor: pointer;
          padding: 20px;
          margin: 10px 0;
          background-color: #2dd4bf;
          border-radius: 20px;
          transition: background-color 0.3s ease;
          color: #fff;
          z-index: 0;
        }

        .box:hover {
          background-color: #0d9488;
        }

        .selected {
          background-color: #115e59; /* Seçili kutu için bir arka plan rengi */
        }

        .content {
          padding: 20px;
          margin: 10px 0;
          background-color: #f9f9f9;
          border-left: 3px solid #4f46e5; /* Seçili içerik için bir kenarlık */
        }
      `}</style>
    </PatientLayout>
  );
}
