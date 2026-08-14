"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  CONSISTENCY_PATTERNS,
  type ConsistencyPatternsVisualState,
} from "@/lib/system-design/lessons/perf-consistency/consistency-patterns";

interface ConsistencyPatternsVisualProps {
  visualState: ConsistencyPatternsVisualState;
  accentHex: string;
}

export default function ConsistencyPatternsVisual({
  visualState,
  accentHex,
}: ConsistencyPatternsVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"read-after-write" | "quorum" | "spectrum">(
    "read-after-write"
  );

  // Quorum State
  const [totalNodes, setTotalNodes] = useState<number>(3);
  const [writeQuorum, setWriteQuorum] = useState<number>(2);
  const [readQuorum, setReadQuorum] = useState<number>(2);

  const isStrongQuorum = writeQuorum + readQuorum > totalNodes;

  // Simulator State
  const [userAComment, setUserAComment] = useState<string>("Hello System Design!");
  const [userBCommentSynced, setUserBCommentSynced] = useState<boolean>(false);

  const handlePublishComment = () => {
    setUserBCommentSynced(false);
    setTimeout(() => {
      setUserBCommentSynced(true);
    }, 1500);
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
            <span>🔄</span> Consistency Patterns &amp; Quorum Math
          </h2>
          <p className="text-xs text-zinc-400">
            Strong · Eventual · Causal · Read-After-Write · Quorum Formula (R + W &gt; N)
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "read-after-write"
                ? "btn-accent bg-amber-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("read-after-write")}
          >
            1. Read-Your-Writes
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "quorum"
                ? "btn-accent bg-amber-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("quorum")}
          >
            2. Quorum Math (R+W&gt;N)
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "spectrum"
                ? "btn-accent bg-amber-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("spectrum")}
          >
            3. Consistency Spectrum
          </button>
        </div>
      </div>

      {/* ── MODE 1: READ-YOUR-OWN-WRITES SIMULATOR ────────────────────────── */}
      {tabMode === "read-after-write" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-amber-400">Read-Your-Own-Writes Pattern Simulator:</span>
            <button
              onClick={handlePublishComment}
              className="btn btn-xs btn-accent bg-amber-400 text-black font-bold font-mono"
            >
              User A: Post Comment ➔
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User A Box (Author) */}
            <div className="p-4 rounded-xl border border-emerald-400/40 bg-[#161616] space-y-2 shadow">
              <div className="flex items-center justify-between">
                <span className="badge badge-success text-black font-bold">User A (Author)</span>
                <span className="text-emerald-400 text-[10px]">Routed to Primary Leader</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#121214] border border-white/5 space-y-1">
                <p className="text-zinc-400 text-[10px]">Feed View (Instant 1ms):</p>
                <p className="text-emerald-300 font-bold">&quot;{userAComment}&quot;</p>
              </div>
              <p className="text-[10px] text-emerald-400">✓ Author always sees their own write instantly!</p>
            </div>

            {/* User B Box (Follower) */}
            <div className="p-4 rounded-xl border border-blue-400/40 bg-[#161616] space-y-2 shadow">
              <div className="flex items-center justify-between">
                <span className="badge badge-info font-bold">User B (Other Viewer)</span>
                <span className="text-blue-400 text-[10px]">Reading from Asynchronous Replica</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#121214] border border-white/5 space-y-1">
                <p className="text-zinc-400 text-[10px]">Feed View (After Replication Sync):</p>
                <p className={userBCommentSynced ? "text-blue-300 font-bold" : "text-zinc-500 italic"}>
                  {userBCommentSynced ? `"${userAComment}"` : "Waiting for async replication stream..."}
                </p>
              </div>
              <p className="text-[10px] text-zinc-400">
                {userBCommentSynced ? "✓ Replica updated in 1500ms" : "⏳ Lagging behind by ~1.5s"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 2: QUORUM MATH ANALYZER ─────────────────────────────────── */}
      {tabMode === "quorum" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-amber-400">Quorum Consensus Formula: R + W &gt; N</span>
            <span className={`badge badge-sm font-bold ${isStrongQuorum ? "badge-success text-black" : "badge-warning text-black"}`}>
              {isStrongQuorum ? "Strong Consistency Guaranteed ✓" : "Eventual Consistency (Stale Risk)"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-[#18181b] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Total Replicas (N):</span>
                <span className="text-amber-400 font-bold text-sm">{totalNodes}</span>
              </div>
              <div className="join w-full">
                {[3, 5, 7].map((n) => (
                  <button
                    key={n}
                    onClick={() => setTotalNodes(n)}
                    className={`join-item flex-1 btn btn-xs ${totalNodes === n ? "btn-accent bg-amber-400 text-black font-bold" : "btn-ghost text-zinc-400"}`}
                  >
                    N={n}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Write Quorum (W):</span>
                <span className="text-blue-400 font-bold text-sm">{writeQuorum}</span>
              </div>
              <div className="join w-full">
                {[1, 2, 3].map((w) => (
                  <button
                    key={w}
                    onClick={() => setWriteQuorum(w)}
                    className={`join-item flex-1 btn btn-xs ${writeQuorum === w ? "btn-accent bg-blue-400 text-black font-bold" : "btn-ghost text-zinc-400"}`}
                  >
                    W={w}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Read Quorum (R):</span>
                <span className="text-emerald-400 font-bold text-sm">{readQuorum}</span>
              </div>
              <div className="join w-full">
                {[1, 2, 3].map((r) => (
                  <button
                    key={r}
                    onClick={() => setReadQuorum(r)}
                    className={`join-item flex-1 btn btn-xs ${readQuorum === r ? "btn-accent bg-emerald-400 text-black font-bold" : "btn-ghost text-zinc-400"}`}
                  >
                    R={r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#161616] border border-amber-400/20 text-xs">
            <p className="text-zinc-200">
              Formula Check: <code className="text-amber-400 font-bold">W({writeQuorum}) + R({readQuorum}) = {writeQuorum + readQuorum}</code> vs <code className="text-blue-400 font-bold">N({totalNodes})</code>
            </p>
            <p className="text-zinc-400 text-[11px] mt-1 leading-relaxed">
              {isStrongQuorum
                ? "✓ Because R + W > N, the read quorum and write quorum are mathematically guaranteed to overlap on at least 1 up-to-date node!"
                : "⚠️ Because R + W <= N, a read request may query nodes that missed the latest write, resulting in stale data."}
            </p>
          </div>
        </div>
      )}

      {/* ── MODE 3: SPECTRUM MATRIX ───────────────────────────────────────── */}
      {tabMode === "spectrum" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 overflow-x-auto shadow-xl font-mono text-xs">
          <table className="table table-sm w-full">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 text-[11px]">
                <th>Consistency Model</th>
                <th>Latency</th>
                <th>Guarantee</th>
                <th>Example Use Case</th>
              </tr>
            </thead>
            <tbody>
              {CONSISTENCY_PATTERNS.map((item) => (
                <tr key={item.id} className="border-b border-white/5">
                  <td className="font-bold text-amber-400">{item.name}</td>
                  <td>{item.latencyLevel}</td>
                  <td className="text-zinc-300 text-[10px]">{item.guarantee}</td>
                  <td className="text-zinc-400 text-[10px]">{item.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-amber-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <div>
            <p className="font-bold text-amber-400">Quorum Overlap Rule:</p>
            <p className="text-zinc-300 text-[10px]">R + W &gt; N ensures strong consistency in Cassandra and DynamoDB.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <div>
            <p className="font-bold text-blue-400">Read-Your-Writes UX:</p>
            <p className="text-zinc-300 text-[10px]">Prevents user confusion when submitting form or profile updates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
