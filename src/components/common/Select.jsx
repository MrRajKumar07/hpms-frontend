import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Select = forwardRef(({ label, options = [], error, ...props }, ref) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-semibold mb-1">{label}</label>}
    <select ref={ref} className="w-full p-2 border border-gray-300 rounded outline-none focus:ring-2" {...props}>
      <option value="">Select Option</option>
      {options.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
));

Select.displayName = "Select";
Select.propTypes = { label: PropTypes.string, options: PropTypes.array, error: PropTypes.string };
export default Select;