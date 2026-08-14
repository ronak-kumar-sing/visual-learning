"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  CACHING_STRATEGIES,
  type CachingPattern,
  type CachingStrategiesVisualState,
} from "@/lib/system-design/lessons/perf-consistency/caching-strategies";

interface CachingStrategiesVisualProps {
  visualState: CachingStrategiesVisualState;
  accentHex: string;
}

export default function CachingStrategiesVisual({
  visualState,
  accentHex,
}: CachingStrategiesVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [selectedStrategy, setSelectedStrategy] = useState<CachingPattern>(
    visualState.activeStrategy || "cache-aside"
  );
  const [simAction, setSimAction] = useState<"hit" | "miss" | "write">(
    visualState.cacheHit ? "hit" : "miss"
  );

  const activeDetail =
    CACHING_STRATEGIES.find((s) => s.id === selectedStrategy) || CACHING_STRATEGIES[0];

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-between p-5 select-none overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden gap-4"
      style={{ backgroundColor: "var(--sd-bg)" }}
    >
      {/* Background SVG Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--sd-text) 1px, transparent 1px), linear-gradient(90deg, var(--sd-text) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      {/* ── HEADER BANNER ─────────────────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-amber-400/30 rounded-2xl px-5 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-amber-400 font-mono tracking-wide flex items-center gap-2">
            <span>⚡</span> Caching Strategies &amp; Invalidation Patterns
          </h2>
          <p className="text-xs text-zinc-400">
            Cache-Aside · Write-Through · Write-Behind · Write-Around
          </p>
        </div>

        {/* Strategy Selector Join Buttons */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          {CACHING_STRATEGIES.map((strat) => (
            <button
              key={strat.id}
              onClick={() => setSelectedStrategy(strat.id)}
              className={`join-item btn btn-xs font-mono ${
                selectedStrategy === strat.id
                  ? "btn-accent bg-amber-400 text-black font-bold"
                  : "btn-ghost text-zinc-400"
              }`}
            >
              {strat.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* ── CENTER STAGE: CACHE ARCHITECTURE SIMULATION ───────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-5 flex flex-col gap-4 shadow-xl font-mono text-xs">
        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
          <span className="text-zinc-300 font-bold">Simulate Request Pattern:</span>
          <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
            <button
              onClick={() => setSimAction("hit")}
              className={`join-item btn btn-xs font-mono ${
                simAction === "hit" ? "btn-success text-black font-bold" : "btn-ghost text-zinc-400"
              }`}
            >
              1. Cache HIT (0.5ms)
            </button>
            <button
              onClick={() => setSimAction("miss")}
              className={`join-item btn btn-xs font-mono ${
                simAction === "miss" ? "btn-warning text-black font-bold" : "btn-ghost text-zinc-400"
              }`}
            >
              2. Cache MISS ➔ DB
            </button>
            <button
              onClick={() => setSimAction("write")}
              className={`join-item btn btn-xs font-mono ${
                simAction === "write" ? "btn-info text-black font-bold" : "btn-ghost text-zinc-400"
              }`}
            >
              3. Write &amp; Invalidate
            </button>
          </div>
        </div>

        {/* Diagram Nodes */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-[#18181b] border border-white/10 rounded-xl">
          {/* Node 1: Application Server */}
          <div className="p-3.5 rounded-xl border border-white/10 bg-[#161616] flex flex-col items-center gap-1.5 min-w-[130px] text-center shadow">
            <svg width="36" height="30" viewBox="0 0 44 30" fill="none">
              <rect x="2" y="2" width="40" height="26" rx="3" fill="#18181b" stroke="#60a5fa" strokeWidth="1.5" />
              <circle cx="6" cy="6" r="1.5" fill="#ef4444" />
              <circle cx="10" cy="6" r="1.5" fill="#f59e0b" />
              <circle cx="14" cy="6" r="1.5" fill="#10b981" />
              <rect x="6" y="11" width="32" height="13" rx="1" fill="#09090b" />
            </svg>
            <p className="text-[11px] font-bold text-zinc-100">App Server</p>
            <span className="badge badge-xs badge-info">Client Logic</span>
          </div>

          {/* SVG Connector 1 */}
          <div className="flex flex-col items-center">
            <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
              <motion.line
                x1="0"
                y1="6"
                x2="32"
                y2="6"
                stroke="#fbbf24"
                strokeWidth="2"
                strokeDasharray="4 4"
                animate={reduced ? {} : { strokeDashoffset: [0, -16] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              />
              <polygon points="32,2 40,6 32,10" fill="#fbbf24" />
            </svg>
          </div>

          {/* Node 2: Redis Cache */}
          <motion.div
            animate={{
              scale: simAction === "hit" ? 1.05 : 1,
              borderColor: simAction === "hit" ? "#34d399" : "#fbbf24",
            }}
            className="p-4 rounded-2xl border bg-[#161616] flex flex-col items-center text-center gap-2 shadow-xl shadow-amber-400/10 min-w-[150px]"
          >
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#fbbf24" strokeWidth="2">
              <rect x="6" y="8" width="28" height="24" rx="4" />
              <line x1="6" y1="16" x2="34" y2="16" />
              <circle cx="12" cy="12" r="1.5" fill="#fbbf24" />
            </svg>
            <div>
              <p className="text-xs font-bold text-amber-400">Redis (RAM Cache)</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">TTL: 3600s · 0.5ms</p>
            </div>
            {simAction === "hit" && (
              <span className="badge badge-xs badge-success text-black font-bold">HIT ✓ (0.5ms)</span>
            )}
            {simAction === "miss" && (
              <span className="badge badge-xs badge-warning text-black font-bold">MISS ➔ Fallback</span>
            )}
          </motion.div>

          {/* SVG Connector 2 */}
          <div className="flex flex-col items-center">
            <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
              <motion.line
                x1="0"
                y1="6"
                x2="32"
                y2="6"
                stroke={simAction === "hit" ? "#52525b" : "#60a5fa"}
                strokeWidth="2"
                strokeDasharray="4 4"
                animate={reduced || simAction === "hit" ? {} : { strokeDashoffset: [0, -16] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              />
              <polygon points="32,2 40,6 32,10" fill={simAction === "hit" ? "#52525b" : "#60a5fa"} />
            </svg>
          </div>

          {/* Node 3: Primary Database */}
          <motion.div
            animate={{
              scale: simAction === "miss" || simAction === "write" ? 1.05 : 1,
              borderColor: simAction === "miss" || simAction === "write" ? "#60a5fa" : "rgba(255,255,255,0.1)",
            }}
            className="p-4 rounded-2xl border bg-[#161616] flex flex-col items-center text-center gap-2 shadow-xl min-w-[150px]"
          >
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#60a5fa" strokeWidth="2">
              <path d="M20 4c-7.732 0-14 2.239-14 5v22c0 2.761 6.268 5 14 5s14-2.239 14-5V9c0-2.761-6.268-5-14-5z" />
              <path d="M6 16c0 2.761 6.268 5 14 5s14-2.239 14-5M6 23c0 2.761 6.268 5 14 5s14-2.239 14-5" />
            </svg>
            <div>
              <p className="text-xs font-bold text-blue-400">PostgreSQL (Disk DB)</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">Persistent Storage</p>
            </div>
            {simAction === "hit" ? (
              <span className="badge badge-xs badge-ghost text-zinc-500">0% DB Load</span>
            ) : (
              <span className="badge badge-xs badge-info font-bold">Queried (12ms)</span>
            )}
          </motion.div>
        </div>

        {/* Selected Pattern Explanation Card */}
        <div className="p-3.5 rounded-xl bg-[#161616] border border-amber-400/20 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-400 text-xs">{activeDetail.name}</span>
            <span className="badge badge-xs badge-warning font-bold">{activeDetail.badge}</span>
          </div>
          <p className="text-zinc-300 text-[11px]">📖 <strong>Read Flow:</strong> {activeDetail.readFlow}</p>
          <p className="text-zinc-300 text-[11px]">✍️ <strong>Write Flow:</strong> {activeDetail.writeFlow}</p>
          <p className="text-zinc-400 text-[10px] italic">⚖️ <strong>Trade-off:</strong> {activeDetail.tradeOff}</p>
        </div>
      </div>

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-amber-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <div>
            <p className="font-bold text-amber-400">Cache-Aside Advantage:</p>
            <p className="text-zinc-300 text-[10px]">Only requested keys enter cache, preventing memory pollution.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <div>
            <p className="font-bold text-blue-400">Write-Through Durability:</p>
            <p className="text-zinc-300 text-[10px]">Ensures cache and DB are 100% in sync at the cost of write speed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
