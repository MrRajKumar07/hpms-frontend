import PropTypes from 'prop-types';

const Pagination = ({ current, total, onChange }) => (
  <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 border-t border-gray-100">
    <div className="flex flex-1 justify-between sm:hidden">
      <button onClick={() => onChange(current - 1)} disabled={current === 1} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</button>
      <button onClick={() => onChange(current + 1)} disabled={current === total} className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</button>
    </div>
    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <p className="text-sm text-gray-700">
        Showing page <span className="font-bold text-blue-600">{current}</span> of <span className="font-bold">{total}</span>
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(current - 1)}
          disabled={current === 1}
          className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-30"
        >
          &larr;
        </button>
        <button
          onClick={() => onChange(current + 1)}
          disabled={current === total}
          className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-30"
        >
          &rarr;
        </button>
      </div>
    </div>
  </div>
);

Pagination.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Pagination;