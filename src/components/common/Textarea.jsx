import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Textarea = forwardRef(({ label, error, rows = 3, ...props }, ref) => (
  <div className="mb-4 w-full text-left">
    {label && (
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
    )}
    <textarea
      ref={ref}
      rows={rows}
      className={`w-full p-2 border rounded focus:ring-2 outline-none transition-all ${error ? "border-red-500 ring-red-100" : "border-gray-300 focus:ring-blue-100"
        }`}
      {...props}
    />
    {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
  </div>
));

Textarea.displayName = "Textarea";

Textarea.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  rows: PropTypes.number,
};

export default Textarea;