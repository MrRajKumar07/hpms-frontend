import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold">{title}</h3>
          <button onClick={onClose} className="text-2xl hover:text-red-500">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

Modal.propTypes = { isOpen: PropTypes.bool, onClose: PropTypes.func, title: PropTypes.string, children: PropTypes.node };
export default Modal;