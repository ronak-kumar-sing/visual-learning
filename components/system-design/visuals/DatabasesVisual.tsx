"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ACID_PROPERTIES,
  type DatabasesVisualState,
} from "@/lib/system-design/lessons/web-apis/databases";

interface DatabasesVisualProps {
  visualState: DatabasesVisualState;
  accentHex: string;
}

// ── Custom Vector SVG Components (No Emoji Icons) ───────────────────────────
function AccountCard({
  name,
  balance,
  isLocked,
  isPending,
}: {
  name: string;
  balance: number;
  isLocked?: boolean;
  isPending?: boolean;
}) {
  return (
    <motion.div
      animate={{
        scale: isPending ? 1.04 : 1,
        borderColor: isLocked ? "#f59e0b" : isPending ? "#34d399" : "rgba(255,255,255,0.1)",
      }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-xl border bg-[#161616] flex flex-col items-center gap-2 text-center min-w-[130px] transition-all shadow-lg ${
        isLocked
          ? "ring-2 ring-amber-400/30 shadow-amber-400/10"
          : isPending
            ? "ring-2 ring-emerald-400/30 shadow-emerald-400/10"
            : "hover:border-white/20"
      }`}
    >
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
        <rect x="4" y="8" width="32" height="24" rx="3" fill="#18181b" stroke="#34d399" strokeWidth="1.8" />
        <circle cx="20" cy="20" r="5" stroke="#34d399" strokeWidth="1.5" />
        <line x1="4" y1="14" x2="36" y2="14" stroke="#52525b" strokeWidth="1.2" />
      </svg>
      <div>
        <p className="text-xs font-bold font-mono text-zinc-100">{name}</p>
        <p className="text-sm font-bold font-mono text-emerald-400 mt-0.5">${balance}</p>
      </div>
      {isLocked && (
        <span className="badge badge-xs badge-warning font-mono text-[9px]">
          🔒 Row Locked
        </span>
      )}
    </motion.div>
  );
}

function TransactionEngineCard({ active }: { active?: boolean }) {
  return (
    <motion.div
      animate={{
        scale: active ? 1.05 : 1,
        borderColor: active ? "#34d399" : "rgba(255,255,255,0.1)",
      }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-2xl border bg-[#18181b] flex flex-col items-center text-center gap-2 shadow-xl min-w-[140px] transition-all ${
        active ? "ring-2 ring-emerald-400/20 shadow-emerald-400/15" : "hover:border-white/20"
      }`}
    >
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
        <rect x="6" y="6" width="28" height="28" rx="4" fill="#18181b" stroke="#34d399" strokeWidth="2" />
        <circle cx="20" cy="20" r="7" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M16 20l3 3 5-6" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div>
        <p className="text-xs font-bold font-mono text-emerald-400">Transaction Manager</p>
        <p className="text-[10px] font-mono text-zinc-400 mt-0.5">ACID Orchestrator</p>
      </div>
    </motion.div>
  );
}

export default function DatabasesVisual({ visualState, accentHex }: DatabasesVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"acid" | "sql-vs-nosql" | "storage-engine">("acid");
  const [simAccountA, setSimAccountA] = useState(500);
  const [simAccountB, setSimAccountB] = useState(500);
  const [simStatus, setSimStatus] = useState<"idle" | "in-flight" | "committed" | "rolled-back">("idle");
  const [selectedAcid, setSelectedAcid] = useState(ACID_PROPERTIES[0]);

  const handleSimTransfer = () => {
    setSimStatus("in-flight");
    setTimeout(() => {
      setSimAccountA((prev) => prev - 100);
      setSimAccountB((prev) => prev + 100);
      setSimStatus("committed");
    }, 900);
  };

  const handleSimRollback = () => {
    setSimStatus("rolled-back");
    setTimeout(() => {
      setSimAccountA(500);
      setSimAccountB(500);
      setSimStatus("idle");
    }, 1200);
  };

  const stepIndex = visualState.currentStepIndex || 0;
  const isCommitted = visualState.transactionStatus === "committed" || simStatus === "committed";

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
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-emerald-400/30 rounded-2xl px-5 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-emerald-400 font-mono tracking-wide flex items-center gap-2">
            <span>🗄️</span> Databases &amp; ACID Transaction Engine
          </h2>
          <p className="text-xs text-zinc-400">
            Durable, structured storage · ACID Guarantees · SQL vs NoSQL
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "acid"
                ? "btn-accent bg-emerald-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("acid")}
          >
            1. ACID Simulation
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "sql-vs-nosql"
                ? "btn-accent bg-emerald-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("sql-vs-nosql")}
          >
            2. SQL vs NoSQL
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "storage-engine"
                ? "btn-accent bg-emerald-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("storage-engine")}
          >
            3. Storage Engine WAL
          </button>
        </div>
      </div>

      {/* ── MODE 1: ACID TRANSACTION SIMULATION ───────────────────────────── */}
      {tabMode === "acid" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
          {/* ACID Properties 4-Chip Bar */}
          <div className="grid grid-cols-4 gap-2 font-mono text-center text-xs">
            {ACID_PROPERTIES.map((p) => {
              const isSelected = selectedAcid.letter === p.letter;
              return (
                <button
                  key={p.letter}
                  onClick={() => setSelectedAcid(p)}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-emerald-500/15 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400/30 shadow-lg shadow-emerald-400/10"
                      : "bg-[#18181b] border-white/10 text-zinc-400 hover:border-white/20"
                  }`}
                >
                  <p className="font-bold text-[11px]">
                    <span className="text-emerald-400 font-black">{p.letter}</span> - {p.title}
                  </p>
                  <p className="text-[9px] opacity-80 mt-0.5">{p.badge}</p>
                </button>
              );
            })}
          </div>

          {/* Interactive Bank Transfer Stage with Live SVG Connectors */}
          <div className="relative flex items-center justify-between gap-4 p-5 bg-[#18181b] border border-white/10 rounded-xl overflow-hidden">
            {/* Account A */}
            <AccountCard
              name="Account A (Sender)"
              balance={simAccountA}
              isLocked={simStatus === "in-flight" || stepIndex === 1}
              isPending={simStatus === "in-flight" || stepIndex === 1}
            />

            {/* Middle Transaction Engine Stage with Animated Flow */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 gap-2">
              <TransactionEngineCard active={simStatus === "in-flight" || stepIndex > 0} />

              <svg width="100%" height="12" viewBox="0 0 240 12" fill="none">
                <motion.line
                  x1="0"
                  y1="6"
                  x2="230"
                  y2="6"
                  stroke="#34d399"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  animate={reduced ? {} : { strokeDashoffset: [0, -24] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
                <polygon points="230,2 240,6 230,10" fill="#34d399" />
              </svg>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimTransfer}
                  disabled={simStatus === "in-flight"}
                  className="btn btn-xs btn-success font-mono font-bold"
                >
                  Transfer $100 (COMMIT)
                </button>
                <button
                  onClick={handleSimRollback}
                  disabled={simStatus === "in-flight"}
                  className="btn btn-xs btn-error font-mono font-bold"
                >
                  Simulate Crash (ROLLBACK)
                </button>
              </div>
            </div>

            {/* Account B */}
            <AccountCard
              name="Account B (Receiver)"
              balance={simAccountB}
              isPending={isCommitted || stepIndex === 3}
            />
          </div>

          {/* Selected ACID Property Explanation Banner */}
          <div className="p-3 rounded-xl bg-[#161616] border border-emerald-400/20 font-mono text-xs flex flex-col gap-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span>{selectedAcid.letter} — {selectedAcid.title}:</span>
              <span className="badge badge-xs badge-success">{selectedAcid.badge}</span>
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">{selectedAcid.summary}</p>
            <p className="text-zinc-400 text-[10px] italic">Example: {selectedAcid.example}</p>
          </div>
        </div>
      )}

      {/* ── MODE 2: SQL VS NOSQL BREAKDOWN ────────────────────────────────── */}
      {tabMode === "sql-vs-nosql" && (
        <div className="z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* SQL Card */}
          <div className="bg-[#121214] border border-blue-500/30 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="badge badge-info font-bold">SQL (Relational)</span>
              <span className="text-blue-400 text-[10px]">PostgreSQL, MySQL, SQLite</span>
            </div>
            <div className="p-3 rounded-xl bg-[#18181b] border border-blue-500/20 space-y-1.5 text-[11px]">
              <p className="text-zinc-300">📊 <strong>Data Model:</strong> Strict Tables, Rows, Columns, &amp; Foreign Keys.</p>
              <p className="text-zinc-300">🔒 <strong>Transactions:</strong> Strict ACID compliance guaranteed.</p>
              <p className="text-zinc-300">📈 <strong>Scaling:</strong> Primarily Vertical (bigger CPU/RAM) + Read Replicas.</p>
              <p className="text-zinc-300">🎯 <strong>Best For:</strong> Financial systems, complex relational joins, e-commerce.</p>
            </div>
          </div>

          {/* NoSQL Card */}
          <div className="bg-[#121214] border border-emerald-500/30 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="badge badge-success font-bold text-black">NoSQL (Non-Relational)</span>
              <span className="text-emerald-400 text-[10px]">MongoDB, Redis, Cassandra</span>
            </div>
            <div className="p-3 rounded-xl bg-[#18181b] border border-emerald-500/20 space-y-1.5 text-[11px]">
              <p className="text-zinc-300">📄 <strong>Data Model:</strong> Flexible JSON Documents, Key-Value, Columnar, Graph.</p>
              <p className="text-zinc-300">⚡ <strong>Transactions:</strong> BASE Model (Eventual Consistency).</p>
              <p className="text-zinc-300">🌐 <strong>Scaling:</strong> Horizontal Sharding across distributed clusters.</p>
              <p className="text-zinc-300">🎯 <strong>Best For:</strong> High-throughput streaming, caching, unstructured big data.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 3: STORAGE ENGINE WAL ────────────────────────────────────── */}
      {tabMode === "storage-engine" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <h3 className="font-bold text-emerald-400 uppercase tracking-wider text-xs">
            Storage Engine Internals (Buffer Pool ➔ WAL ➔ Disk):
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#18181b] border border-blue-400/30 space-y-1.5">
              <span className="badge badge-xs badge-info">1. Buffer Pool (RAM)</span>
              <p className="font-bold text-zinc-200 text-xs">In-Memory Page Cache</p>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                Queries read and modify memory pages in nanoseconds. Dirty pages await disk flush.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-amber-400/30 space-y-1.5">
              <span className="badge badge-xs badge-warning">2. Write-Ahead Log (WAL)</span>
              <p className="font-bold text-amber-400 text-xs">Sequential Append-Only Log</p>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                Every modification is flushed sequentially to WAL disk BEFORE committing to guarantee Durability.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-emerald-400/30 space-y-1.5">
              <span className="badge badge-xs badge-success">3. Persistent Data Files (Disk)</span>
              <p className="font-bold text-emerald-400 text-xs">B-Tree / LSM Tables</p>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                Background checkpoint process flushes dirty memory pages to permanent indexed disk files.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-emerald-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <div>
            <p className="font-bold text-emerald-400">ACID Durability Guarantee:</p>
            <p className="text-zinc-300 text-[10px]">WAL ensures committed transactions survive unexpected server crashes.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4l3 3" />
          </svg>
          <div>
            <p className="font-bold text-blue-400">Total System Consistency:</p>
            <p className="text-zinc-300 text-[10px]">Total money ($1000) is conserved across all transfer states.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
