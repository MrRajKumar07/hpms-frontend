import PropTypes from 'prop-types';

const DataTable = ({ columns, data, loading }) => (
  <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
    <table className="w-full text-left">
      <thead className="bg-gray-50 border-b">
        <tr>
          {columns.map(col => <th key={col.key} className="p-4 text-xs font-bold text-gray-500 uppercase">{col.header}</th>)}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr><td colSpan={columns.length} className="p-10 text-center text-blue-600 animate-pulse font-medium">Loading records...</td></tr>
        ) : data.length > 0 ? (
          data.map((row, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              {columns.map(col => <td key={col.key} className="p-4 text-sm">{row[col.key]}</td>)}
            </tr>
          ))
        ) : (
          <tr><td colSpan={columns.length} className="p-10 text-center text-gray-400 italic">No records available.</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool
};

export default DataTable;