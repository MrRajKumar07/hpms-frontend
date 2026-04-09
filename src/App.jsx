

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layout & Security
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRedirect from './routes/RoleRedirect';

// Auth Pages
// Dashboard Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import RagManagementPage from './pages/Ai/RagManagementPage';
import DoctorAIChatPage from './pages/Ai/DoctorAIChatPage';
import PatientAIChatPage from './pages/Ai/PatientAIChatPage';
import LabTechDashBoard from './pages/dashboard/LabTechDashBoard'; // Matches your filename
import NurseDashboard from './pages/dashboard/NurseDashboard';
import PharmacistDashBoard from './pages/dashboard/PharmacistDashBoard';
import ReceptionistDashboard from './pages/dashboard/ReceptionistDashboard';
import UserManagement from './pages/dashboard/UserManagement';
import NotificationsPage from './pages/dashboard/NotificationsPage';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Unauthorized from './pages/error/Unauthorized';

// Medical Records
import MedicalRecordList from './pages/medical-records/MedicalRecordList';
import MedicalRecordDetail from './pages/medical-records/MedicalRecordDetail';
import CreateMedicalRecord from './pages/medical-records/CreateMedicalRecord';

// Prescriptions
import PrescriptionList from './pages/prescriptions/PrescriptionList';
import CreatePrescription from './pages/prescriptions/CreatePrescription';

// Placeholder Dashboards
const AdminDashboard = () => <div className="text-2xl font-bold">Admin Control Center</div>;
// Placeholder Components (Dev 2, 3, 4 will replace these)
// const AdminDashboard = () => <div className="text-2xl font-bold">Admin Control Center</div>;
const DoctorDashboard = () => <div className="text-2xl font-bold">Doctor Consultation Suite</div>;
const PatientPortal = () => <div className="text-2xl font-bold">My Health Record</div>;
// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorProfile from './pages/doctor/DoctorProfile';
import DoctorSchedulePage from './pages/doctor/DoctorSchedulePage';
import DoctorList from './pages/doctor/DoctorList';

import PatientPortal from './pages/Patient/PatientPortal';
import PatientProfile from './pages/Patient/PatientProfile';
// --- NEW AI PAGES ---
import DoctorAIChatPage from './pages/Ai/DoctorAIChatPage';
import PatientAIChatPage from './pages/Ai/PatientAIChatPage';
import RagManagementPage from './pages/Ai/RagManagementPage';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>

        {/* --- PUBLIC ROUTES --- */}
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <RoleRedirect />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <RegisterPage /> : <RoleRedirect />}
        />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* --- PROTECTED ROUTES --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>

            {/* ROOT REDIRECT */}
            <Route path="/" element={<RoleRedirect />} />

            {/* DASHBOARDS */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/rag" element={<RagManagementPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/profile" element={<DoctorProfile />} />
              <Route path="/doctor/schedule" element={<DoctorSchedulePage />} />
              <Route path="/doctor/doctors" element={<DoctorList />} />
              {/* Doctor AI Chat page */}
              <Route path="/doctor/ai-chat" element={<DoctorAIChatPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
              <Route path="/portal" element={<PatientPortal />} />
              <Route path="/patients/:id" element={<PatientProfile />} />
              <Route path="/patients/me" element={<PatientProfile />} />
              {/* Patient Health Buddy AI page */}
              <Route path="/patient/ai-buddy" element={<PatientAIChatPage />} />
            </Route>

            {/* --- LAB TECHNICIAN --- */}
            <Route element={<ProtectedRoute allowedRoles={['LAB_TECHNICIAN']} />}>
              <Route path="/lab/dashboard" element={<LabTechDashBoard />} />
            </Route>

            {/* --- NURSE --- */}
            <Route element={<ProtectedRoute allowedRoles={['NURSE']} />}>
              <Route path="/nurse/dashboard" element={<NurseDashboard />} />
            </Route>

            {/* --- PHARMACIST --- */}
            <Route element={<ProtectedRoute allowedRoles={['PHARMACIST']} />}>
              <Route path="/pharmacist/dashboard" element={<PharmacistDashBoard />} />
            </Route>

            {/* --- RECEPTIONIST --- */}
            <Route element={<ProtectedRoute allowedRoles={['RECEPTIONIST']} />}>
              <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
            </Route>

            {/* ========================= */}
            {/* 🔥 MEDICAL RECORDS */}
            {/* ========================= */}

            <Route path="/medical-records" element={<MedicalRecordList />} />
            <Route path="/medical-records/:id" element={<MedicalRecordDetail />} />

            <Route element={<ProtectedRoute allowedRoles={['DOCTOR', 'NURSE']} />}>
              <Route path="/medical-records/create" element={<CreateMedicalRecord />} />
            </Route>

            {/* ========================= */}
            {/* 🔥 PRESCRIPTIONS */}
            {/* ========================= */}

            <Route path="/prescriptions" element={<PrescriptionList />} />

            <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
              <Route path="/prescriptions/create" element={<CreatePrescription />} />
            </Route>

          </Route>
        </Route>

        {/* --- FALLBACK --- */}
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;