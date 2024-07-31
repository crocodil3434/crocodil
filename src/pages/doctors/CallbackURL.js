import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { auth, firestore } from "../../firebaseConfig";
import Swal from "sweetalert2";

export default function CallbackURL() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = React.useState("Processing");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const addSubscription = async (data) => {
    console.log("searchParams", searchParams.toString());

    const response = await fetch(process.env.REACT_APP_API_URL + "/save-sub", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: currentUser.uid,
        customerReferenceCode: searchParams.get("customerReferenceCode"),
        subscriptionReferenceCode: searchParams.get(
          "subscriptionReferenceCode"
        ),
        token: searchParams.get("token"),
      }),
    });

    const responseData = await response.json();

    if (responseData.status === 200) {
      setStatus("Success");
      Swal.fire({
        icon: "success",
        title: "Subscription success",
        text: "Subscription has been successfully processed.",
      }).then(() => {
        navigate("/dashboard");
      });
    } else {
      setStatus("Failed");
      Swal.fire({
        icon: "error",
        title: "Subscription Failed",
        text: "Subscription has been failed.If the payment is made contact our support team",
      }).then(() => {
        navigate("/billing2");
      });
    }
  };

  React.useEffect(() => {
    addSubscription();
  }, [searchParams]);

  return (
    <div className="bg-white">
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Subscription</h1>
          <p className="text-sm text-gray-500">
            Subscription is {status === "Processing" && "being processed..."}
            {status === "Success" && "successful."}
            {status === "Failed" && "failed."}
          </p>
        </div>
      </div>
    </div>
  );
}
