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

// Placeholder Components (Dev 2, 3, 4 will replace these)
const AdminDashboard = () => <div className="text-2xl font-bold">Admin Control Center</div>;

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorProfile from './pages/doctor/DoctorProfile';
import DoctorSchedulePage from './pages/doctor/DoctorSchedulePage';
import DoctorList from './pages/doctor/DoctorList';
import PatientPortal from './pages/Patient/PatientPortal';
import PatientProfile from './pages/Patient/PatientProfile';

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
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/profile" element={<DoctorProfile />} />
              <Route path="/doctor/schedule" element={<DoctorSchedulePage />} />
              <Route path="/doctor/doctors" element={<DoctorList />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
              <Route path="/portal" element={<PatientPortal />} />
              <Route path="/patients/:id" element={<PatientProfile />} />
              <Route path="/patients/me" element={<PatientProfile />} />
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