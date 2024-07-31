// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSub = async (uid) => {
    const response = await fetch(
      process.env.REACT_APP_API_URL + "/lookup-sub",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
        }),
      }
    );

    const data = await response.json();

    if (data.status === 200) {
      if (data.subscription.subscriptionStatus === "CANCELED") {
        //Check if the end date of data.subscription.orders[0].endDate is greater than the current date
        const endDate = new Date(data.subscription.orders[0].endPeriod);
        const currentDate = new Date();

        if (endDate > currentDate) {
          return;
        } else {
          //Update the subscription status to expired
          const docRef = doc(firestore, "doctors", uid);
          await updateDoc(docRef, {
            paymentStatus: false,
          });
          setUserData((prev) => {
            return { ...prev, paymentStatus: false };
          });
        }
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || user === null || user === undefined) {
        setCurrentUser(null);
        setUserData(null);
        setLoading(false);
        return;
      }

      //Check if user is a doctor or a patient and set the role
      const docRef = doc(firestore, "doctors", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        data.role = "doctor";
        setUserData(data);
        console.log("Doctor UserData", data);
        setCurrentUser({ ...user, role: "doctor" });
        checkSub(user.uid);
      } else {
        //Check if the user is a patient
        const docRef = doc(firestore, "patients", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCurrentUser({ ...user, role: "patient" });
          //Create a new object with docSnap data and add the role
          const data = docSnap.data();
          data.role = "patient";
          setUserData(data);
          console.log("Patient UserData", data);
        } else {
          setUserData(null);
        }
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async user => {

  //     if (!user) {
  //       setLoading(false);
  //       return;
  //     };
  //     console.log("user context response", user);
  //     const docRef = doc(firestore, "doctors", user.uid);
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       setUserData(docSnap.data());
  //     } else {
  //       setUserData(null);
  //     }
  //     setLoading(true);
  //     if (user) {
  //       const userRef = doc(firestore, "users", user.uid);
  //       const docSnap = await getDoc(userRef);

  //       console.log("docSnap", docSnap.data());

  //       if (docSnap.exists()) {
  //         setCurrentUser({ ...user, role: docSnap.data().role });
  //       }
  //     } else {
  //       setCurrentUser(null);
  //     }
  //     setLoading(false);
  //   });

  //   return unsubscribe;
  // }, []);

  const value = {
    currentUser,
    loading,
    userData,
    setUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
