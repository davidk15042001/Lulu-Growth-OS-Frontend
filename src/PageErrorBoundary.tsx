import { Component, type ErrorInfo, type ReactNode } from "react";
import { LuluButton } from "./ui/primitives";

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

  private reloadPage = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-foreground" role="status">
        <div className="max-w-md rounded-xl border border-border bg-[var(--card)] p-6 text-center">
          <h1 className="text-lg font-semibold">Live workspace</h1>
          <p className="mt-2 text-sm text-muted-foreground">Live data is temporarily unavailable. Your layout remains accessible.</p>
          <LuluButton onClick={this.reloadPage}>Reload page</LuluButton>
        </div>
      </main>
    );
  }
}
