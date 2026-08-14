"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  SAMPLE_BTREE_NODES,
  type IndexingVisualState,
} from "@/lib/system-design/lessons/db-internals/indexing";

interface IndexingVisualProps {
  visualState: IndexingVisualState;
  accentHex: string;
}

export default function IndexingVisual({
  visualState,
  accentHex,
}: IndexingVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"btree" | "scan" | "hash-compare">(
    visualState.lookupMode === "full-scan" ? "scan" : "btree"
  );
  const [selectedTarget, setSelectedTarget] = useState<number>(visualState.targetId || 70);

  // Compute active path nodes based on target ID
  const getActivePath = (id: number): string[] => {
    if (id <= 25) return ["root", "int-left", "leaf-1"];
    if (id <= 50) return ["root", "int-left", "leaf-2"];
    if (id <= 75) return ["root", "int-right", "leaf-3"];
    return ["root", "int-right", "leaf-4"];
  };

  const activePath = getActivePath(selectedTarget);

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
            <span>🌳</span> Database Indexing &amp; B-Tree Traversal
          </h2>
          <p className="text-xs text-zinc-400">
            Trading write overhead for O(log n) search performance · B-Tree vs Hash Index
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "btree"
                ? "btn-accent bg-orange-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("btree")}
          >
            1. B-Tree Seek
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "scan"
                ? "btn-accent bg-orange-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("scan")}
          >
            2. Full Table Scan
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "hash-compare"
                ? "btn-accent bg-orange-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("hash-compare")}
          >
            3. B-Tree vs Hash
          </button>
        </div>
      </div>

      {/* ── MODE 1: B-TREE INDEX SEEK TRAVERSAL ───────────────────────────── */}
      {tabMode === "btree" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
          {/* Target Selector Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
            <span className="font-mono text-xs text-zinc-300 font-bold">
              Select Record to Query: <code className="text-orange-400">SELECT * FROM users WHERE id = {selectedTarget}</code>
            </span>
            <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
              {[20, 40, 70, 90].map((id) => (
                <button
                  key={id}
                  onClick={() => setSelectedTarget(id)}
                  className={`join-item btn btn-xs font-mono ${
                    selectedTarget === id
                      ? "btn-accent bg-orange-400 text-black font-bold"
                      : "btn-ghost text-zinc-400"
                  }`}
                >
                  id = {id}
                </button>
              ))}
            </div>
          </div>

          {/* B-Tree Graph Stage */}
          <div className="relative flex flex-col items-center gap-4 p-4 bg-[#18181b] border border-white/10 rounded-xl">
            {/* Level 1: Root Node */}
            <motion.div
              animate={{
                scale: activePath.includes("root") ? 1.05 : 1,
                borderColor: activePath.includes("root") ? "#fb923c" : "rgba(255,255,255,0.1)",
              }}
              className="px-4 py-2 rounded-xl border bg-[#161616] font-mono text-xs flex items-center gap-2 shadow-lg"
            >
              <span className="text-zinc-400 text-[10px]">Root Page:</span>
              <span className="badge badge-xs badge-warning font-bold">[ 50 ]</span>
            </motion.div>

            {/* Tree Branch Line SVG */}
            <svg width="240" height="20" viewBox="0 0 240 20" fill="none">
              <line x1="120" y1="0" x2="60" y2="20" stroke={activePath.includes("int-left") ? "#fb923c" : "#52525b"} strokeWidth="2" strokeDasharray="3 3" />
              <line x1="120" y1="0" x2="180" y2="20" stroke={activePath.includes("int-right") ? "#fb923c" : "#52525b"} strokeWidth="2" strokeDasharray="3 3" />
            </svg>

            {/* Level 2: Internal Nodes */}
            <div className="flex items-center justify-center gap-16 w-full">
              <motion.div
                animate={{
                  scale: activePath.includes("int-left") ? 1.05 : 1,
                  borderColor: activePath.includes("int-left") ? "#fb923c" : "rgba(255,255,255,0.1)",
                }}
                className="px-3.5 py-1.5 rounded-xl border bg-[#161616] font-mono text-xs flex items-center gap-2 shadow"
              >
                <span className="text-zinc-400 text-[10px]">Internal:</span>
                <span className="badge badge-xs badge-info font-bold">[ &lt; 25 ]</span>
              </motion.div>

              <motion.div
                animate={{
                  scale: activePath.includes("int-right") ? 1.05 : 1,
                  borderColor: activePath.includes("int-right") ? "#fb923c" : "rgba(255,255,255,0.1)",
                }}
                className="px-3.5 py-1.5 rounded-xl border bg-[#161616] font-mono text-xs flex items-center gap-2 shadow"
              >
                <span className="text-zinc-400 text-[10px]">Internal:</span>
                <span className="badge badge-xs badge-info font-bold">[ &gt; 50, &lt; 75 ]</span>
              </motion.div>
            </div>

            {/* Level 3: Leaf Nodes (Data Rows) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 w-full mt-2">
              {[
                { id: "leaf-1", label: "Leaf 1", keys: "10, 20 (Alice, Bob)" },
                { id: "leaf-2", label: "Leaf 2", keys: "30, 40 (Charlie, David)" },
                { id: "leaf-3", label: "Leaf 3", keys: "60, 70 (Emma, Frank)" },
                { id: "leaf-4", label: "Leaf 4", keys: "80, 90 (Grace, Hank)" },
              ].map((leaf) => {
                const isActive = activePath.includes(leaf.id);
                return (
                  <motion.div
                    key={leaf.id}
                    animate={{
                      scale: isActive ? 1.04 : 1,
                      borderColor: isActive ? "#34d399" : "rgba(255,255,255,0.1)",
                    }}
                    className={`p-2.5 rounded-xl border bg-[#161616] font-mono text-xs flex flex-col gap-1 transition-all ${
                      isActive ? "ring-2 ring-emerald-400/30 shadow-lg shadow-emerald-400/10" : "opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400">{leaf.label}</span>
                      {isActive && <span className="badge badge-xs badge-success font-bold text-black">Target Found ✓</span>}
                    </div>
                    <span className="text-emerald-300 text-[10px]">{leaf.keys}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#161616] border border-orange-400/20 font-mono text-xs flex items-center justify-between">
            <span className="text-zinc-400 text-[11px]">Pages Read in Tree Traversal:</span>
            <span className="text-emerald-400 font-bold text-xs bg-black/60 px-3 py-1 rounded border border-white/5">
              3 Page Reads (0.8 ms) vs 1,000,000 in Full Scan!
            </span>
          </div>
        </div>
      )}

      {/* ── MODE 2: FULL TABLE SCAN ───────────────────────────────────────── */}
      {tabMode === "scan" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-red-500/30 rounded-2xl p-4 flex flex-col gap-4 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="badge badge-error font-bold text-white">Full Table Scan (Sequential O(N) I/O)</span>
            <span className="text-red-400">Scanning 1,000,000 disk pages sequentially</span>
          </div>

          <div className="p-4 rounded-xl bg-[#18181b] border border-red-500/20 space-y-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-300">Disk I/O Head Travel Progress:</span>
              <span className="text-red-400 font-bold">100% Scan (450 ms)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#09090b] border border-white/5 overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5 }}
                className="h-full rounded-full bg-gradient-to-r from-red-600 to-amber-500"
              />
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Without an index, the database storage engine must load every raw 8KB table block from disk into the RAM buffer pool, burning CPU cycles and saturating disk throughput.
            </p>
          </div>
        </div>
      )}

      {/* ── MODE 3: B-TREE VS HASH INDEX ──────────────────────────────────── */}
      {tabMode === "hash-compare" && (
        <div className="z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="bg-[#121214] border border-orange-400/30 rounded-2xl p-4 space-y-3 shadow-lg">
            <span className="badge badge-warning font-bold">B-Tree Index (Default in RDBMS)</span>
            <div className="space-y-1.5 text-[11px] text-zinc-300">
              <p>⚡ <strong>Time Complexity:</strong> $O(\log N)$ logarithmic seek.</p>
              <p>🎯 <strong>Range Queries:</strong> Supported natively (<code className="text-orange-300">WHERE age BETWEEN 20 AND 30</code>).</p>
              <p>📊 <strong>Sorting:</strong> Supports <code className="text-orange-300">ORDER BY</code> without file-sort.</p>
            </div>
          </div>

          <div className="bg-[#121214] border border-blue-400/30 rounded-2xl p-4 space-y-3 shadow-lg">
            <span className="badge badge-info font-bold">Hash Index (Exact Match)</span>
            <div className="space-y-1.5 text-[11px] text-zinc-300">
              <p>⚡ <strong>Time Complexity:</strong> $O(1)$ constant time lookup.</p>
              <p>❌ <strong>Range Queries:</strong> NOT supported (hashes destroy natural ordering).</p>
              <p>🎯 <strong>Best For:</strong> Pure key-value lookups (<code className="text-blue-300">WHERE session_token = 'xyz'</code>).</p>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-orange-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2">
            <polygon points="12 2 2 22 22 22" />
          </svg>
          <div>
            <p className="font-bold text-orange-400">Logarithmic Speed:</p>
            <p className="text-zinc-300 text-[10px]">B-Tree finds any record in 3-4 page reads across 10,000,000 rows.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-red-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-bold text-red-400">Write Penalty Overhead:</p>
            <p className="text-zinc-300 text-[10px]">Over-indexing degrades INSERT/UPDATE speed due to tree rebalancing.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
