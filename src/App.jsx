import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layout & Security
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRedirect from './routes/RoleRedirect';

// Auth Pages
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
const DoctorDashboard = () => <div className="text-2xl font-bold">Doctor Consultation Suite</div>;
const PatientPortal = () => <div className="text-2xl font-bold">My Health Record</div>;

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
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
              <Route path="/portal" element={<PatientPortal />} />
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
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;