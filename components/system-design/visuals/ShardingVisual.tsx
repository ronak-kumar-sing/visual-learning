"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  SAMPLE_SHARDS,
  type ShardingVisualState,
} from "@/lib/system-design/lessons/db-internals/sharding";

interface ShardingVisualProps {
  visualState: ShardingVisualState;
  accentHex: string;
}

export default function ShardingVisual({
  visualState,
  accentHex,
}: ShardingVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"hash" | "range" | "scatter">(
    visualState.shardingMethod === "scatter-gather" ? "scatter" : "hash"
  );
  const [selectedUserId, setSelectedUserId] = useState<number>(visualState.activeUserId || 42);

  // Compute shard ID based on hash (id % 3 + 1)
  const computedShardId = (selectedUserId % 3) + 1;

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
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-orange-400/30 rounded-2xl px-5 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-orange-400 font-mono tracking-wide flex items-center gap-2">
            <span>🧩</span> Database Sharding (Horizontal Partitioning)
          </h2>
          <p className="text-xs text-zinc-400">
            Splitting data rows across independent physical nodes · Shard Key Routing &amp; Scatter-Gather
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "hash"
                ? "btn-accent bg-orange-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("hash")}
          >
            1. Hash Sharding
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "range"
                ? "btn-accent bg-orange-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("range")}
          >
            2. Range Sharding
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "scatter"
                ? "btn-accent bg-orange-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("scatter")}
          >
            3. Scatter-Gather Penalty
          </button>
        </div>
      </div>

      {/* ── MODE 1: HASH-BASED SHARDING SIMULATOR ─────────────────────────── */}
      {tabMode === "hash" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl font-mono text-xs">
          {/* User ID Preset Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
            <span className="text-zinc-300 font-bold">
              Query Shard Key: <code className="text-orange-400">WHERE user_id = {selectedUserId}</code>
            </span>
            <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
              {[42, 100, 256, 789].map((id) => (
                <button
                  key={id}
                  onClick={() => setSelectedUserId(id)}
                  className={`join-item btn btn-xs font-mono ${
                    selectedUserId === id
                      ? "btn-accent bg-orange-400 text-black font-bold"
                      : "btn-ghost text-zinc-400"
                  }`}
                >
                  user_id = {id}
                </button>
              ))}
            </div>
          </div>

          {/* Sharding Stage Diagram */}
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-[#18181b] border border-white/10 rounded-xl">
            {/* Left: Router Gateway */}
            <div className="p-4 rounded-2xl border border-orange-400 bg-[#161616] flex flex-col items-center text-center gap-2 shadow-xl shadow-orange-400/10 min-w-[150px]">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#fb923c" strokeWidth="2">
                <rect x="4" y="8" width="32" height="24" rx="3" />
                <circle cx="20" cy="20" r="5" />
              </svg>
              <div>
                <p className="text-xs font-bold text-orange-400">Sharding Gateway</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">hash({selectedUserId}) % 3 = {selectedUserId % 3}</p>
              </div>
            </div>

            {/* Middle SVG Animated Connector */}
            <div className="flex flex-col items-center">
              <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
                <motion.line
                  x1="0"
                  y1="6"
                  x2="32"
                  y2="6"
                  stroke="#fb923c"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  animate={reduced ? {} : { strokeDashoffset: [0, -16] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                />
                <polygon points="32,2 40,6 32,10" fill="#fb923c" />
              </svg>
            </div>

            {/* Right: Shard Instances */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
              {SAMPLE_SHARDS.map((shard) => {
                const isTarget = computedShardId === shard.id;
                return (
                  <motion.div
                    key={shard.id}
                    animate={{
                      scale: isTarget ? 1.05 : 1,
                      borderColor: isTarget ? "#34d399" : "rgba(255,255,255,0.1)",
                    }}
                    transition={{ duration: 0.2 }}
                    className={`p-3 rounded-xl border bg-[#161616] flex flex-col gap-1 text-xs transition-all ${
                      isTarget
                        ? "shadow-lg shadow-emerald-400/20 ring-2 ring-emerald-400/30"
                        : "opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-100">{shard.name}</span>
                      {isTarget && (
                        <span className="badge badge-xs badge-success text-black font-bold">Target ✓</span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-400">{shard.keyRange}</span>
                    <span className="text-[10px] text-emerald-300 font-bold">{shard.recordsCount.toLocaleString()} rows</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 2: RANGE-BASED SHARDING ─────────────────────────────────── */}
      {tabMode === "range" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="badge badge-info font-bold">Range-Based Partitioning Architecture</span>
            <span className="text-blue-400 text-xs">Efficient Range Scans · Hotspot Risk on Max Range</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#18181b] border border-blue-400/30 space-y-1">
              <span className="badge badge-xs badge-info">Shard A (IDs 1 - 1,000,000)</span>
              <p className="font-bold text-zinc-200">Historical Archive</p>
              <p className="text-[10px] text-zinc-400">Cold read traffic. Zero new inserts.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-blue-400/30 space-y-1">
              <span className="badge badge-xs badge-info">Shard B (IDs 1,000,001 - 2,000,000)</span>
              <p className="font-bold text-zinc-200">Intermediate Data</p>
              <p className="text-[10px] text-zinc-400">Moderate read traffic.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-red-400/40 space-y-1">
              <span className="badge badge-xs badge-error text-white">Shard C (IDs 2,000,001+)</span>
              <p className="font-bold text-red-400">HOTSPOT WARNING 🔥</p>
              <p className="text-[10px] text-zinc-400">100% of new signups hit this single shard!</p>
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 3: SCATTER-GATHER PENALTY ───────────────────────────────── */}
      {tabMode === "scatter" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-red-500/30 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="badge badge-error font-bold text-white">Scatter-Gather Penalty (Querying Without Shard Key)</span>
            <span className="text-red-400">Broadcast to 100% of physical nodes</span>
          </div>

          <div className="p-4 rounded-xl bg-[#18181b] border border-red-500/20 space-y-3">
            <p className="text-zinc-300 leading-relaxed text-xs">
              When querying by a non-shard key (e.g. <code className="text-red-400">WHERE email = &apos;user@domain.com&apos;</code>), the router cannot determine which shard owns the record. It must broadcast the query to <strong>EVERY SINGLE SHARD</strong> in parallel and merge the results in router memory.
            </p>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/60 border border-white/5 text-[11px]">
              <span className="text-zinc-400">Point Query (With Shard Key): <strong>1.2 ms</strong></span>
              <span className="text-red-400 font-bold">Scatter-Gather Broadcast: <strong>68 ms (56x Slower)</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-orange-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <div>
            <p className="font-bold text-orange-400">Horizontal Write Scaling:</p>
            <p className="text-zinc-300 text-[10px]">Distribute 100,000 write ops/sec across 20 independent database instances.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-red-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
          <div>
            <p className="font-bold text-red-400">No Cross-Shard JOINs:</p>
            <p className="text-zinc-300 text-[10px]">Multi-table joins across different shards are prohibitively expensive.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
