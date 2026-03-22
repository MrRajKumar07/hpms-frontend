import { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({ label, error, type = "text", ...props }, ref) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="mb-4 w-full text-left">
      {label && <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>}
      <div className="relative">
        <input
          ref={ref}
          type={isPassword && show ? "text" : type}
          className={`w-full p-2 border rounded focus:ring-2 outline-none transition-all ${error ? "border-red-500 ring-red-100" : "border-gray-300 focus:ring-blue-100"
            }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-2 top-2 text-xs font-bold text-blue-600 hover:text-blue-800"
            onClick={() => setShow(!show)}
          >
            {show ? "HIDE" : "SHOW"}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string,
};

export default Input;