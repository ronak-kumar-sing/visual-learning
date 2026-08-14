"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { ReplicationVisualState } from "@/lib/system-design/lessons/db-internals/replication";

interface ReplicationVisualProps {
  visualState: ReplicationVisualState;
  accentHex: string;
}

export default function ReplicationVisual({
  visualState,
  accentHex,
}: ReplicationVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"pipeline" | "sync-vs-async" | "failover">("pipeline");
  const [primaryAlive, setPrimaryAlive] = useState(visualState.primaryAlive ?? true);
  const [promotedLeader, setPromotedLeader] = useState<boolean>(visualState.promotedLeaderId !== null);

  const togglePrimaryCrash = () => {
    if (primaryAlive) {
      setPrimaryAlive(false);
      setTimeout(() => setPromotedLeader(true), 800);
    } else {
      setPrimaryAlive(true);
      setPromotedLeader(false);
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
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-orange-400/30 rounded-2xl px-5 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-orange-400 font-mono tracking-wide flex items-center gap-2">
            <span>🔄</span> Database Replication (Leader-Follower Architecture)
          </h2>
          <p className="text-xs text-zinc-400">
            Write to Primary · Stream Binlogs to Replicas · Read-Scaling &amp; Failover
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "pipeline"
                ? "btn-accent bg-orange-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("pipeline")}
          >
            1. Replication Pipeline
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "sync-vs-async"
                ? "btn-accent bg-orange-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("sync-vs-async")}
          >
            2. Sync vs Async
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "failover"
                ? "btn-accent bg-orange-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("failover")}
          >
            3. Leader Failover
          </button>
        </div>
      </div>

      {/* ── MODE 1: REPLICATION PIPELINE ──────────────────────────────────── */}
      {tabMode === "pipeline" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          {/* Left: Primary Leader Node */}
          <motion.div
            animate={{ scale: primaryAlive ? 1 : 0.95, opacity: primaryAlive ? 1 : 0.4 }}
            className="w-full md:w-64 bg-[#18181b] border border-orange-400/50 rounded-2xl p-4 flex flex-col items-center text-center gap-2.5 shadow-xl shadow-orange-400/10"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="6" y="6" width="28" height="28" rx="4" fill="#18181b" stroke="#fb923c" strokeWidth="2" />
              <path d="M12 16h16M12 24h16" stroke="#fb923c" strokeWidth="1.5" />
              <circle cx="28" cy="12" r="2" fill="#ef4444" />
            </svg>
            <div>
              <p className="text-xs font-bold font-mono text-orange-400">Primary DB (Leader)</p>
              <span className="badge badge-xs badge-warning font-mono mt-0.5">100% Write Traffic</span>
            </div>
            <p className="text-[10px] font-mono text-zinc-400">Writes local WAL &amp; Binlog</p>
          </motion.div>

          {/* Middle: Binlog Streaming SVG Connectors */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono text-orange-300">Binlog Stream (Async)</span>
            <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
              <motion.line
                x1="0"
                y1="10"
                x2="50"
                y2="10"
                stroke="#fb923c"
                strokeWidth="2"
                strokeDasharray="4 4"
                animate={reduced ? {} : { strokeDashoffset: [0, -16] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              />
              <polygon points="50,6 60,10 50,14" fill="#fb923c" />
              <motion.line
                x1="0"
                y1="30"
                x2="50"
                y2="30"
                stroke="#fb923c"
                strokeWidth="2"
                strokeDasharray="4 4"
                animate={reduced ? {} : { strokeDashoffset: [0, -16] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              />
              <polygon points="50,26 60,30 50,34" fill="#fb923c" />
            </svg>
            <span className="badge badge-xs badge-ghost font-mono text-[9px]">Lag: ~15ms</span>
          </div>

          {/* Right: Read Replicas Pool */}
          <div className="flex-1 flex flex-col gap-3 w-full">
            <div className="p-3.5 rounded-xl border border-blue-400/40 bg-[#161616] flex items-center justify-between font-mono text-xs shadow">
              <div className="flex items-center gap-2.5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="7" rx="1.5" />
                  <rect x="2" y="14" width="20" height="7" rx="1.5" />
                </svg>
                <div>
                  <p className="font-bold text-zinc-100">Read Replica #1</p>
                  <p className="text-[10px] text-blue-400">Lag: 15ms · 5,000 Reads/sec</p>
                </div>
              </div>
              <span className="badge badge-xs badge-info font-bold">Read Pool</span>
            </div>

            <div className="p-3.5 rounded-xl border border-blue-400/40 bg-[#161616] flex items-center justify-between font-mono text-xs shadow">
              <div className="flex items-center gap-2.5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="7" rx="1.5" />
                  <rect x="2" y="14" width="20" height="7" rx="1.5" />
                </svg>
                <div>
                  <p className="font-bold text-zinc-100">Read Replica #2</p>
                  <p className="text-[10px] text-blue-400">Lag: 35ms · 5,000 Reads/sec</p>
                </div>
              </div>
              <span className="badge badge-xs badge-info font-bold">Read Pool</span>
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 2: SYNC VS ASYNC REPLICATION ─────────────────────────────── */}
      {tabMode === "sync-vs-async" && (
        <div className="z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="bg-[#121214] border border-blue-400/30 rounded-2xl p-4 space-y-3 shadow-lg">
            <span className="badge badge-info font-bold">Synchronous Replication</span>
            <div className="space-y-1.5 text-[11px] text-zinc-300">
              <p>🔒 <strong>Consistency:</strong> Zero data loss (RPO = 0). Leader waits for replica confirmation before responding to client.</p>
              <p>⏱️ <strong>Write Latency:</strong> Higher write latency (slowest replica throttles client).</p>
              <p>🎯 <strong>Best For:</strong> Mission-critical financial balances and stock transactions.</p>
            </div>
          </div>

          <div className="bg-[#121214] border border-orange-400/30 rounded-2xl p-4 space-y-3 shadow-lg">
            <span className="badge badge-warning font-bold">Asynchronous Replication (Default)</span>
            <div className="space-y-1.5 text-[11px] text-zinc-300">
              <p>⚡ <strong>Write Latency:</strong> Ultra-fast write ACK immediately after Leader commits locally.</p>
              <p>⚠️ <strong>Replication Lag:</strong> Replicas lag by a few milliseconds. Risk of minor data loss if Leader abruptly crashes.</p>
              <p>🎯 <strong>Best For:</strong> High-throughput web applications, social feeds, and e-commerce catalogs.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 3: FAILOVER & LEADER ELECTION ────────────────────────────── */}
      {tabMode === "failover" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-5 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-orange-400">Automated High-Availability Failover Simulation:</span>
            <button
              onClick={togglePrimaryCrash}
              className={`btn btn-xs font-mono font-bold ${
                primaryAlive ? "btn-error text-white" : "btn-success text-black"
              }`}
            >
              {primaryAlive ? "Kill Primary Leader (Crash)" : "Revive Primary Leader"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary State */}
            <div className={`p-4 rounded-xl border ${primaryAlive ? "border-orange-400/40 bg-[#161616]" : "border-red-500 bg-red-950/20 opacity-50"}`}>
              <p className="font-bold text-zinc-100">{primaryAlive ? "Primary Leader (Active)" : "Primary Leader (OFFLINE / CRASHED)"}</p>
              <p className="text-[10px] text-zinc-400 mt-1">
                {primaryAlive ? "Accepting all writes." : "Heartbeat timed out. Cluster initiated election."}
              </p>
            </div>

            {/* Promoted Replica State */}
            <div className={`p-4 rounded-xl border ${promotedLeader ? "border-emerald-400 bg-emerald-950/20 ring-2 ring-emerald-400/30" : "border-blue-400/40 bg-[#161616]"}`}>
              <p className="font-bold text-zinc-100">
                {promotedLeader ? "Read Replica #1 ➔ PROMOTED TO NEW LEADER ✓" : "Read Replica #1 (Standby)"}
              </p>
              <p className="text-[10px] text-zinc-400 mt-1">
                {promotedLeader ? "Now accepting writes and streaming binlogs to remaining replicas." : "Replicating binlogs from leader."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-orange-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          <div>
            <p className="font-bold text-orange-400">Read Scaling Advantage:</p>
            <p className="text-zinc-300 text-[10px]">Add 5+ read replicas to effortlessly scale to 50,000+ read queries/sec.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" />
          </svg>
          <div>
            <p className="font-bold text-blue-400">Replication Lag Awareness:</p>
            <p className="text-zinc-300 text-[10px]">Users writing a post must read their own write from Primary to avoid stale UI.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
