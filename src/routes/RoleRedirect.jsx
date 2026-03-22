import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleRedirect = () => {
  const { user, accessToken } = useSelector((state) => state.auth);

  if (!accessToken) return <Navigate to="/login" replace />;

  const dashboardMap = {
    ADMIN: '/admin/dashboard',
    DOCTOR: '/doctor/dashboard',
    PATIENT: '/portal',
    NURSE: '/nurse/dashboard',
    RECEPTIONIST: '/receptionist/dashboard',
    PHARMACIST: '/pharmacy/dashboard',
    LAB_TECHNICIAN: '/lab/dashboard'
  };

  return <Navigate to={dashboardMap[user?.role] || '/login'} replace />;
};

export default RoleRedirect;