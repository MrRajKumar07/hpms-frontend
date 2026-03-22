import PropTypes from 'prop-types';

const StepIndicator = ({ steps, current }) => (
  <div className="flex items-center w-full py-4 mb-6">
    {steps.map((step, i) => (
      <div key={i} className="flex flex-1 items-center last:flex-none">
        <div className="flex flex-col items-center relative">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${i <= current ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
            {i + 1}
          </div>
          <span className={`absolute -bottom-6 text-[10px] font-bold uppercase tracking-tighter whitespace-nowrap ${i <= current ? 'text-blue-600' : 'text-gray-400'
            }`}>
            {step}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div className={`flex-1 h-0.5 mx-4 transition-colors ${i < current ? 'bg-blue-600' : 'bg-gray-200'}`} />
        )}
      </div>
    ))}
  </div>
);

StepIndicator.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  current: PropTypes.number.isRequired
};

export default StepIndicator;