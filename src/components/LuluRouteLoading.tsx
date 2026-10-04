import { LoaderCircle, Sparkles } from "lucide-react";

type LuluRouteLoadingProps = {
  label?: string;
};

/**
 * A single loading surface for route and code-split transitions.  It is
 * deliberately independent of page-specific CSS, so authentication pages do
 * not briefly fall back to the default light application canvas.
 */
export function LuluRouteLoading({ label = "Loading Lulu AI" }: LuluRouteLoadingProps) {
  return (
    <main className="lulu-route-loading" role="status" aria-live="polite" aria-label={label}>
      <div className="lulu-route-loading__mark" aria-hidden="true">
        <Sparkles size={19} strokeWidth={1.8} />
      </div>
      <div className="lulu-route-loading__copy">
        <span>LULU</span>
        <small>{label}</small>
      </div>
      <LoaderCircle className="lulu-route-loading__spinner" size={18} strokeWidth={1.8} aria-hidden="true" />
    </main>
  );
}
