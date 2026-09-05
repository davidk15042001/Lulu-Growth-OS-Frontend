import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export type LuluTone = "neutral" | "danger" | "success";

const toneStyles: Record<LuluTone, { border: string; background: string; color: string }> = {
  neutral: { border: "#e3e7f2", background: "rgba(255,255,255,.88)", color: "#0b1020" },
  danger: { border: "#fecaca", background: "#fff7f7", color: "#991b1b" },
  success: { border: "#bbf7d0", background: "#f0fdf4", color: "#166534" },
};

export function LuluCard({ className, style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={className}
      style={{
        border: "1px solid #e3e7f2",
        borderRadius: 18,
        background: "rgba(255,255,255,.88)",
        boxShadow: "0 18px 45px rgba(38, 45, 90, .08)",
        backdropFilter: "blur(14px)",
        ...style,
      }}
      {...props}
    />
  );
}

export function LuluState({ tone = "neutral", title, children, action, className, style, ...props }: HTMLAttributes<HTMLDivElement> & {
  tone?: LuluTone;
  title: string;
  action?: ReactNode;
}) {
  const colors = toneStyles[tone];
  return (
    <LuluCard
      className={className}
      style={{ borderColor: colors.border, background: colors.background, color: colors.color, ...style }}
      role={tone === "danger" ? "alert" : undefined}
      {...props}
    >
      <div style={{ padding: 24 }}>
        <strong style={{ display: "block", fontSize: 16, lineHeight: 1.4 }}>{title}</strong>
        <div style={{ marginTop: 8, color: "#525252", lineHeight: 1.6 }}>{children}</div>
        {action ? <div style={{ marginTop: 16 }}>{action}</div> : null}
      </div>
    </LuluCard>
  );
}

export function LuluButton({ variant = "primary", style, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
}) {
  return (
    <button
      type="button"
      {...props}
      style={{
        border: variant === "primary" ? "1px solid transparent" : "1px solid #cfd6ec",
        borderRadius: 12,
        background: variant === "primary" ? "linear-gradient(100deg, #7c3aed, #4f46e5 54%, #0ea5e9)" : "rgba(255,255,255,.88)",
        color: variant === "primary" ? "#ffffff" : "#312e81",
        padding: "10px 15px",
        font: "600 13px Poppins, sans-serif",
        cursor: "pointer",
        boxShadow: variant === "primary" ? "0 8px 20px rgba(79,70,229,.22)" : "0 5px 14px rgba(38,45,90,.06)",
        ...style,
      }}
    />
  );
}
