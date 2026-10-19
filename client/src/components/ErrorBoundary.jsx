import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Application rendering error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center p-6">
          <div className="w-full max-w-md animate-[page-enter_300ms_ease_both] rounded-2xl bg-white p-10 text-center shadow-xl">
            <span className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-red-100 font-extrabold text-red-700" aria-hidden="true">!</span>
            <h1 className="mb-2 text-2xl font-bold text-ink-900">Something went wrong</h1>
            <p className="mb-4 leading-relaxed text-muted-500">The page could not be displayed. Reload to try again.</p>
            <button type="button" className="rounded-lg bg-brand-500 px-5 py-3 font-semibold text-white hover:bg-brand-600" onClick={() => window.location.reload()}>
              Reload page
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
