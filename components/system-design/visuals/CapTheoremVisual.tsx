"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  CAP_SYSTEM_PROFILES,
  type CapTheoremVisualState,
} from "@/lib/system-design/lessons/perf-consistency/cap-theorem";

interface CapTheoremVisualProps {
  visualState: CapTheoremVisualState;
  accentHex: string;
}

export default function CapTheoremVisual({
  visualState,
  accentHex,
}: CapTheoremVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"simulator" | "triangle" | "pacelc">("simulator");
  const [isPartitioned, setIsPartitioned] = useState<boolean>(
    visualState.networkPartitionActive ?? true
  );
  const [capStrategy, setCapStrategy] = useState<"CP" | "AP">("CP");
  const [nodeBResponse, setNodeBResponse] = useState<string | null>(null);

  const handleQueryNodeB = () => {
    if (!isPartitioned) {
      setNodeBResponse("X = 10 (Synced Fresh Value ✓)");
    } else if (capStrategy === "CP") {
      setNodeBResponse("HTTP 503 Service Unavailable (Consistency Quorum Failed)");
    } else {
      setNodeBResponse("X = 5 (Stale Local Read - 100% Available)");
    }
  };

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
            <span>⚖️</span> CAP Theorem (Consistency vs Availability)
          </h2>
          <p className="text-xs text-zinc-400">
            During Network Partition (P) · Pick Consistency (CP) OR Availability (AP)
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "simulator"
                ? "btn-accent bg-amber-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("simulator")}
          >
            1. Partition Simulator
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "triangle"
                ? "btn-accent bg-amber-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("triangle")}
          >
            2. CAP Triangle
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "pacelc"
                ? "btn-accent bg-amber-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("pacelc")}
          >
            3. PACELC Theorem
          </button>
        </div>
      </div>

      {/* ── MODE 1: PARTITION SIMULATOR ───────────────────────────────────── */}
      {tabMode === "simulator" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl font-mono text-xs">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 font-bold">Partition Strategy:</span>
              <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
                <button
                  onClick={() => setCapStrategy("CP")}
                  className={`join-item btn btn-xs font-mono ${
                    capStrategy === "CP" ? "btn-accent bg-amber-400 text-black font-bold" : "btn-ghost text-zinc-400"
                  }`}
                >
                  CP (Consistency)
                </button>
                <button
                  onClick={() => setCapStrategy("AP")}
                  className={`join-item btn btn-xs font-mono ${
                    capStrategy === "AP" ? "btn-accent bg-emerald-400 text-black font-bold" : "btn-ghost text-zinc-400"
                  }`}
                >
                  AP (Availability)
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setIsPartitioned((prev) => !prev);
                setNodeBResponse(null);
              }}
              className={`btn btn-xs font-mono font-bold ${
                isPartitioned ? "btn-error text-white" : "btn-success text-black"
              }`}
            >
              {isPartitioned ? "⚡ Cable Severed (Partition Active)" : "✓ Network Connected"}
            </button>
          </div>

          {/* Nodes Stage */}
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-[#18181b] border border-white/10 rounded-xl">
            {/* Node A */}
            <div className="p-4 rounded-2xl border border-emerald-400 bg-[#161616] flex flex-col items-center text-center gap-2 shadow-xl min-w-[150px]">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#34d399" strokeWidth="2">
                <rect x="6" y="6" width="28" height="28" rx="4" />
                <line x1="6" y1="16" x2="34" y2="16" />
              </svg>
              <div>
                <p className="text-xs font-bold text-emerald-400">Node A (US West)</p>
                <span className="badge badge-xs badge-success text-black font-bold mt-0.5">X = 10 (Updated)</span>
              </div>
              <p className="text-[10px] text-zinc-400">Received new write</p>
            </div>

            {/* Partition Break SVG */}
            <div className="flex flex-col items-center gap-1">
              {isPartitioned ? (
                <>
                  <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
                    <line x1="0" y1="12" x2="22" y2="12" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
                    <path d="M26 6l8 12M34 6l-8 12" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="38" y1="12" x2="60" y2="12" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
                  </svg>
                  <span className="badge badge-xs badge-error text-white font-bold text-[9px]">PARTITION (P)</span>
                </>
              ) : (
                <>
                  <svg width="60" height="12" viewBox="0 0 60 12" fill="none">
                    <motion.line
                      x1="0"
                      y1="6"
                      x2="52"
                      y2="6"
                      stroke="#34d399"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      animate={reduced ? {} : { strokeDashoffset: [0, -16] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    />
                    <polygon points="52,2 60,6 52,10" fill="#34d399" />
                  </svg>
                  <span className="text-[9px] text-emerald-400">Synced Link</span>
                </>
              )}
            </div>

            {/* Node B */}
            <div className={`p-4 rounded-2xl border ${isPartitioned ? "border-amber-400" : "border-emerald-400"} bg-[#161616] flex flex-col items-center text-center gap-2 shadow-xl min-w-[150px]`}>
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke={isPartitioned ? "#fbbf24" : "#34d399"} strokeWidth="2">
                <rect x="6" y="6" width="28" height="28" rx="4" />
                <line x1="6" y1="16" x2="34" y2="16" />
              </svg>
              <div>
                <p className="text-xs font-bold text-zinc-100">Node B (US East)</p>
                <span className={`badge badge-xs font-bold mt-0.5 ${isPartitioned ? "badge-warning text-black" : "badge-success text-black"}`}>
                  {isPartitioned ? "X = 5 (Stale Copy)" : "X = 10 (Synced)"}
                </span>
              </div>
              <button
                onClick={handleQueryNodeB}
                className="btn btn-xs btn-outline btn-info font-mono text-[10px] mt-1"
              >
                Query Node B (SELECT X)
              </button>
            </div>
          </div>

          {/* Node B Response Callout */}
          {nodeBResponse && (
            <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
              nodeBResponse.startsWith("HTTP 503")
                ? "bg-red-500/10 border-red-500/30 text-red-300"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            }`}>
              <span><strong>Node B Output:</strong> {nodeBResponse}</span>
              <span className="badge badge-xs badge-ghost">{capStrategy} Model</span>
            </div>
          )}
        </div>
      )}

      {/* ── MODE 2: CAP TRIANGLE MATRIX ───────────────────────────────────── */}
      {tabMode === "triangle" && (
        <div className="z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          {CAP_SYSTEM_PROFILES.map((sys) => (
            <div key={sys.category} className="p-4 rounded-2xl border border-white/10 bg-[#121214] space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 text-xs">{sys.name}</span>
                <span className="badge badge-xs badge-warning">{sys.badge}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#18181b] space-y-1 text-[10px] text-zinc-300 border border-white/5">
                <p className="text-emerald-400 font-bold">Examples: {sys.examples.join(", ")}</p>
                <p><strong>Partition Behavior:</strong> {sys.partitionBehavior}</p>
                <p className="text-zinc-400 italic">Best for: {sys.useCase}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MODE 3: PACELC THEOREM ────────────────────────────────────────── */}
      {tabMode === "pacelc" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-amber-400">PACELC Theorem (CAP Extension):</span>
            <span className="badge badge-xs badge-info">If Partition (A vs C) · Else (L vs C)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#18181b] border border-amber-400/30 space-y-2">
              <span className="badge badge-xs badge-warning font-bold">During Network Partition (P)</span>
              <p className="text-zinc-200 text-xs">Trade-off: <strong>Availability (A)</strong> vs <strong>Consistency (C)</strong></p>
              <p className="text-[10px] text-zinc-400">Cassandra chooses Availability (AP); MongoDB chooses Consistency (CP).</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-blue-400/30 space-y-2">
              <span className="badge badge-xs badge-info font-bold">Else in Normal Operation (E)</span>
              <p className="text-zinc-200 text-xs">Trade-off: <strong>Latency (L)</strong> vs <strong>Consistency (C)</strong></p>
              <p className="text-[10px] text-zinc-400">DynamoDB chooses Latency (PA/EL); PostgreSQL synchronous replicas choose Consistency (PC/EC).</p>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-amber-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
          </svg>
          <div>
            <p className="font-bold text-amber-400">Partition Tolerance is Non-Negotiable:</p>
            <p className="text-zinc-300 text-[10px]">In distributed networks, fiber cables will get cut. You must design for P.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-emerald-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <div>
            <p className="font-bold text-emerald-400">AP vs CP Choice:</p>
            <p className="text-zinc-300 text-[10px]">Banks pick CP (accuracy &gt; uptime); Social feeds pick AP (uptime &gt; lag).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
