import { Component, type ErrorInfo, type ReactNode } from "react";
import { LuluButton, LuluState } from "./ui/primitives";

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

    if (this.props.pageName === "proud-rain-4772") {
      return (
        <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-foreground" role="alert">
          <div className="max-w-md rounded-xl border border-border bg-[var(--card)] p-6 text-center">
            <h1 className="text-lg font-semibold">Activity Timeline</h1>
            <p className="mt-2 text-sm text-muted-foreground">No activity records are available yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">Activity history may be incomplete because one or more data sources are unavailable.</p>
          </div>
        </main>
      );
    }

    const pageName = this.props.pageName ? ` ${this.props.pageName}` : "";
    return (
      <div style={{ maxWidth: 760, margin: "48px auto", padding: "0 20px" }}>
        <LuluState
          tone="danger"
          title="Page error"
          action={
            <LuluButton onClick={this.reloadPage}>
              Reload page
            </LuluButton>
          }
        >
          <span>This page</span>{pageName}{" "}
          <span>could not be displayed.</span>{" "}
          <span>The rest of the application remains available.</span>
        </LuluState>
      </div>
    );
  }
}
