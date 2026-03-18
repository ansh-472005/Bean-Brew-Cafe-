import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cafe-cream px-4">
          <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl text-center">
            <h2 className="text-3xl font-serif font-bold text-red-600 mb-4">Oops! Something went wrong.</h2>
            <p className="text-cafe-dark/60 mb-8">We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-cafe-brown text-cafe-cream px-8 py-3 rounded-full font-bold hover:bg-cafe-gold transition-all"
            >
              Refresh Page
            </button>
            {this.state.error && (
              <pre className="mt-8 p-4 bg-cafe-cream rounded-xl text-left text-[10px] overflow-auto max-h-40 text-cafe-dark/40">
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

export default ErrorBoundary;
