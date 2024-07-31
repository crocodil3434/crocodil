import React from "react";
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

const steps = ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"];

const addFormToPatient = async (values, id) => {
  try {
    const notesRef = collection(firestore, `patients/${id}/aile-form`);
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
      cinsiyet: "",
      dogum_tarihi: "",
      hamilelik_suresi: "",
      dogum_suresi: "",
      hamilelik_sirasinda: "",
      ilac_alma: "",
      anne_durumu: "",
      dogum_guclukler: "",
      bebek_oksijensiz_kalma: "",
      diger_zarar_verici_durumlar: "",
      dogum_sonrasi_guclukler: "",
      akraba_evliligi: "",
      vaka_oykusu: "",
      ailede_konusma_sorunu_olan_var_mi: "",
      muhtemel_konusmaya_baslama_yasi: "",
      beslenme_guclugu_cekme: "",
      varsa_gecirilen_cocukluk_hastaliklar: "",
      orta_kulak_enfeksiyonu_gecirdi_mi: "",
      isitme_sorunu: "",
      ameliyat_gecirme: "",
      gecirilen_ameliyatlar_ve_tarihi: "",
      dil_ve_konusma_problemi_tanimi: "",
      hangi_elini_kullanir: "",
      kim_ilgileniyor: "",
      okuldaki_durumu: "",
      emekleme: "",
      ayakta_durma: "",
      otururken_ayaga_kalkma: "",
      merdivenlerden_inip_cikma: "",
      ziplama: "",
      kosma: "",
      bisiklet_surme: "",
      topa_tekme_vurma: "",
      ince_motor_becerileri: [],
      cisi_kendisi_yapabilir: "",
      kakasini_kendi_yapabilir: "",
      tuvalet_temizligi_kendi_yapabilir: "",
      tuvaletinin_geldigini_nasil_ifade_ediyor: "",
      giyinme_becerileri: [],
      giyinme_becerileri_yardimla: "",
      yemek_yeme_becerileri: [],
      yemek_yeme_becerileri_yardimla: "",
      renk_sekil_sayi_buyukluk_kavramlari: [],
      belirgin_aliskanliklar: "",
      belirgin_aliskanliklar_detay: "",
      sese_tepkide_bulunma: "",
      dil_gelisimi: [],
      basit_sorulari_yanitlama: "",
      iletisim_kurmak: "",
      yardim_ister: "",
      nesneyi_isaret_eder: "",
      ilgi_bekler: "",
      hoslanmadigi_seyleri_reddeder: "",
      iletisimi_baslatir: "",
      sira_alma_davranisi: "",
      itelisim_kendisi_baslatir: "",
      oynamayi_tercih: "",
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
  ];

  return (
    <DoctorLayout>
      <div className="grid grid-cols-5 px-5 py-10 gap-5 mx-3">
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
                  <button className="bg-indigo-500 p-2 rounded-md text-white">
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
