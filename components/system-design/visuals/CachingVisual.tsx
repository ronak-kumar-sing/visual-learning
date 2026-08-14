"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  CACHING_STRATEGIES_DETAIL,
  type CachingPattern,
  type CachingVisualState,
} from "@/lib/system-design/lessons/perf-consistency/caching";

interface CachingVisualProps {
  visualState: CachingVisualState;
  accentHex: string;
}

export default function CachingVisual({
  visualState,
  accentHex,
}: CachingVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"simulator" | "write-patterns" | "lru-eviction">(
    "simulator"
  );
  const [simAction, setSimAction] = useState<"hit" | "miss" | "write">(
    visualState.cacheHit ? "hit" : "miss"
  );

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
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-pink-400/30 rounded-2xl px-5 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-pink-400 font-mono tracking-wide flex items-center gap-2">
            <span>⚡</span> Caching Architecture &amp; Eviction Patterns
          </h2>
          <p className="text-xs text-zinc-400">
            In-Memory Acceleration (Redis / Memcached) · Cache-Aside · Write-Through · LRU Eviction
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "simulator"
                ? "btn-accent bg-pink-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("simulator")}
          >
            1. Cache Simulator
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "write-patterns"
                ? "btn-accent bg-pink-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("write-patterns")}
          >
            2. Write Patterns
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "lru-eviction"
                ? "btn-accent bg-pink-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("lru-eviction")}
          >
            3. LRU Eviction
          </button>
        </div>
      </div>

      {/* ── MODE 1: CACHE SIMULATOR ───────────────────────────────────────── */}
      {tabMode === "simulator" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl font-mono text-xs">
          {/* Action Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
            <span className="text-zinc-300 font-bold">Simulate Query Lifecycle:</span>
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
                3. Invalidate on Write
              </button>
            </div>
          </div>

          {/* Flow Diagram */}
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-[#18181b] border border-white/10 rounded-xl">
            {/* App Server */}
            <div className="p-3.5 rounded-xl border border-white/10 bg-[#161616] flex flex-col items-center gap-1.5 min-w-[130px] text-center shadow">
              <svg width="36" height="30" viewBox="0 0 44 30" fill="none">
                <rect x="2" y="2" width="40" height="26" rx="3" fill="#18181b" stroke="#f472b6" strokeWidth="1.5" />
                <circle cx="6" cy="6" r="1.5" fill="#ef4444" />
                <circle cx="10" cy="6" r="1.5" fill="#f59e0b" />
                <circle cx="14" cy="6" r="1.5" fill="#10b981" />
                <rect x="6" y="11" width="32" height="13" rx="1" fill="#09090b" />
              </svg>
              <p className="text-[11px] font-bold text-zinc-100">App Server</p>
              <span className="badge badge-xs badge-secondary">GET user:42</span>
            </div>

            {/* SVG Connector 1 */}
            <div className="flex flex-col items-center">
              <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
                <motion.line
                  x1="0"
                  y1="6"
                  x2="32"
                  y2="6"
                  stroke="#f472b6"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  animate={reduced ? {} : { strokeDashoffset: [0, -16] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                />
                <polygon points="32,2 40,6 32,10" fill="#f472b6" />
              </svg>
              <span className="text-[9px] text-pink-400">Memory Check</span>
            </div>

            {/* Redis Cache */}
            <motion.div
              animate={{
                scale: simAction === "hit" ? 1.05 : 1,
                borderColor: simAction === "hit" ? "#34d399" : "#f472b6",
              }}
              className="p-4 rounded-2xl border bg-[#161616] flex flex-col items-center text-center gap-2 shadow-xl shadow-pink-400/10 min-w-[150px]"
            >
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#f472b6" strokeWidth="2">
                <rect x="6" y="8" width="28" height="24" rx="4" />
                <line x1="6" y1="16" x2="34" y2="16" />
                <circle cx="12" cy="12" r="1.5" fill="#f472b6" />
              </svg>
              <div>
                <p className="text-xs font-bold text-pink-400">Redis (RAM Cache)</p>
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

            {/* PostgreSQL DB */}
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
                <span className="badge badge-xs badge-info font-bold">Queried (15ms)</span>
              )}
            </motion.div>
          </div>
        </div>
      )}

      {/* ── MODE 2: WRITE PATTERNS ────────────────────────────────────────── */}
      {tabMode === "write-patterns" && (
        <div className="z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          {CACHING_STRATEGIES_DETAIL.slice(0, 3).map((item) => (
            <div key={item.id} className="p-4 rounded-2xl border border-white/10 bg-[#121214] space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-pink-400 text-xs">{item.name}</span>
                <span className="badge badge-xs badge-secondary">{item.badge}</span>
              </div>
              <p className="text-[11px] text-zinc-300">✍️ <strong>Write:</strong> {item.writeFlow}</p>
              <p className="text-[10px] text-zinc-400 italic">⚖️ {item.tradeOff}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── MODE 3: LRU EVICTION ──────────────────────────────────────────── */}
      {tabMode === "lru-eviction" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-pink-400">LRU Memory Eviction (O(1) Hash Map + Linked List):</span>
            <span className="badge badge-xs badge-error text-white">Full: 4 / 4 Slots</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { key: "user:99 (Emma)", tag: "HEAD (MRU)", color: "border-emerald-400" },
              { key: "user:42 (Alex)", tag: "Active", color: "border-white/10" },
              { key: "user:30 (Bob)", tag: "Idle (45s)", color: "border-white/10" },
              { key: "user:10 (David)", tag: "TAIL (EVICTED)", color: "border-red-400" },
            ].map((slot, i) => (
              <div key={i} className={`p-3 rounded-xl border bg-[#161616] ${slot.color} space-y-1`}>
                <span className="badge badge-xs font-bold">{slot.tag}</span>
                <p className="font-bold text-zinc-100">{slot.key}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-pink-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <div>
            <p className="font-bold text-pink-400">0.5ms Read Response:</p>
            <p className="text-zinc-300 text-[10px]">Redis in-memory RAM lookups bypass disk queries entirely.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <div>
            <p className="font-bold text-blue-400">LRU Bounded Memory:</p>
            <p className="text-zinc-300 text-[10px]">Tail eviction ensures fixed RAM footprint during traffic spikes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
