import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            className="btn-primary"
            onClick={() => {
              this.setState({ error: null });
              window.location.reload();
            }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
