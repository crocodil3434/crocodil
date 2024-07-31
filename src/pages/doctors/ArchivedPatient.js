import React, { useState, useEffect, Fragment } from "react";
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
  const [pastTherapies, setPastTherapies] = useState([]);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const fetchPatientDetail = async () => {
      try {
        const docRef = doc(
          firestore,
          "doctors",
          user.uid,
          "archievedPatients",
          id
        );

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          console.log("Hasta detayları:", data);

          setPatient({ id: docSnap.id, ...data });
        } else {
          console.log("Bu ID'ye sahip bir hasta bulunamadı.");
        }
      } catch (error) {
        console.error("Hasta detayları sorgulanırken bir hata oluştu:", error);
      }
    };

    fetchPatientDetail();
  }, [id, doctorId]);

  const boxContents = {
    "Terapi Takip Sistemi": (
      <div className="w-full space-y-2">
        {patient?.therapies?.map((therapy, index) => (
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
        {patient?.therapies?.length === 0 && (
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
        {patient?.therapies?.map((therapy, index) => {
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
        {patient?.pastTherapies &&
          patient?.pastTherapies.map((therapy, index) => (
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
        {patient?.pastTherapies?.length === 0 && (
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
        {patient?.myNotes &&
          patient?.myNotes?.map((note, index) => (
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
        {patient?.myNotes?.length === 0 && (
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
        {patient?.notes &&
          patient?.notes?.map((note, index) => (
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
        {patient?.notes?.length === 0 && (
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
                        Danışan {patient?.patient?.firstName}{" "}
                        {patient?.patient?.lastName} Detay Sayfası
                      </h1>
                    </div>
                    <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                      <dd className="flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6">
                        <PhoneIcon
                          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        {patient?.patient?.phone}
                      </dd>
                      <dd className="mt-3 flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6 sm:mt-0">
                        <UserIcon
                          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        Bakım Veren:{" "}
                        {patient?.patient?.caregiverName || "Mevcut Değil"}
                      </dd>
                    </dl>
                  </div>
                </div>
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
