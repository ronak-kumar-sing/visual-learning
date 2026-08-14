"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type StateValue = string | number | boolean;

interface StatePanelProps {
  state: Record<string, StateValue>;
  accentHex: string;
}

function formatKey(camel: string): string {
  return camel
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function formatValue(v: StateValue): string {
  if (typeof v === "boolean") return v ? "true" : "false";
  return String(v);
}

export default function StatePanel({ state, accentHex }: StatePanelProps) {
  const prevRef = useRef<Record<string, StateValue>>({});
  const [flashKeys, setFlashKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const changed = new Set<string>();
    for (const key of Object.keys(state)) {
      if (prevRef.current[key] !== state[key]) {
        changed.add(key);
      }
    }
    if (changed.size > 0) {
      setFlashKeys(changed);
      const timer = setTimeout(() => setFlashKeys(new Set()), 600);
      prevRef.current = { ...state };
      return () => clearTimeout(timer);
    }
    prevRef.current = { ...state };
  }, [state]);

  const entries = Object.entries(state);

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: "var(--sd-surface)",
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
          State
        </span>
      </div>

      {/* Rows */}
      <div className="divide-y" style={{ borderColor: "var(--sd-border)" }}>
        {entries.map(([key, value]) => {
          const isFlashing = flashKeys.has(key);
          return (
            <div
              key={key}
              className="flex items-center justify-between gap-3 px-4 py-2 transition-colors duration-300"
              style={{
                backgroundColor: isFlashing
                  ? `${accentHex}1a`
                  : "transparent",
              }}
            >
              <span
                className="text-xs font-mono shrink-0"
                style={{ color: "var(--sd-text-faint)" }}
              >
                {formatKey(key)}
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={formatValue(value)}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="text-xs font-mono font-medium text-right truncate"
                  style={{
                    color: isFlashing ? accentHex : "var(--sd-text)",
                  }}
                >
                  {formatValue(value)}
                </motion.span>
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
