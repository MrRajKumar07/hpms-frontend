import PropTypes from 'prop-types';

const Badge = ({ status }) => {
  const map = {
    // Appointment & Lab Statuses
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
    COMPLETED: "bg-green-100 text-green-700 border-green-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",

    // Bill & Payment Statuses
    PAID: "bg-emerald-100 text-emerald-700 border-emerald-200",
    UNPAID: "bg-orange-100 text-orange-700 border-orange-200",

    // Roles (Alternative use)
    ADMIN: "bg-purple-100 text-purple-700 border-purple-200",
    DOCTOR: "bg-cyan-100 text-cyan-700 border-cyan-200",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${map[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status}
    </span>
  );
};

Badge.propTypes = {
  status: PropTypes.string.isRequired
};

export default Badge;