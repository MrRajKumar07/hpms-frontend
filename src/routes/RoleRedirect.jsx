import { Navigate } from "react-router-dom";
export const RoleRedirect = ({ role }) => {
  if (role === "admin") return <Navigate to="/admin" />;
  if (role === "user") return <Navigate to="/dashboard" />;
  return <Navigate to="/login" />;
};