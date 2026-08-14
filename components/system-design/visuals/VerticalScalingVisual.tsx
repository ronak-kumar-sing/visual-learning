"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  HARDWARE_TIERS,
  type VerticalScalingVisualState,
} from "@/lib/system-design/lessons/scaling/vertical-scaling";

interface VerticalScalingVisualProps {
  visualState: VerticalScalingVisualState;
  accentHex: string;
}

export default function VerticalScalingVisual({
  visualState,
  accentHex,
}: VerticalScalingVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [selectedTierId, setSelectedTierId] = useState(
    visualState.activeTierId || "small"
  );

  const activeTier =
    HARDWARE_TIERS.find((t) => t.id === selectedTierId) || HARDWARE_TIERS[0];

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
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-blue-400/30 rounded-2xl px-5 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-blue-400 font-mono tracking-wide flex items-center gap-2">
            <span>🚀</span> Vertical Scaling (Scale-Up Architecture)
          </h2>
          <p className="text-xs text-zinc-400">
            Upgrading CPU, RAM, &amp; Storage on a single machine · Simple but physically limited
          </p>
        </div>

        {/* Tier Selector Join Buttons */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          {HARDWARE_TIERS.map((tier) => (
            <button
              key={tier.id}
              onClick={() => setSelectedTierId(tier.id)}
              className={`join-item btn btn-xs font-mono ${
                selectedTierId === tier.id
                  ? tier.isNearCeiling
                    ? "btn-error bg-red-500 text-white font-bold"
                    : "btn-accent bg-blue-400 text-black font-bold"
                  : "btn-ghost text-zinc-400"
              }`}
            >
              {tier.cpu} vCPU
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN HARDWARE RACK STAGE ───────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        {/* Left: Server Hardware Visualization */}
        <motion.div
          animate={{
            scale: activeTier.isNearCeiling ? 1.05 : 1,
            borderColor: activeTier.isNearCeiling ? "#ef4444" : "#60a5fa",
          }}
          transition={{ duration: 0.3 }}
          className="w-full md:w-80 bg-[#18181b] border rounded-2xl p-4 flex flex-col gap-3.5 shadow-2xl"
          style={{ borderColor: activeTier.isNearCeiling ? "#ef4444" : "#60a5fa" }}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-mono font-bold text-xs text-zinc-100 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="8" rx="2" />
                <rect x="2" y="14" width="20" height="8" rx="2" />
                <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="2" />
                <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="2" />
              </svg>
              {activeTier.name}
            </span>
            <span className="badge badge-xs badge-info font-mono">${activeTier.monthlyCost}/mo</span>
          </div>

          {/* CPU Cores Meter */}
          <div className="space-y-1 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Compute Processing:</span>
              <span className="text-blue-400 font-bold">{activeTier.cpu} Cores</span>
            </div>
            <div className="grid grid-cols-8 gap-1 bg-[#09090b] p-2 rounded-lg border border-white/5">
              {Array.from({ length: Math.min(activeTier.cpu, 32) }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={reduced ? {} : { opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.2 + (i % 4) * 0.2 }}
                  className="h-2 rounded-sm bg-blue-400"
                />
              ))}
            </div>
          </div>

          {/* RAM Meter */}
          <div className="space-y-1 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Memory Capacity:</span>
              <span className="text-emerald-400 font-bold">{activeTier.ram} GB RAM</span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#09090b] border border-white/5 overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((activeTier.ram / 512) * 100, 100)}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400"
              />
            </div>
          </div>

          {/* Maximum RPS */}
          <div className="bg-blue-500/10 border border-blue-500/30 p-2.5 rounded-xl text-center font-mono text-xs text-blue-300">
            ⚡ Max Throughput: <strong>{activeTier.capacityRps.toLocaleString()} Req/Sec</strong>
          </div>
        </motion.div>

        {/* Right: Architectural Trade-off Breakdown */}
        <div className="flex-1 flex flex-col gap-3 font-mono text-xs">
          {/* Hardware Ceiling Card */}
          {activeTier.isNearCeiling ? (
            <div className="bg-red-500/10 border border-red-500/40 p-4 rounded-xl space-y-1.5 shadow-lg">
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                <span>⚠️</span> HARDWARE CEILING REACHED (Scale-Up Limit)
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                You cannot buy a 10,000-core motherboard. Upgrading beyond this tier yields diminishing returns at exponential cost ($4,200/mo). To scale further, you MUST switch to Horizontal Scaling (Scale-Out).
              </p>
            </div>
          ) : (
            <div className="bg-[#18181b] border border-white/10 p-4 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <span>✓</span> Simple &amp; Effective for Early Growth
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Zero distributed system complexity. No distributed caching, no network partitions, and no sharding logic required.
              </p>
            </div>
          )}

          {/* Single Point of Failure (SPOF) Alert */}
          <div className="bg-[#18181b] border border-amber-400/30 p-4 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <span>🚨</span> Single Point of Failure (SPOF) Hazard
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              If this single physical machine crashes, loses power, or undergoes maintenance reboots, 100% of your users experience immediate downtime.
            </p>
          </div>
        </div>
      </div>

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          <div>
            <p className="font-bold text-blue-400">Scale-Up Simplicity:</p>
            <p className="text-zinc-300 text-[10px]">No code changes required. Just upgrade server instance specs.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-red-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-bold text-red-400">The Hard Limits:</p>
            <p className="text-zinc-300 text-[10px]">Physical socket limits, downtime on upgrade, and single point of failure.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
