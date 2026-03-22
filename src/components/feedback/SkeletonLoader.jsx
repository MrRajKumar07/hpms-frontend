import PropTypes from 'prop-types';

const SkeletonLoader = ({ className = "h-4 w-full" }) => (
  <div className={`relative overflow-hidden bg-gray-200 rounded ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
  </div>
);

SkeletonLoader.propTypes = {
  className: PropTypes.string
};

export default SkeletonLoader;