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

// --- NEW AI PAGES ---
import DoctorAIChatPage from './pages/Ai/DoctorAIChatPage';
import PatientAIChatPage from './pages/Ai/PatientAIChatPage';
import RagManagementPage from './pages/Ai/RagManagementPage';

// Placeholder Components
const AdminDashboard = () => <div className="text-2xl font-bold p-6">Admin Control Center</div>;
const DoctorDashboard = () => <div className="text-2xl font-bold p-6">Doctor Consultation Suite</div>;
const PatientPortal = () => <div className="text-2xl font-bold p-6">My Health Record</div>;

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
              {/* Doctor AI Chat page */}
              <Route path="/doctor/ai-chat" element={<DoctorAIChatPage />} />
            </Route>

            {/* --- PATIENT ONLY ROUTES --- */}
            <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
              <Route path="/portal" element={<PatientPortal />} />
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