import PropTypes from 'prop-types';

const DataTable = ({ columns, data, loading }) => (
  <div className="w-full overflow-x-auto bg-white rounded-lg shadow border border-gray-100">
    <table className="w-full text-left border-collapse">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          {columns.map((col, index) => (
            <th 
              key={col.accessor || index} 
              className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {loading ? (
          <tr>
            <td colSpan={columns.length} className="p-10 text-center text-blue-600 animate-pulse font-medium">
              Loading records...
            </td>
          </tr>
        ) : data && data.length > 0 ? (
          data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className="hover:bg-blue-50/30 transition-colors">
              {columns.map((col, colIndex) => (
                <td key={col.accessor || colIndex} className="p-4 text-sm text-gray-700">
                  {/* Logic: If there is a custom render function, use it. Otherwise, show raw data */}
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="p-10 text-center text-gray-400 italic bg-gray-50/50">
              No records available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string,
      render: PropTypes.func, // Required for custom buttons/badges
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool
};

export default DataTable;