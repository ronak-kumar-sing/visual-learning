"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  DENORMALIZATION_COMPARISON,
  type DenormalizationVisualState,
} from "@/lib/system-design/lessons/perf-consistency/denormalization";

interface DenormalizationVisualProps {
  visualState: DenormalizationVisualState;
  accentHex: string;
}

export default function DenormalizationVisual({
  visualState,
  accentHex,
}: DenormalizationVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"normalized" | "denormalized" | "cdc-sync">(
    visualState.activeModel || "normalized"
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
            <span>📊</span> Database Denormalization vs 3NF Normalization
          </h2>
          <p className="text-xs text-zinc-400">
            Duplicating data to eliminate expensive JOINs · Fast Reads vs Costly Writes
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "normalized"
                ? "btn-accent bg-blue-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("normalized")}
          >
            1. Normalized 3NF (JOINs)
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "denormalized"
                ? "btn-accent bg-pink-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("denormalized")}
          >
            2. Denormalized (0 JOINs)
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "cdc-sync"
                ? "btn-accent bg-amber-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("cdc-sync")}
          >
            3. Write Amplification &amp; CDC
          </button>
        </div>
      </div>

      {/* ── MODE 1: NORMALIZED 3NF ────────────────────────────────────────── */}
      {tabMode === "normalized" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="badge badge-info font-bold">Normalized 3NF Architecture (PostgreSQL)</span>
            <span className="text-red-400 font-bold">2 Expensive Multi-Table JOINs (45ms)</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-[#18181b] border border-white/10 rounded-xl">
            {/* Table 1: Users */}
            <div className="p-3 rounded-xl border border-blue-400/40 bg-[#161616] space-y-1 min-w-[140px]">
              <span className="badge badge-xs badge-info font-bold">Users Table</span>
              <p className="text-zinc-200">id: 42 (PK)</p>
              <p className="text-zinc-400">name: Alex</p>
              <p className="text-zinc-400">email: alex@test.com</p>
            </div>

            <span className="text-blue-400 font-bold">⇄ JOIN ⇄</span>

            {/* Table 2: Orders */}
            <div className="p-3 rounded-xl border border-blue-400/40 bg-[#161616] space-y-1 min-w-[140px]">
              <span className="badge badge-xs badge-info font-bold">Orders Table</span>
              <p className="text-zinc-200">order_id: 101 (PK)</p>
              <p className="text-zinc-400">user_id: 42 (FK)</p>
              <p className="text-zinc-400">product_id: 99 (FK)</p>
            </div>

            <span className="text-blue-400 font-bold">⇄ JOIN ⇄</span>

            {/* Table 3: Products */}
            <div className="p-3 rounded-xl border border-blue-400/40 bg-[#161616] space-y-1 min-w-[140px]">
              <span className="badge badge-xs badge-info font-bold">Products Table</span>
              <p className="text-zinc-200">product_id: 99 (PK)</p>
              <p className="text-zinc-400">title: System Design</p>
              <p className="text-zinc-400">price: $49.99</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 flex items-center justify-between text-xs">
            <span>Zero Data Redundancy: Single source of truth for user email and product price.</span>
            <span className="font-bold text-red-400">Query Latency: 45ms</span>
          </div>
        </div>
      )}

      {/* ── MODE 2: DENORMALIZED (ZERO JOINS) ──────────────────────────────── */}
      {tabMode === "denormalized" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="badge badge-secondary font-bold">Denormalized Pre-Joined View (MongoDB / Cassandra)</span>
            <span className="text-emerald-400 font-bold">0 JOINs Point Lookup (1.2ms - 37x Speedup!)</span>
          </div>

          <div className="p-4 rounded-xl bg-[#18181b] border border-pink-400/30 space-y-2">
            <pre className="p-3 rounded-lg bg-[#09090b] text-[11px] text-pink-300 overflow-x-auto border border-white/5 leading-relaxed">
{`{
  "order_id": 101,
  "user": {
    "id": 42,
    "name": "Alex",
    "email": "alex@test.com"
  },
  "product": {
    "id": 99,
    "title": "System Design",
    "price": 49.99
  },
  "total": 49.99,
  "status": "PAID"
}`}
            </pre>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-xs">
            <span>Pre-Aggregated Read View: Entire order detail loaded in a single database seek.</span>
            <span className="font-bold text-emerald-400">Query Latency: 1.2ms</span>
          </div>
        </div>
      )}

      {/* ── MODE 3: WRITE AMPLIFICATION & CDC ─────────────────────────────── */}
      {tabMode === "cdc-sync" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-amber-400">Write Amplification &amp; Change Data Capture (CDC):</span>
            <span className="badge badge-xs badge-warning">Eventual Consistency Sync</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#18181b] border border-blue-400/30 space-y-1.5">
              <span className="badge badge-xs badge-info">1. Primary Mutation</span>
              <p className="text-zinc-200 font-bold">User Updates Email</p>
              <p className="text-[10px] text-zinc-400">Writes once to users normalized table (1x write).</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-amber-400/30 space-y-1.5">
              <span className="badge badge-xs badge-warning">2. CDC Event Stream (Kafka)</span>
              <p className="text-zinc-200 font-bold">Debezium / Kafka</p>
              <p className="text-[10px] text-zinc-400">Publishes UserEmailChanged event asynchronously.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-pink-400/30 space-y-1.5">
              <span className="badge badge-xs badge-secondary">3. Write Amplification</span>
              <p className="text-pink-400 font-bold">500 Orders Updated</p>
              <p className="text-[10px] text-zinc-400">Consumer updates 500 historic orders to reflect new email.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-pink-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2">
            <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <div>
            <p className="font-bold text-pink-400">Denormalized Read Speed:</p>
            <p className="text-zinc-300 text-[10px]">Avoids CPU-heavy relational joins on read-heavy high traffic endpoints.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <div>
            <p className="font-bold text-blue-400">Normalized Write Safety:</p>
            <p className="text-zinc-300 text-[10px]">Zero duplicate data means zero risk of inconsistent stale records.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
