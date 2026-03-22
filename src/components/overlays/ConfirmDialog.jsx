import PropTypes from 'prop-types';
import Modal from './Modal';
import Button from '../common/Button';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = "Confirm", variant = "danger" }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <div className="flex items-start gap-4">
      <div className={`p-2 rounded-full ${variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
        <AlertTriangle size={24} />
      </div>
      <div>
        <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
      </div>
    </div>
    <div className="flex justify-end gap-3 mt-8">
      <Button variant="ghost" onClick={onClose}>Cancel</Button>
      <Button variant={variant} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
    </div>
  </Modal>
);

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost'])
};

export default ConfirmDialog;