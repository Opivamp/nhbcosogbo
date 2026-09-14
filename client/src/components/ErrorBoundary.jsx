import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-navy-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-900/40 border border-red-500 flex items-center justify-center mb-4 text-red-400 text-2xl font-bold">
            !
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mb-2">Notice</h1>
          <p className="text-slate-300 max-w-md mb-6 text-sm">
            {this.state.error?.message || 'An unexpected error occurred while loading content.'}
          </p>
          <button
            onClick={() => {
              try { localStorage.clear(); } catch(e) {}
              window.location.reload();
            }}
            className="px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-sm shadow-md transition"
          >
            Clear Cache & Reload Site
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
