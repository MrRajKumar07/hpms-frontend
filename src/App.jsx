

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layout & Security
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRedirect from './routes/RoleRedirect';

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

// Placeholder Components (Dev 2, 3, 4 will replace these)
// const AdminDashboard = () => <div className="text-2xl font-bold">Admin Control Center</div>;
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

        {/* --- PROTECTED ROUTES (Requires Login) --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>

            {/* Logic to send user to their specific dashboard based on role */}
            <Route path="/" element={<RoleRedirect />} />

            {/* Role-Specific Guarded Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/rag" element={<RagManagementPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              {/* Doctor AI Chat page */}
              <Route path="/doctor/ai-chat" element={<DoctorAIChatPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
              <Route path="/portal" element={<PatientPortal />} />
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

          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;