import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export type LuluTone = "neutral" | "danger" | "success";

const toneStyles: Record<LuluTone, { border: string; background: string; color: string }> = {
  neutral: { border: "#d5d5d0", background: "#ffffff", color: "#171717" },
  danger: { border: "#efb8b8", background: "#fff7f7", color: "#7f1d1d" },
  success: { border: "#b7dfc2", background: "#f4fff6", color: "#14532d" },
};

export function LuluCard({ className, style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={className}
      style={{
        border: "1px solid #e5e5df",
        borderRadius: 14,
        background: "#ffffff",
        boxShadow: "0 12px 32px rgba(23, 23, 23, 0.08)",
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
        border: variant === "primary" ? "1px solid #171717" : "1px solid #d5d5d0",
        borderRadius: 8,
        background: variant === "primary" ? "#171717" : "#ffffff",
        color: variant === "primary" ? "#ffffff" : "#171717",
        padding: "9px 14px",
        font: "600 13px Poppins, sans-serif",
        cursor: "pointer",
        ...style,
      }}
    />
  );
}
