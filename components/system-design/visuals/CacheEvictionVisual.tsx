"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  INITIAL_CACHE_SLOTS,
  type CacheSlotItem,
  type EvictionPolicy,
  type CacheEvictionVisualState,
} from "@/lib/system-design/lessons/perf-consistency/cache-eviction";

interface CacheEvictionVisualProps {
  visualState: CacheEvictionVisualState;
  accentHex: string;
}

export default function CacheEvictionVisual({
  visualState,
  accentHex,
}: CacheEvictionVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"simulator" | "internals" | "matrix">("simulator");
  const [policy, setPolicy] = useState<EvictionPolicy>(visualState.policy || "lru");
  const [slots, setSlots] = useState<CacheSlotItem[]>(visualState.slots || INITIAL_CACHE_SLOTS);
  const [lastEvicted, setLastEvicted] = useState<string | null>(visualState.evictedKey);

  const handleAccess = (key: string) => {
    setSlots((prev) => {
      const target = prev.find((s) => s.key === key);
      if (!target) return prev;
      const updated = { ...target, accessCount: target.accessCount + 1, lastAccessSecAgo: 0 };
      const others = prev.filter((s) => s.key !== key);
      return [updated, ...others]; // Move to Head (MRU)
    });
  };

  const handlePushNew = () => {
    setSlots((prev) => {
      let toEvict: CacheSlotItem;
      if (policy === "lru") {
        toEvict = prev[prev.length - 1]; // Tail is least recently used
      } else if (policy === "lfu") {
        toEvict = [...prev].sort((a, b) => a.accessCount - b.accessCount)[0];
      } else {
        toEvict = prev[prev.length - 1];
      }

      setLastEvicted(toEvict.key);
      const remaining = prev.filter((s) => s.key !== toEvict.key);
      const newEntry: CacheSlotItem = {
        key: `user:${Math.floor(Math.random() * 80) + 50}`,
        value: "New User",
        accessCount: 1,
        lastAccessSecAgo: 0,
      };
      return [newEntry, ...remaining];
    });
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
            <span>🗑️</span> Cache Eviction Policies &amp; Memory Management
          </h2>
          <p className="text-xs text-zinc-400">
            LRU (Least Recently Used) · LFU (Least Frequently Used) · FIFO · TTL
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
            1. Eviction Simulator
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "internals"
                ? "btn-accent bg-amber-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("internals")}
          >
            2. LRU O(1) Internals
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "matrix"
                ? "btn-accent bg-amber-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("matrix")}
          >
            3. Policy Matrix
          </button>
        </div>
      </div>

      {/* ── MODE 1: EVICTION SIMULATOR ────────────────────────────────────── */}
      {tabMode === "simulator" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl font-mono text-xs">
          {/* Policy Selector & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
            <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
              {(["lru", "lfu", "fifo"] as EvictionPolicy[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPolicy(p)}
                  className={`join-item btn btn-xs font-mono ${
                    policy === p ? "btn-accent bg-amber-400 text-black font-bold" : "btn-ghost text-zinc-400"
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAccess("user:10")}
                className="btn btn-xs btn-outline btn-warning font-mono"
              >
                Access Alice (user:10)
              </button>
              <button
                onClick={handlePushNew}
                className="btn btn-xs btn-error text-white font-mono font-bold"
              >
                + Push New Key (Evict Tail)
              </button>
            </div>
          </div>

          {/* 4 Cache Slot Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <AnimatePresence>
              {slots.map((slot, idx) => {
                const isHead = idx === 0;
                const isTail = idx === slots.length - 1;
                return (
                  <motion.div
                    key={slot.key}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`p-3 rounded-xl border bg-[#161616] flex flex-col gap-2 transition-all shadow ${
                      isHead
                        ? "border-emerald-400/50 shadow-emerald-400/10 ring-1 ring-emerald-400/30"
                        : isTail
                          ? "border-red-400/40 shadow-red-400/10"
                          : "border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-100">{slot.key}</span>
                      {isHead && <span className="badge badge-xs badge-success text-black font-bold">MRU (Head)</span>}
                      {isTail && <span className="badge badge-xs badge-error text-white font-bold">Next to Evict</span>}
                    </div>
                    <div className="space-y-0.5 text-[10px] text-zinc-400">
                      <p className="text-zinc-200">{slot.value}</p>
                      <p>Accesses: <span className="text-amber-300 font-bold">{slot.accessCount}x</span></p>
                      <p>Last Read: {slot.lastAccessSecAgo}s ago</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {lastEvicted && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-between">
              <span>⚠️ Eviction Triggered: Key <strong>{lastEvicted}</strong> was evicted from memory buffer!</span>
              <span className="badge badge-xs badge-error text-white">{policy.toUpperCase()} Policy</span>
            </div>
          )}
        </div>
      )}

      {/* ── MODE 2: LRU O(1) INTERNALS ────────────────────────────────────── */}
      {tabMode === "internals" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-amber-400">LRU Cache O(1) Data Structure Internals:</span>
            <span className="badge badge-xs badge-warning">Hash Map + Doubly Linked List</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#18181b] border border-amber-400/30 space-y-2">
              <span className="badge badge-xs badge-warning font-bold">1. Hash Map (O(1) Lookups)</span>
              <p className="text-zinc-200">Maps keys directly to Linked List Node pointers.</p>
              <pre className="p-2 rounded bg-black/60 text-[10px] text-amber-300">
{`map["user:10"] ➔ Node(Alice)
map["user:20"] ➔ Node(Bob)`}
              </pre>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-emerald-400/30 space-y-2">
              <span className="badge badge-xs badge-success font-bold text-black">2. Doubly-Linked List (O(1) Moves)</span>
              <p className="text-zinc-200">Maintains order from MRU (Head) to LRU (Tail).</p>
              <pre className="p-2 rounded bg-black/60 text-[10px] text-emerald-300">
{`HEAD ⇄ [Alice] ⇄ [Charlie] ⇄ [Bob] ⇄ TAIL`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 3: POLICY MATRIX ─────────────────────────────────────────── */}
      {tabMode === "matrix" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 overflow-x-auto shadow-xl font-mono text-xs">
          <table className="table table-sm w-full">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 text-[11px]">
                <th>Policy</th>
                <th>Eviction Rule</th>
                <th>Best Use Case</th>
                <th>Drawback</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="font-bold text-amber-400">LRU</td>
                <td>Removes least recently accessed key</td>
                <td>General web apps, temporal locality</td>
                <td>Batch scans can flush hot cache</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="font-bold text-blue-400">LFU</td>
                <td>Removes least frequently accessed key</td>
                <td>Long-term popular static assets</td>
                <td>Historical hot keys linger forever</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="font-bold text-emerald-400">FIFO</td>
                <td>Removes oldest created key</td>
                <td>Simple queues, streaming buffers</td>
                <td>Ignores frequency and recency</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-amber-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <div>
            <p className="font-bold text-amber-400">LRU Temporal Locality:</p>
            <p className="text-zinc-300 text-[10px]">Data accessed recently is highly likely to be accessed again soon.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-emerald-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          </svg>
          <div>
            <p className="font-bold text-emerald-400">O(1) Time Complexity:</p>
            <p className="text-zinc-300 text-[10px]">Hash Map + Doubly-Linked List guarantees instant O(1) get and put.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
