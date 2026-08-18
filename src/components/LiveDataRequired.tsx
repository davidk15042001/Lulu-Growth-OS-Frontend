import type { CSSProperties } from "react";

const cardStyle: CSSProperties = {
  minHeight: "min(60vh, 620px)",
  display: "grid",
  placeItems: "center",
  padding: "32px 20px",
  background: "var(--background, #f7f7f5)",
};

export function LiveDataRequired({ pageName }: { pageName: string }) {
  return (
    <main style={cardStyle} data-live-data-state="unavailable" data-page={pageName}>
      <section
        role="status"
        style={{
          width: "min(100%, 640px)",
          border: "1px solid var(--border, #deded8)",
          borderRadius: 20,
          padding: "32px 28px",
          background: "var(--card, #fff)",
          color: "var(--foreground, #171717)",
          textAlign: "center",
          boxShadow: "0 18px 50px rgba(20, 20, 16, .08)",
        }}
      >
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--muted-foreground, #686864)" }}>
          Live workspace data required
        </p>
        <h1 style={{ margin: "14px 0 10px", fontSize: "clamp(24px, 4vw, 34px)", lineHeight: 1.1 }}>
          Keine Demo-Daten angezeigt
        </h1>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "var(--muted-foreground, #686864)" }}>
          Für diese Seite sind noch keine verifizierten Workspace-Daten verbunden. Lulu zeigt deshalb bewusst keine Beispielwerte, simulierten Aktivitäten oder erfundenen Kennzahlen an.
        </p>
        <p style={{ margin: "16px 0 0", fontSize: 13, lineHeight: 1.6, color: "var(--muted-foreground, #686864)" }}>
          Verbinde eine passende Datenquelle oder füge echte Workspace-Daten hinzu, um diese Seite mit Live-Werten zu verwenden.
        </p>
      </section>
    </main>
  );
}
