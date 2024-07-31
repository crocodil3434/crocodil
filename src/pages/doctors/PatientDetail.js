import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { archievePatient } from "../../functions/index";
import DoctorLayout from "../../components/layout/doctor/sidebar/Index";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { auth, firestore } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog, Menu, Transition, Disclosure } from "@headlessui/react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ChevronUpIcon,
  CalculatorIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline"; // Outline ikonlar için
import AddTherapy from "../../doctor/AddTherapy";
import ReactPlayer from "react-player/lazy";
import AddStep from "../../doctor/AddStep"; // AddStep komponentini import et
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {
  Bars3CenterLeftIcon,
  CogIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  PhoneIcon,
  UserIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import { useAuth } from "../../context/AuthContext";

const statusStyles = {
  success: "bg-green-100 text-green-800",
  processing: "bg-yellow-100 text-yellow-800",
  failed: "bg-gray-100 text-gray-800",
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PatientDetail() {
  const navigate = useNavigate(); // This sets up the navigate function
  const [user] = useAuthState(auth);
  const [isAnimated, setIsAnimated] = useState(false);
  const [selectedBox, setSelectedBox] = useState("");
  const [therapies, setTherapies] = useState([]); // Terapileri saklamak için yeni durum
  const [showStepModal, setShowStepModal] = useState(false); // Step modalının açılıp kapanmasını kontrol eden state
  const [selectedTherapyId, setSelectedTherapyId] = useState(null); // Seçili terapinin ID'si
  const { userData, currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);

  const handleAddStep = (therapyId) => {
    setSelectedTherapyId(therapyId); // Seçili terapinin ID'sini state'e kaydet
    setShowStepModal(true); // Step modalını aç
  };

  const handleAddNote = () => {
    MySwal.fire({
      title: "Not Ekle",
      html: `<input type="text" id="title" class="swal2-input" placeholder="Başlık">
             <textarea id="description" class="swal2-textarea" placeholder="Açıklama"></textarea>`,
      confirmButtonText: "Kaydet",
      focusConfirm: false,
      preConfirm: () => {
        const title = Swal.getPopup().querySelector("#title").value;
        const description = Swal.getPopup().querySelector("#description").value;
        if (!title || !description) {
          Swal.showValidationMessage(`Lütfen tüm alanları doldurun`);
        }
        return { title, description };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { title, description } = result.value;
        // Bu noktada,  nın ID'si `id` değişkeni olarak kullanılır
        addNoteToFirestore(title, description, id);
      }
    });
  };

  // Firestore'a not ekleme işlevi, hastanın ID'si ile birlikte
  const addNoteToFirestore = async (title, description, patientId) => {
    if (!user) return; // Kullanıcı kontrolü

    try {
      // Doğru koleksiyon yolu: "doctors/<doktor-id>/notes"
      const notesRef = collection(firestore, `doctors/${user.uid}/notes`);
      await addDoc(notesRef, {
        title,
        description,
        patientId, // Nota hastanın ID'sini de ekliyoruz
        createdAt: new Date(),
      });
      console.log("Not başarıyla kaydedildi");
    } catch (error) {
      console.error("Not kaydedilirken bir hata oluştu:", error);
    }
  };

  const handleBoxClick = (boxName) => {
    // Seçili kutuyu açık veya kapalı duruma getir
    setSelectedBox(selectedBox === boxName ? null : boxName);
  };

  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [doctorId, setDoctorId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [openSteps, setOpenSteps] = useState({});
  const [myNotes, setMyNotes] = useState([]);
  const [patientNotes, setPatientNotes] = useState([]);
  const [aileForm, setAileForm] = useState(false);
  const [analizForm, setAnalizForm] = useState(false);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const fetchPatientDetail = async () => {
      try {
        const docRef = doc(firestore, "patients", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          if (data.doctorId !== user.uid) {
            alert("Bu hasta size ait değil.");
            navigate("/dashboard");
          }

          setPatient({ id: docSnap.id, ...data });

          const aileFormRef = collection(firestore, `patients/${id}/aile-form`);

          const aileForms = await getDocs(aileFormRef);

          aileForms.forEach((doc) => {
            if (doc.id) {
              setAileForm(true);
            }
          });

          const analizFormRef = collection(
            firestore,
            `patients/${id}/ses-analiz-form`
          );

          const analizForms = await getDocs(analizFormRef);

          analizForms.forEach((doc) => {
            if (doc.id) {
              setAnalizForm(true);
            }
          });
        } else {
          console.log("Bu ID'ye sahip bir hasta bulunamadı.");
        }
      } catch (error) {
        console.error("Hasta detayları sorgulanırken bir hata oluştu:", error);
      }
    };

    fetchPatientDetail();
  }, [id]);

  const getMyNotes = async () => {
    if (!user || !id) return; // Kullanıcı ve hasta kontrolü

    try {
      const notesRef = collection(firestore, `doctors/${user.uid}/notes`);
      const q = query(notesRef, where("patientId", "==", id));
      const querySnapshot = await getDocs(q);
      const notes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (notes.length > 0) {
        setMyNotes(notes);
      }
    } catch (error) {
      console.error("Notlar yüklenirken bir hata oluştu:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setDoctorId(user.uid);
        const tasksRef = collection(firestore, `patients/${id}/tasks`);
        const q = query(tasksRef, where("doctorId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedTasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate().toString(),
        }));
        setTasks(fetchedTasks);
      } else {
        console.log("Kullanıcı girişi yapılmamış.");
      }
    });

    return () => unsubscribe();
  }, [id]);

  // Terapileri çek
  useEffect(() => {
    const fetchTherapiesAndSteps = async () => {
      try {
        const therapiesSnapshot = await getDocs(
          collection(firestore, `patients/${id}/therapies`)
        );
        const therapiesWithSteps = await Promise.all(
          therapiesSnapshot.docs.map(async (doc) => {
            const therapy = { id: doc.id, ...doc.data() };
            const stepsSnapshot = await getDocs(
              collection(firestore, `patients/${id}/therapies/${doc.id}/steps`)
            );
            therapy.steps = stepsSnapshot.docs.map((stepDoc) => ({
              id: stepDoc.id,
              ...stepDoc.data(),
            }));
            return therapy;
          })
        );
        setTherapies(therapiesWithSteps);
      } catch (error) {
        console.error("Error fetching therapies and steps:", error);
      }
    };

    getMyNotes();

    fetchTherapiesAndSteps();
  }, [id]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      const tasksRef = collection(firestore, `patients/${id}/tasks`);
      const q = query(tasksRef, where("doctorId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedTasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate().toString(),
      }));
      setTasks(fetchedTasks);
    };

    fetchTasks();
  }, [id, user]);

  useEffect(() => {
    const fetchPastTherapies = async () => {
      const pastTherapiesRef = collection(
        firestore,
        `patients/${id}/Past Therapies`
      );
      const querySnapshot = await getDocs(pastTherapiesRef);
      const fetchedPastTherapies = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPastTherapies(fetchedPastTherapies);
    };

    fetchPatientNotes();

    fetchPastTherapies();
  }, [id]);

  const handleAddTherapy = () => {
    setShowModal(true);
  };

  const toggleStep = (taskId, stepIndex) => {
    const stepKey = `${taskId}-${stepIndex}`;
    setOpenSteps((prevState) => ({
      ...prevState,
      [stepKey]: !prevState[stepKey],
    }));
  };

  const handleAddForm = () => {
    Swal.fire({
      title: "Please Select Form Type",
      input: "select",
      inputOptions: {
        form1: "Aile Formu",
        form2: "Ses Analiz Formu",
      },
      inputPlaceholder: "Select form type",
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value) {
            resolve();
          } else {
            resolve("You need to select a form type");
          }
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleFormSelection(result.value);
      }
    });
  };

  const fetchPatientNotes = async () => {
    if (!user) {
      console.log("Kullanıcı bilgisi yükleniyor veya mevcut değil.");
      return;
    }

    try {
      const notesRef = collection(firestore, `patients/${id}/notes`);
      const q = query(notesRef);
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log("Hiç not bulunamadı.");
        setPatientNotes([]);
        return;
      }
      const fetchedNotes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatientNotes(fetchedNotes);
    } catch (error) {
      console.error("Notlar yüklenirken bir hata oluştu: ", error);
    }
  };

  const handleFormSelection = (formType) => {
    if (user && id) {
      // Ensure user is logged in and patient ID is available
      if (formType === "form1") {
        navigate("/new-form?id=" + id, {
          state: { doctorId: user.uid, patientId: id },
        });
      } else if (formType === "form2") {
        navigate("/form2?id=" + id, {
          state: { doctorId: user.uid, patientId: id },
        });
      }
    } else {
      console.error("User is not logged in or patient ID is not available");
    }
  };

  const [pastTherapies, setPastTherapies] = useState([]);

  const boxContents = {
    "Terapi Takip Sistemi": (
      <div className="w-full space-y-2">
        {therapies.map((therapy, index) => (
          <div
            className={`content ${isAnimated ? "animate-slideIn" : ""}`}
            style={{ animationDelay: `${(index + 1) * 100}ms` }}
            key={index + "-my-terapi"}
          >
            <div key={therapy.id} className="px-4 pb-2 text-sm text-gray-500">
              <div className="mt-2">
                <Fragment key={therapy.id}>
                  <div>Terapi İsmi: {therapy.therapyName}</div>
                  <div>Genel Açıklama: {therapy.generalDescription}</div>
                  <div>Kısa Dönem Hedefi: {therapy.shortTermGoal}</div>
                  <div>Uzun Dönem Hedefi: {therapy.longTermGoal}</div>
                  <div>Tarih Başlangıç Tarihi: {therapy.therapyStartDate} </div>
                </Fragment>
              </div>
            </div>
          </div>
        ))}
        {therapies.length === 0 && (
          <div
            className={`content ${isAnimated ? "animate-slideIn" : ""}`}
            style={{ animationDelay: `100ms` }}
          >
            <p className="text-sm text-gray-500">Terapi Bulunamadı</p>
          </div>
        )}
      </div>
    ),
    Ödevlendirme: (
      <div className="w-full space-y-4">
        {therapies.map((therapy, index) => {
          if (
            therapy.steps.length === 0 ||
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
      </div>
    ),
    "Geçmiş Terapiler": (
      <div className="w-full space-y-2">
        {pastTherapies &&
          pastTherapies.map((therapy, index) => (
            <div
              className={`content ${isAnimated ? "animate-slideIn" : ""}`}
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
              key={index + "-my-past-therapy"}
            >
              <div key={index} className="px-4 pb-2 text-sm text-gray-500">
                <div className="mt-2">
                  <p>Terapi Adı: {therapy.name}</p>
                  <p>Genel Açıklama: {therapy.generalDescription}</p>
                  <p>
                    Tarih Aralığı: {therapy.therapyStartDate} -{" "}
                    {therapy.therapyEndDate}
                  </p>
                </div>
              </div>
            </div>
          ))}
        {pastTherapies.length === 0 && (
          <div
            className={`content ${isAnimated ? "animate-slideIn" : ""}`}
            style={{ animationDelay: `100ms` }}
          >
            <p className="text-sm text-gray-500">Geçmiş Terapi</p>
          </div>
        )}
      </div>
    ),
    Notlar: (
      <div className="w-full space-y-2">
        {myNotes &&
          myNotes.map((note, index) => (
            <div
              className={`content ${isAnimated ? "animate-slideIn" : ""}`}
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
              key={index + "-my-note"}
            >
              <div className="px-4 pb-2 text-sm text-gray-500 mb-8">
                <div className="mt-2">
                  <p className="text-sm font-semibold">{note.title}</p>
                  <hr className="max-w-40 my-2" />
                  <p className="text-xs">{note.description}</p>
                </div>
              </div>
            </div>
          ))}
        {myNotes.length === 0 && (
          <div
            className={`content ${isAnimated ? "animate-slideIn" : ""}`}
            style={{ animationDelay: `100ms` }}
          >
            <p className="text-sm text-gray-500">Not Bulunamadı</p>
          </div>
        )}
      </div>
    ),
    "Danışanın Notları": (
      <div className="w-full space-y-2">
        {patientNotes &&
          patientNotes.map((note, index) => (
            <div
              className={`content ${isAnimated ? "animate-slideIn" : ""}`}
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
              key={index + "-my-note"}
            >
              <div className="px-4 pb-2 text-sm text-gray-500 mb-8">
                <div className="mt-2">
                  <p className="text-sm font-semibold">{note.title}</p>
                  <hr className="max-w-40 my-2" />
                  <p className="text-xs">{note.description}</p>
                </div>
              </div>
            </div>
          ))}
        {patientNotes.length === 0 && (
          <div
            className={`content ${isAnimated ? "animate-slideIn" : ""}`}
            style={{ animationDelay: `100ms` }}
          >
            <p className="text-sm text-gray-500">Not Bulunamadı</p>
          </div>
        )}
      </div>
    ),
  };

  const handleImageClick = (url) => {
    Swal.fire({
      imageUrl: url,
      imageAlt: "Custom image",
      title: "Image Preview",
      text: "Here is the image you clicked!",
    });
  };

  if (!patient) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
                  <div>
                    <div className="flex items-center">
                      <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                        Danışan {patient.firstName} {patient.lastName} Detay
                        Sayfası
                      </h1>
                    </div>
                    <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                      <dd className="flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6">
                        <PhoneIcon
                          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        {patient.phone}
                      </dd>
                      <dd className="mt-3 flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6 sm:mt-0">
                        <UserIcon
                          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        Bakım Veren: {patient.caregiverName || "Mevcut Değil"}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex space-x-3 md:ml-4 md:mt-0">
                <button
                  onClick={handleAddForm}
                  type="button"
                  className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                  Form Ekle
                </button>

                <button
                  onClick={handleAddNote}
                  type="button"
                  className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                  Not Ekle
                </button>

                <button
                  onClick={handleAddTherapy}
                  type="button"
                  className="inline-flex items-center rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                  Seans Ekle
                </button>
                <button
                  onClick={handleAddStep}
                  type="button"
                  className="inline-flex items-center rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                  Ödev Ekle
                </button>
                <AddStep
                  therapyId={selectedTherapyId}
                  patientId={id}
                  isOpen={showStepModal}
                  closeModal={() => setShowStepModal(false)}
                />

                <AddTherapy
                  doctorId={doctorId}
                  patientId={id}
                  isOpen={showModal}
                  closeModal={() => setShowModal(false)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
          <div className="py-6">
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

          <div className="my-4 flex items-center gap-3">
            {aileForm && (
              <Link
                to={`/new-form/preview?id=${id}`}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Aile Formu Sonuçları
              </Link>
            )}
            {analizForm && (
              <Link
                to={`/form2/preview?id=${id}`}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Ses Analiz Formu Sonuçları
              </Link>
            )}
          </div>
        </div>
      </main>
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

        .content {
          opacity: 0;
          animation: slideIn 0.5s ease-out forwards;
        }

        .box {
          cursor: pointer;
          padding: 20px;
          margin: 10px 0;
          background-color: #2dd4bf;
          border-radius: 20px;
          transition: background-color 0.3s ease;
          color: #fff;
        }

        .box:hover {
          background-color: #0d9488;
        }

        .selected {
          background-color: #115e59;
        }
      `}</style>
    </DoctorLayout>
  );
}
