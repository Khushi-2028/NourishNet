import { Component } from "react";
import { FiAlertOctagon } from "react-icons/fi";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("NourishNet UI error boundary caught:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-orange-50/40 dark:bg-surface-dark px-4">
          <div className="card p-8 max-w-md w-full text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center mx-auto mb-4">
              <FiAlertOctagon size={26} className="text-rose-500" />
            </div>
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              Something went wrong
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              An unexpected error occurred while rendering this page. Try
              going back to the homepage.
            </p>
            <button onClick={this.handleReset} className="btn-primary mt-6">
              Go to Homepage
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
