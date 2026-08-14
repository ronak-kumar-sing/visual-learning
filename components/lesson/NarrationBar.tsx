"use client";

import { motion, AnimatePresence } from "framer-motion";

interface NarrationBarProps {
  text: string;
  stepKey: number; // currentStep — used as AnimatePresence key
}

export default function NarrationBar({ text, stepKey }: NarrationBarProps) {
  return (
    <div
      className="rounded-xl border px-4 py-3 min-h-[3.5rem] flex items-center"
      style={{
        backgroundColor: "var(--sd-surface)",
        borderColor: "var(--sd-border)",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={stepKey}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="text-sm leading-relaxed italic"
          style={{ color: "var(--sd-text-muted)" }}
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
