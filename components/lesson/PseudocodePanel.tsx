"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface PseudocodePanelProps {
  lines: string[];
  activeLine?: number;
  accentHex: string;
}

export default function PseudocodePanel({
  lines,
  activeLine,
  accentHex,
}: PseudocodePanelProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div
      className="rounded-xl overflow-hidden border flex flex-col"
      style={{
        backgroundColor: "var(--sd-code-bg)",
        borderColor: "var(--sd-border)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b"
        style={{ borderColor: "var(--sd-border)" }}
      >
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: accentHex + "80" }}
        />
        <span
          className="text-xs font-mono uppercase tracking-wider"
          style={{ color: "var(--sd-text-faint)" }}
        >
          Pseudocode
        </span>
      </div>

      {/* Lines */}
      <div className="py-2 overflow-x-auto overflow-y-auto max-h-72 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {lines.map((line, idx) => {
          const isActive = idx === activeLine;
          return (
            <motion.div
              key={idx}
              animate={
                prefersReduced
                  ? {}
                  : {
                      opacity: isActive ? 1 : 0.4,
                      backgroundColor: isActive
                        ? `${accentHex}1a`
                        : "transparent",
                    }
              }
              transition={{ duration: 0.2 }}
              className="relative flex items-start"
              style={{
                opacity: isActive ? 1 : 0.4,
                backgroundColor: isActive ? `${accentHex}1a` : "transparent",
              }}
            >
              {/* Accent bar */}
              <motion.div
                className="flex-shrink-0 w-[3px] self-stretch"
                animate={
                  prefersReduced ? {} : { backgroundColor: isActive ? accentHex : "transparent" }
                }
                transition={{ duration: 0.2 }}
                style={{
                  backgroundColor: isActive ? accentHex : "transparent",
                }}
              />

              {/* Line number */}
              <span
                className="flex-shrink-0 w-7 text-right pr-2.5 py-1 text-xs font-mono select-none opacity-60"
                style={{ color: "var(--sd-text-faint)" }}
              >
                {idx + 1}
              </span>

              {/* Code */}
              <pre
                className="flex-1 py-1 pr-3 text-xs md:text-sm font-mono leading-relaxed whitespace-pre-wrap break-words min-w-0"
                style={{ color: "var(--sd-text)" }}
              >
                {line}
              </pre>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
