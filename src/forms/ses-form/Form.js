import React from "react";
import moment from "moment";
import { useFormik, FormikProvider } from "formik";
import DoctorLayout from "../../components/layout/doctor/sidebar/Index";
import {
  useStepStore,
  Step,
  StepContent,
} from "../../components/step-by-step-form/StepForm";
import Step1Form from "./step-1/Form";
import Step2Form from "./step-2/Form";
import Step3Form from "./step-3/Form";
import Step4Form from "./step-4/Form";
import Step5Form from "./step-5/Form";
import Step6Form from "./step-6/Form";
import Step7Form from "./step-7/Form";
import Step8Form from "./step-8/Form";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  onAuthStateChanged,
} from "firebase/auth";
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
import Swal from "sweetalert2";
import { useSearchParams } from "react-router-dom";

const steps = [
  "Step 1",
  "Step 2",
  "Step 3",
  "Step 4",
  "Step 5",
  "Step 6",
  "Step 7",
  "Step 8",
];

const addFormToPatient = async (values, id) => {
  try {
    const notesRef = collection(firestore, `patients/${id}/ses-analiz-form`);
    await addDoc(notesRef, {
      ...values,
      createdAt: new Date(),
    });
    Swal.fire("Başarılı!", "Form bilgileri başarıyla eklendi.", "success");
  } catch (error) {
    console.error("Form bilgileri eklenirken bir hata oluştu:", error);
    Swal.fire("Hata!", "Form eklenemedi.", "error");
  }
};

export default function Form() {
  const { step, setStep, nextStep, previousStep } = useStepStore();
  //Use useSearchParams and get the id query
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");

  const formik = useFormik({
    initialValues: {
      danisan_ad_soyad: "",
      yas: "",
      cinsiyet: "", // Default to empty or you can set a default like 'erkek' or 'kadın'
      egitim_duzeyi: "", // Default to empty or a specific education level
      meslek: "",
      tani: "",
      degerlendirme_tarihi: new moment().format("YYYY-MM-DD"), // You might want to set it to today's date as a default
      ses_sikayet: "",
      cinsiyet: "", // Note: You have 'cinsiyet' listed twice, ensure this is correct or possibly a different field
      hastalik_bilgileri: "",
      vokal_abuse: "",
      hiz: "", // Default to empty or a specific speed
      siddet: "",
      rezonans: [], // Since this is a checkbox, it should be an array of checked values
      artikulasyon: "",
      solunum_tipi: [],
      informal_gozlemler: [],
      boguk_ses: "",
      nefesli_ses: "",
      hisirtili_ses: "",
      tini: "",
      tini_ranji: "",
      grade: "",
      roughness: 0, // Assuming default is '0=Normal'
      breathiness: 0,
      asthenia: 0,
      strain: 0,
      max_phonation_time_a: "",
      max_phonation_time_i: "",
      max_s_duration: "",
      max_z_duration: "",
      s_z_ratio: "",
      algisal_analiz: [],
      f0_hz: "",
      jitter: "",
      shimmer: "",
      signal_noise_ratio: "",
      voice_handicap_index_score: "",
      glottal_closure_type: "",
      mucosal_wave_presence: 0,
      periodicity: 0,
      amplitude: 0,
    },
    onSubmit: (values) => {
      console.log(values);
      addFormToPatient(values, id);
    },
  });

  const handleNext = () => {
    if (step < steps.length - 1) {
      nextStep();
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      previousStep();
    }
  };

  const stepContents = [
    <Step1Form formik={formik} />,
    <Step2Form formik={formik} />,
    <Step3Form formik={formik} />,
    <Step4Form formik={formik} />,
    <Step5Form formik={formik} />,
    <Step6Form formik={formik} />,
    <Step7Form formik={formik} />,
    <Step8Form formik={formik} />,
  ];

  return (
    <DoctorLayout>
      <div className="grid grid-cols-8 px-5 py-10 gap-5 mx-3">
        {steps.map((stp, index) => (
          <Step
            className={`group flex flex-col cursor-pointer ${
              step === index ? "bg-indigo-600 text-white" : "bg-gray-500"
            } rounded-lg px-2 py-3 text-center`}
            onClick={() => {
              setStep(index);
            }}
            key={index + "step"}
          >
            {stp}
          </Step>
        ))}
      </div>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          {stepContents.map((content, index) => (
            <StepContent
              className="bg-white p-10 flex flex-col gap-10 rounded-md border border-gray-300 mx-8"
              stepNumber={index}
              key={index + "-content-step"}
            >
              {content}
              <div className="flex items-center justify-end gap-5 mt-4">
                <button
                  className={
                    step > 0
                      ? ""
                      : "pointer-events-none cursor-not-allowed brightness-75 bg-indigo-300 p-2 rounded-md"
                  }
                  onClick={handlePrevious}
                >
                  Previous
                </button>

                {step === steps.length - 1 ? (
                  <button className="bg-indigo-500 text-white p-2 rounded-md">
                    Submit
                  </button>
                ) : (
                  <button
                    className="bg-indigo-500 text-white p-2 rounded-md"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                )}
              </div>
            </StepContent>
          ))}
        </form>
      </FormikProvider>
      <hr />
    </DoctorLayout>
  );
}
