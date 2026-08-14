"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  USER_TABLE_COLUMNS,
  type VerticalPartitioningVisualState,
} from "@/lib/system-design/lessons/db-internals/vertical-partitioning";

interface VerticalPartitioningVisualProps {
  visualState: VerticalPartitioningVisualState;
  accentHex: string;
}

export default function VerticalPartitioningVisual({
  visualState,
  accentHex,
}: VerticalPartitioningVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"monolith" | "partitioned" | "page-packing">(
    visualState.viewMode || "partitioned"
  );
  const [activeQuery, setActiveQuery] = useState<"core" | "full">("core");

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
            <span>✂️</span> Vertical Partitioning (Column-Based Splitting)
          </h2>
          <p className="text-xs text-zinc-400">
            Splitting a table by columns · Hot Core Data vs Cold Bloated Attributes · 8KB Page Density
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "monolith"
                ? "btn-accent bg-orange-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("monolith")}
          >
            1. Bloated Monolith
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "partitioned"
                ? "btn-accent bg-orange-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("partitioned")}
          >
            2. Partitioned Hot/Cold
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "page-packing"
                ? "btn-accent bg-orange-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("page-packing")}
          >
            3. 8KB Page Density
          </button>
        </div>
      </div>

      {/* ── MODE 1: BLOATED MONOLITH ──────────────────────────────────────── */}
      {tabMode === "monolith" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-red-500/30 rounded-2xl p-4 flex flex-col gap-4 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="badge badge-error font-bold text-white">Bloated Monolithic Table (users)</span>
            <span className="text-red-400">Row Size: ~10,174 Bytes (10KB / row)</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {USER_TABLE_COLUMNS.map((col, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border ${
                  col.frequency === "hot"
                    ? "bg-[#18181b] border-white/10"
                    : "bg-red-950/20 border-red-500/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-200">{col.name}</span>
                  <span className={`badge badge-xs ${col.frequency === "hot" ? "badge-info" : "badge-error text-white"}`}>
                    {col.frequency.toUpperCase()}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">{col.type} · {col.sizeBytes} bytes</p>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
            ⚠️ <strong>Disk I/O Bottleneck:</strong> Even if you only query <code className="text-white">SELECT name FROM users</code>, the database storage engine must load all 10KB bloated rows from disk into memory!
          </div>
        </div>
      )}

      {/* ── MODE 2: PARTITIONED HOT VS COLD ───────────────────────────────── */}
      {tabMode === "partitioned" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hot Table */}
            <div className="p-4 rounded-xl border border-emerald-400/40 bg-[#18181b] space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="badge badge-success font-bold text-black">users_core (Hot Table)</span>
                <span className="text-emerald-400 text-[10px]">174 Bytes / row (Small &amp; Fast)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#121214] space-y-1 text-[11px] text-zinc-300 border border-white/5">
                <p>• user_id (INT PK)</p>
                <p>• name (VARCHAR 50)</p>
                <p>• email (VARCHAR 100)</p>
                <p>• role (VARCHAR 20)</p>
              </div>
              <p className="text-[10px] text-emerald-300">✓ Serves 95% of application queries with zero I/O waste.</p>
            </div>

            {/* Cold Table */}
            <div className="p-4 rounded-xl border border-blue-400/40 bg-[#18181b] space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="badge badge-info font-bold">users_profile (Cold Table)</span>
                <span className="text-blue-400 text-[10px]">10,000 Bytes / row (Heavy)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#121214] space-y-1 text-[11px] text-zinc-300 border border-white/5">
                <p>• user_id (INT PK FK)</p>
                <p>• bio_description (TEXT)</p>
                <p>• avatar_image_blob (BYTEA)</p>
              </div>
              <p className="text-[10px] text-blue-300">✓ Only queried on-demand when user views full profile.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 3: 8KB PAGE DENSITY COMPARISON ───────────────────────────── */}
      {tabMode === "page-packing" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-orange-400">8KB Disk Page Packing Density Comparison:</span>
            <span className="badge badge-xs badge-success">46x Memory Multiplier</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-red-500/30 bg-[#18181b] space-y-2">
              <span className="badge badge-xs badge-error text-white">Before (Bloated 10KB Rows)</span>
              <p className="text-zinc-200 font-bold text-sm">0.8 Rows per 8KB Page</p>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                Reading 1,000 users requires 1,250 disk page reads (10 Megabytes of RAM buffer space consumed).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-400/40 bg-[#18181b] space-y-2">
              <span className="badge badge-xs badge-success text-black font-bold">After (Compact 174B Rows)</span>
              <p className="text-emerald-400 font-bold text-sm">46 Rows per 8KB Page (57x Density!)</p>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                Reading 1,000 users requires only 22 disk page reads (174 Kilobytes of RAM buffer space consumed).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-orange-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2">
            <line x1="12" y1="2" x2="12" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <div>
            <p className="font-bold text-orange-400">Cache Buffer Efficiency:</p>
            <p className="text-zinc-300 text-[10px]">Hot table fits entirely inside server RAM for near 100% cache hits.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
          <div>
            <p className="font-bold text-blue-400">Zero Join Overhead for Core:</p>
            <p className="text-zinc-300 text-[10px]">95% of queries never join the cold profile table.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
