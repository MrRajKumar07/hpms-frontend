import { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() { return { hasError: true }; }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Oops! Something went wrong.</h2>
          <p className="text-gray-500 mt-2 mb-6">The application encountered an unexpected error.</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Reload Application
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;