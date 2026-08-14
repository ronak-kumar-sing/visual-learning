"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { HorizontalScalingVisualState } from "@/lib/system-design/lessons/scaling/horizontal-scaling";

interface HorizontalScalingVisualProps {
  visualState: HorizontalScalingVisualState;
  accentHex: string;
}

function WorkerNodeCard({
  id,
  isDead,
  active,
}: {
  id: number;
  isDead?: boolean;
  active?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isDead ? 0.4 : 1,
        scale: isDead ? 0.95 : 1,
        borderColor: isDead ? "#ef4444" : active ? "#60a5fa" : "rgba(255,255,255,0.1)",
      }}
      transition={{ duration: 0.3 }}
      className={`p-3 rounded-xl border bg-[#161616] flex items-center gap-3 min-w-[140px] shadow-lg transition-all ${
        isDead
          ? "border-red-500 bg-red-950/20"
          : active
            ? "border-blue-400 shadow-blue-400/10 ring-1 ring-blue-400/30"
            : "hover:border-white/20"
      }`}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="7" rx="1.5" fill="#18181b" stroke={isDead ? "#ef4444" : "#60a5fa"} strokeWidth="1.5" />
        <circle cx="6" cy="6.5" r="1" fill={isDead ? "#ef4444" : "#60a5fa"} />
        <rect x="2" y="14" width="20" height="7" rx="1.5" fill="#18181b" stroke={isDead ? "#ef4444" : "#60a5fa"} strokeWidth="1.5" />
        <circle cx="6" cy="17.5" r="1" fill={isDead ? "#ef4444" : "#60a5fa"} />
      </svg>
      <div>
        <p className="text-[11px] font-bold font-mono text-zinc-100">Worker Node #{id}</p>
        <span
          className={`badge badge-xs font-mono text-[9px] mt-0.5 ${
            isDead ? "badge-error text-white" : "badge-success text-black font-bold"
          }`}
        >
          {isDead ? "Unhealthy (Dead)" : "Healthy (Active)"}
        </span>
      </div>
    </motion.div>
  );
}

export default function HorizontalScalingVisual({
  visualState,
  accentHex,
}: HorizontalScalingVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [nodeCount, setNodeCount] = useState(visualState.nodeCount || 3);
  const [deadNodeId, setDeadNodeId] = useState<number | null>(visualState.deadNodeId);

  const addNode = () => setNodeCount((prev) => Math.min(prev + 1, 8));
  const removeNode = () => setNodeCount((prev) => Math.max(prev - 1, 1));
  const toggleCrash = () => {
    setDeadNodeId((prev) => (prev === null ? 2 : null));
  };

  const activeNodes = Array.from({ length: nodeCount }, (_, i) => i + 1);

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
            <span>🌐</span> Horizontal Scaling (Scale-Out Architecture)
          </h2>
          <p className="text-xs text-zinc-400">
            Adding stateless worker nodes behind a Load Balancer · Near-infinite elasticity &amp; fault tolerance
          </p>
        </div>

        {/* Dynamic Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
            <button
              onClick={removeNode}
              disabled={nodeCount <= 1}
              className="join-item btn btn-xs btn-ghost text-zinc-300 font-bold"
            >
              - Node
            </button>
            <span className="join-item px-3 py-1 text-xs text-blue-400 font-bold flex items-center">
              {nodeCount} Nodes
            </span>
            <button
              onClick={addNode}
              disabled={nodeCount >= 8}
              className="join-item btn btn-xs btn-ghost text-zinc-300 font-bold"
            >
              + Node
            </button>
          </div>

          <button
            onClick={toggleCrash}
            className={`btn btn-xs font-mono font-bold ${
              deadNodeId !== null ? "btn-success text-black" : "btn-error text-white"
            }`}
          >
            {deadNodeId !== null ? "Revive Node #2" : "Kill Node #2 (Chaos)"}
          </button>
        </div>
      </div>

      {/* ── CENTER STAGE: LOAD BALANCER & DISTRIBUTED WORKER POOL ─────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        {/* Left: Incoming Traffic */}
        <div className="p-3.5 rounded-xl border bg-[#161616] border-white/10 flex flex-col items-center gap-1.5 min-w-[120px] text-center">
          <svg width="36" height="30" viewBox="0 0 44 30" fill="none">
            <rect x="2" y="2" width="40" height="26" rx="3" fill="#18181b" stroke="#34d399" strokeWidth="1.5" />
            <circle cx="6" cy="6" r="1.5" fill="#ef4444" />
            <circle cx="10" cy="6" r="1.5" fill="#f59e0b" />
            <circle cx="14" cy="6" r="1.5" fill="#10b981" />
            <rect x="6" y="11" width="32" height="13" rx="1" fill="#09090b" />
          </svg>
          <p className="text-[11px] font-bold font-mono text-zinc-100">User Traffic</p>
          <p className="text-[9px] font-mono text-emerald-400">{(nodeCount * 5000).toLocaleString()} RPS</p>
        </div>

        {/* Middle SVG Connector 1 */}
        <div className="flex flex-col items-center">
          <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
            <motion.line
              x1="0"
              y1="6"
              x2="32"
              y2="6"
              stroke="#34d399"
              strokeWidth="2"
              strokeDasharray="4 4"
              animate={reduced ? {} : { strokeDashoffset: [0, -16] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            />
            <polygon points="32,2 40,6 32,10" fill="#34d399" />
          </svg>
        </div>

        {/* Core Load Balancer Node */}
        <div className="p-4 rounded-2xl border border-blue-400 bg-[#18181b] flex flex-col items-center text-center gap-2 shadow-xl shadow-blue-400/10 min-w-[140px]">
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#60a5fa" strokeWidth="2">
            <path d="M20 6v14M10 20h20M10 20l-4 8h8l-4-8zM30 20l-4 8h8l-4-8z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="20" cy="6" r="2" fill="#60a5fa" />
          </svg>
          <div>
            <p className="text-xs font-bold font-mono text-blue-400">Load Balancer</p>
            <p className="text-[10px] font-mono text-zinc-400 mt-0.5">Round-Robin / Health</p>
          </div>
        </div>

        {/* Middle SVG Connector 2 */}
        <div className="flex flex-col items-center">
          <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
            <motion.line
              x1="0"
              y1="6"
              x2="32"
              y2="6"
              stroke="#60a5fa"
              strokeWidth="2"
              strokeDasharray="4 4"
              animate={reduced ? {} : { strokeDashoffset: [0, -16] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            />
            <polygon points="32,2 40,6 32,10" fill="#60a5fa" />
          </svg>
        </div>

        {/* Right: Worker Nodes Pool Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
          <AnimatePresence>
            {activeNodes.map((id) => (
              <WorkerNodeCard
                key={id}
                id={id}
                isDead={deadNodeId === id}
                active={deadNodeId !== id}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <div>
            <p className="font-bold text-blue-400">High Availability Guarantee:</p>
            <p className="text-zinc-300 text-[10px]">Zero Single Point of Failure (SPOF). Service survives node deaths.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-emerald-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          <div>
            <p className="font-bold text-emerald-400">Elastic Auto-Scaling:</p>
            <p className="text-zinc-300 text-[10px]">Spin up and tear down commodity instances dynamically based on CPU load.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
