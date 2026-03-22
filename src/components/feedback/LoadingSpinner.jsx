import PropTypes from 'prop-types';

const LoadingSpinner = ({ fullPage = false }) => {
    const content = (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-blue-600 animate-pulse uppercase tracking-widest">Loading</p>
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[9999] flex items-center justify-center">
                {content}
            </div>
        );
    }

    return <div className="w-full p-10 flex items-center justify-center">{content}</div>;
};

LoadingSpinner.propTypes = {
    fullPage: PropTypes.bool
};

export default LoadingSpinner;