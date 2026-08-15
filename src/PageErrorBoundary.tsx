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
