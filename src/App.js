import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { signOut } from "firebase/auth";
import Archive from "./pages/doctors/Archive";
import Home from "./pages/public/Home";
import { auth } from "./firebaseConfig";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./pages/doctors/Dashboard";
import PDashboard from "./pages/patients/PDashboard";
import PatientDetail from "./pages/doctors/PatientDetail";
import EmailVerification from "./components/EmailVerification";
import Swal from "sweetalert2";
import Billing from "./pages/doctors/Billing";
import SuccessPage from "./components/SuccessPage";
import PaymentForm from "./pages/doctors/PaymentForm";
import Soon from "./components/Soon";
import Profile from "./components/Profile";
import Form1 from "./forms/Form1";
import Timer from "./components/Timer";
import MainPage from "./components/MainPage";
import Texts from "./pages/doctors/Texts";
import FormNew from "./forms/aile-form/Form";
import FormNewPreview from "./forms/aile-form/FormPreview";
import FormNewSes from "./forms/ses-form/Form";
import FormNewSesPreview from "./forms/ses-form/FormPreview";
import Billing2 from "./pages/doctors/Billing2";
import SubscriptionStatus from "./pages/doctors/SubscriptionStatus";
import CallbackURL from "./pages/doctors/CallbackURL";
import ArchivedPatient from "./pages/doctors/ArchivedPatient";

const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Swal.fire("Başarıyla Çıkış Yapıldı", "", "success").then(() =>
        navigate("/login")
      );
    } catch (error) {
      Swal.fire("Çıkış Yapılırken Hata Oluştu", error.message, "error");
    }
  };

  React.useEffect(() => {
    handleLogout();
  }, []);

  return null;
};

function App() {
  return (
    <div>
      <Routes>
        <Route path="/success" component={SuccessPage} />
        <Route path="/" element={<Home />} />
        <Route path="/paymentform" element={<PaymentForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/billing" element={<Billing2 />} />
        <Route path="/billing2" element={<Billing2 />} />
        <Route path="/billing2/callback" element={<CallbackURL />} />
        <Route path="/subs" element={<SubscriptionStatus />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/archivedPatient/:id" element={<ArchivedPatient />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/soon" element={<Soon />} />
        <Route path="*" element={<Soon />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pdashboard" element={<PDashboard />} />
        <Route path="/patient/:id" element={<PatientDetail />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/emailverification" element={<EmailVerification />} />
        <Route path="/form1" element={<Form1 />} />
        <Route path="/new-form" element={<FormNew />} />
        <Route path="/form2" element={<FormNewSes />} />
        <Route path="/new-form/preview" element={<FormNewPreview />} />
        <Route path="/form2/preview" element={<FormNewSesPreview />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/mmm" element={<MainPage />} />
        <Route path="/texts" element={<Texts />} />
      </Routes>
    </div>
  );
}

export default App;
