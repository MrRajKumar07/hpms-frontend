import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, trend }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <h3 className="text-2xl font-black mt-1 text-gray-800">{value}</h3>
      </div>
      <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
        {Icon && <Icon size={24} />}
      </div>
    </div>

    {trend !== undefined && (
      <div className={`flex items-center mt-4 text-sm font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {trend >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
        <span>{Math.abs(trend)}%</span>
        <span className="ml-1 text-gray-400 font-normal text-xs">vs last month</span>
      </div>
    )}
  </div>
);

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType,
  trend: PropTypes.number
};

export default StatCard;