import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="text-green-500" />,
    error: <XCircle className="text-red-500" />,
    warning: <AlertCircle className="text-yellow-500" />,
    info: <Info className="text-blue-500" />,
  };

  const bgColors = {
    success: "border-green-100 bg-green-50",
    error: "border-red-100 bg-red-50",
    warning: "border-yellow-100 bg-yellow-50",
    info: "border-blue-100 bg-blue-50",
  };

  return (
    <div className={`fixed bottom-6 right-6 flex items-center gap-3 p-4 border rounded-xl shadow-lg animate-in slide-in-from-right duration-300 ${bgColors[type]}`}>
      {icons[type]}
      <p className="text-sm font-semibold text-gray-800">{message}</p>
      <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600">&times;</button>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  onClose: PropTypes.func.isRequired
};

export default Toast;