import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layout & Security
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRedirect from './routes/RoleRedirect';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Unauthorized from './pages/error/Unauthorized';

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

        {/* --- PROTECTED ROUTES (Requires Login) --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>

            <Route path="/" element={<RoleRedirect />} />

            {/* --- ADMIN ONLY ROUTES --- */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              {/* RAG Configuration page */}
              <Route path="/admin/rag" element={<RagManagementPage />} />
            </Route>

            {/* --- DOCTOR ONLY ROUTES --- */}
            <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/profile" element={<DoctorProfile />} />
              <Route path="/doctor/schedule" element={<DoctorSchedulePage />} />
              <Route path="/doctor/doctors" element={<DoctorList />} />
              {/* Doctor AI Chat page */}
              <Route path="/doctor/ai-chat" element={<DoctorAIChatPage />} />
            </Route>

            {/* --- PATIENT ONLY ROUTES --- */}
            <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
              <Route path="/portal" element={<PatientPortal />} />
              <Route path="/patients/:id" element={<PatientProfile />} />
              <Route path="/patients/me" element={<PatientProfile />} />
              {/* Patient Health Buddy AI page */}
              <Route path="/patient/ai-buddy" element={<PatientAIChatPage />} />
            </Route>

          </Route>
        </Route>

        {/* Catch-all: Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;