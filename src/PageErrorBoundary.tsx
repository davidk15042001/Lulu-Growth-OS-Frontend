import { Component, type ErrorInfo, type ReactNode } from "react";

type PageErrorBoundaryProps = {
  children: ReactNode;
  pageName?: string;
};

type PageErrorBoundaryState = {
  hasError: boolean;
};

export class PageErrorBoundary extends Component<
  PageErrorBoundaryProps,
  PageErrorBoundaryState
> {
  state: PageErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): PageErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("Lulu page rendering error", { error, info });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="page-loading" role="alert">
        <p className="eyebrow">Page error</p>
        <h1>{this.props.pageName ?? "This page"} could not be displayed.</h1>
        <p>The rest of the application remains available.</p>
        <button type="button" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </main>
    );
  }
}
