import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./styles.css";

import Home from "./Components/Home/Home.jsx";
import Service from "./Components/Service/Service.jsx";
import About from "./Components/About/About.jsx";
import SignUp from "./Components/ContactUs/ContactUs.jsx";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute.jsx";
import MainLayout from "./Components/MainLayout/MainLayout.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NewPasswordForm from "./Components/Form sign in/Steps/NewPasswordForm.jsx";
import FormSign from "./Components/Form sign in/PrimaryForm/PrimaryForm.jsx";
import VerifyForm from "./Components/Form sign in/Steps/VerifyForm.jsx";
import LogIn from "./Components/Form sign in/Steps/LogIn.jsx";
import ForgotPasswordForm from "./Components/Form sign in/Steps/ForgotPassowrdForm.jsx";
import CreateProfile from "./Components/User/CreateProfile.jsx";
import UserProfileHandler from "./Components/User/UserProfileHandler.jsx";
import MiniProfile from "./Components/User/MiniProfile.jsx";
import ProfilePage from "./Components/User/ProfilePage.jsx";
import EditProfile from "./Components/User/EditProfile.jsx";
import DeleteProfile from "./Components/User/DeleteProfile.jsx";
import {
  AuthProvider,
  useAuth,
} from "./Components/AuthContext/AuthContext.jsx";
import RoleChangePage from "./Components/ChangeRole/ChangeRolePage .jsx";
import TopupList from "./Wallet/TopupList.jsx";
import TopupDetails from "./Wallet/TopupDetails.jsx";
import TopupForm from "./Wallet/TopupForm.jsx";
import { WalletTopupProvider } from "./Wallet/WalletTopupContext.jsx";
import HealthInsurancePage from "./Components/healthInsurance/HealthInsurancePage.jsx";
import SpecialtiesPage from "./Components/Specialties/SpecialtiesPage.jsx";
import SpecialtyPage from "./Components/Specialties/SpecialtyPage.jsx";
import Team from "./Components/About/Team/Team.jsx";
import DoctorPage from "./Components/Specialties/DoctorPage.jsx";
import SeminarsPage from "./Components/Seminars/SeminarsPage.jsx";
import SeminarDetailPage from "./Components/Seminars/SeminarDetailPage.jsx";
import MySeminarsPage from "./Components/Seminars/MySeminarsPage.jsx";
import RegistrationDetailPage from "./Components/Seminars/RegistrationDetailPage.jsx";
import AppointmentBooking from "./Components/appointment-pat/AppointmentBooking.jsx";
import AppointmentList from "./Components/appointment-pat/AppointmentList.jsx";
import AppointmentDetails from "./Components/appointment-pat/AppointmentDetails.jsx";
import PrescriptionsPage from "./Components/medicalRecord/PrescriptionsPage.jsx";
import PrescriptionDetailsPage from "./Components/medicalRecord/PrescriptionDetailsPage.jsx";
import PrescriptionRecordPage from "./Components/medicalRecord/PrescriptionRecordPage.jsx";
import InvoiceList from "./Components/Invoice/InvoiceList.jsx";
import { InvoiceProvider } from "./Components/Invoice/InvoiceContext.jsx";
import InvoiceDetails from "./Components/Invoice/InvoiceDetails.jsx";
import PaymentList from "./Components/Invoice/PaymentList.jsx";
import PaymentDetails from "./Components/Invoice/PaymentDetails.jsx";
import ModifyAppointment from "./Components/appointment-pat/ModifyAppointment.jsx";

function App() {
  const { user } = useAuth();
  const userId = user?.id;

  return (
    <div className="App">
      <AuthProvider>
        <InvoiceProvider>
          <WalletTopupProvider>
            <Routes>
              <Route path="/contact" element={<SignUp />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/signup" element={<FormSign />} />
              <Route path="/verify-code" element={<VerifyForm />} />
              <Route path="/forget-password" element={<ForgotPasswordForm />} />
              <Route path="/reset-password" element={<NewPasswordForm />} />

              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Home />} />
                <Route path="/service" element={<Service />} />
                <Route path="/about" element={<About />} />

                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/create-profile" element={<CreateProfile />} />
                <Route path="/user-profile" element={<UserProfileHandler />} />
                <Route path="/profile-view" element={<MiniProfile />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/delete-profile" element={<DeleteProfile />} />

                <Route
                  path="/change-role"
                  element={<RoleChangePage userId={userId} />}
                />

                {/* مسارات شحن الرصيد */}
                <Route path="/wallet-topups" element={<TopupList />} />
                <Route path="/wallet-topups/create" element={<TopupForm />} />
                <Route path="/wallet-topups/:id" element={<TopupDetails />} />

                <Route
                  path="/health-insurance"
                  element={<HealthInsurancePage />}
                />
                {/* مسارات التخصصات الطبية والاطباء  */}
                <Route path="/specialties" element={<SpecialtiesPage />} />
                <Route path="/specialties/:id" element={<SpecialtyPage />} />
                <Route path="/doctors" element={<Team />} />
                <Route path="/doctors/:id" element={<DoctorPage />} />

                {/* مسارات الندوات الطبية  */}
                <Route path="/seminars" element={<SeminarsPage />} />
                <Route path="/seminars/:id" element={<SeminarDetailPage />} />
                <Route path="/my-seminars" element={<MySeminarsPage />} />
                <Route
                  path="/my-seminars/:id"
                  element={<RegistrationDetailPage />}
                />

                {/* مسارات حجز الموعد  */}
                <Route
                  path="/book-appointment"
                  element={<AppointmentBooking />}
                />
                <Route path="/appointments" element={<AppointmentList />} />
                <Route
                  path="/appointments/:id"
                  element={<AppointmentDetails />}
                />
                <Route
                  path="/modify-appointment/:id"
                  element={<ModifyAppointment />}
                />

                {/* مسارات الوصفات الطبية */}
                <Route path="/prescriptions" element={<PrescriptionsPage />} />
                <Route
                  path="/prescriptions/:prescriptionId"
                  element={<PrescriptionDetailsPage />}
                />
                <Route
                  path="/prescriptions/:prescriptionId/record"
                  element={<PrescriptionRecordPage />}
                />

                {/* مسارات الفواتير والدفعات */}
                <Route path="/invoices" element={<InvoiceList />} />
                <Route
                  path="/invoices/:invoiceId"
                  element={<InvoiceDetails />}
                />
                <Route path="/payments" element={<PaymentList />} />
                <Route
                  path="/payments/:paymentId"
                  element={<PaymentDetails />}
                />
              </Route>
            </Routes>
          </WalletTopupProvider>
        </InvoiceProvider>
      </AuthProvider>
      <ToastContainer />
    </div>
  );
}

export default App;
