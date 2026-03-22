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

    return <Outlet />;
};

ProtectedRoute.propTypes = {
    allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute;