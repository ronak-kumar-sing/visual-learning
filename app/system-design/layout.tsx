import type { ReactNode } from "react";

export default function SystemDesignLayout({
  children,
}: LayoutProps<"/system-design">) {
  return (
    <div
      className="sd-dark dark min-h-screen bg-[#0a0a0a] text-[#f4f4f5]"
      style={{ backgroundColor: "var(--sd-bg, #0a0a0a)", color: "var(--sd-text, #f4f4f5)" }}
    >
      {children}
    </div>
  );
}
