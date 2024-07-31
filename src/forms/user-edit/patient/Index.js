import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useFormik } from "formik";
import TextInput from "../../../components/inputs/text/Index";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
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
import { auth, firestore } from "../../../firebaseConfig";
import { storage } from "../../../firebaseConfig"; // Ensure you export `storage` from your Firebase config file
import swal from "sweetalert2";

export default function Index() {
  const { userData,setUserData,currentUser } = useAuth();
  const [file, SetFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const formik = useFormik({
    initialValues: {
      ad: userData.firstName,
      soyad: userData.lastName,
    },
    onSubmit: async (values) => {
      saveAll();
    },
  });

  useEffect(() => {
    if (userData) {
      formik.setFieldValue("ad", userData.firstName);
      formik.setFieldValue("soyad", userData.lastName);
      formik.setFieldValue("sirket_adi", userData.workplace);
    }
  }, []);

  const uploadImage = async () => {
    try {
      const fileRef = ref(storage, `uploads/${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(snapshot.ref);
      console.log("Uploaded file:", fileUrl);
      return fileUrl;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  };

  const saveAll = async () => {
    const body = {
      ...userData,
      firstName: formik.values.ad,
      lastName: formik.values.soyad,
    };
    if (file !== null && file !== undefined) {
      const photoUrl = await uploadImage();

      body.photoUrl = photoUrl;
    }

    console.log(body)

    updateUserDocument(body);
  };

const updateUserDocument = async (values) => {
  try {
    const userDocRef = doc(firestore, "patients", currentUser.uid);

    console.log("Updating user document:", values,userDocRef);

    try {
      await updateDoc(userDocRef, values);
      console.log("User document updated successfully");
      setUserData(values);
      swal.fire("Başarılı", "Başarıyla güncellendi.", "success");
    } catch (error) {
      console.error("Error updating user document:", error);
      swal.fire("Başarısız", "Profil Güncellenemedi", "error");
      throw error;
    }
  } catch (error) {
    swal.fire("Başarısız", "Profil Güncellenemedi", "error");
    throw error;
  }
};

  useEffect(() => {
    // Assuming 'file' is the file object you want to preview
    if (file) {
      const reader = new FileReader();

      // When the file has been read as a data URL, update the preview
      reader.onloadend = function () {
        // Assuming SetPreview is a function that sets the source of an image tag
        setPreview(reader.result);
      };

      // Read the file as a Data URL
      reader.readAsDataURL(file);
    } else {
      // Optionally handle the case where no file is provided
      setPreview(null); // Assuming setPreview is a function to handle empty/no file scenario
    }
  }, [file]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex items-center gap-3 mb-4">
        {/* <img
          className="w-12 h-12 rounded-full"
          src={preview ?? "/placeholder.jpeg"}
          alt=""
        /> */}
        <div className="flex items-center gap-3">
          <label>
            <span>Profil Resmi</span>
          </label>
          <input
            type="file"
            onChange={(e) => {
              SetFile(e.target.files[0]);
            }}
            accept="image/jpeg, image/jpg, image/png, image/svg+xml"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-2">
        <TextInput
          value={formik.values.ad}
          onChange={formik.handleChange}
          name="ad"
          label="Ad"
        />

        <TextInput
          value={formik.values.soyad}
          onChange={formik.handleChange}
          name="soyad"
          label="Soyad"
        />
      </div>

      <br />

      <button className="bg-green-400 w-full text-center py-2 text-white text-sm rounded-md">
        Ayarları Kaydet
      </button>
    </form>
  );
}
