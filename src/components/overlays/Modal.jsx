import { createPortal } from 'react-dom'; // Modern import
import PropTypes from 'prop-types';
import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling background
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = 'unset'; // Re-enable scrolling
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose} // Click outside to close
    >
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden" 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-red-500 transition-colors text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

Modal.propTypes = { 
  isOpen: PropTypes.bool, 
  onClose: PropTypes.func, 
  title: PropTypes.string, 
  children: PropTypes.node 
};

export default Modal;