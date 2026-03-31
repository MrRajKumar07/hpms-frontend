import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ allowedRoles }) => {
    const { accessToken, user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!accessToken) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {

        // 🔥 Auto-redirect based on role
        switch (user?.role) {
            case "ADMIN":
                return <Navigate to="/admin" replace />;
            case "NURSE":
                return <Navigate to="/nurse" replace />;
            case "RECEPTIONIST":
                return <Navigate to="/receptionist" replace />;
            case "PHARMACIST":
                return <Navigate to="/pharmacist" replace />;
            case "LAB_TECH":
                return <Navigate to="/lab-tech" replace />;
            default:
                return <Navigate to="/unauthorized" replace />;
        }
    }

    return <Outlet />;
};

ProtectedRoute.propTypes = {
    allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute;