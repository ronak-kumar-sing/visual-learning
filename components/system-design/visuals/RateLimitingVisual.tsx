"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  RATE_LIMIT_ALGORITHMS,
  type RateLimitAlgorithm,
  type RateLimitingVisualState,
} from "@/lib/system-design/lessons/reliability/rate-limiting";

interface RateLimitingVisualProps {
  visualState: RateLimitingVisualState;
  accentHex: string;
}

export default function RateLimitingVisual({
  visualState,
  accentHex,
}: RateLimitingVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"simulator" | "matrix" | "headers">("simulator");
  const [tokens, setTokens] = useState<number>(visualState.currentTokens ?? 4);
  const [capacity] = useState<number>(5);
  const [lastStatus, setLastStatus] = useState<"allowed" | "blocked" | null>(null);

  // Auto-refill 1 token every 2.5s up to capacity
  useEffect(() => {
    const timer = setInterval(() => {
      setTokens((prev) => Math.min(capacity, prev + 1));
    }, 2500);
    return () => clearInterval(timer);
  }, [capacity]);

  const handleSendRequest = () => {
    if (tokens >= 1) {
      setTokens((prev) => prev - 1);
      setLastStatus("allowed");
    } else {
      setLastStatus("blocked");
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
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-yellow-400/30 rounded-2xl px-5 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-yellow-400 font-mono tracking-wide flex items-center gap-2">
            <span>🛡️</span> Rate Limiting Algorithms &amp; Traffic Throttling
          </h2>
          <p className="text-xs text-zinc-400">
            Token Bucket · Leaky Bucket · Sliding Window · HTTP 429 Too Many Requests
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "simulator"
                ? "btn-accent bg-yellow-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("simulator")}
          >
            1. Token Bucket Simulator
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "matrix"
                ? "btn-accent bg-yellow-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("matrix")}
          >
            2. 4 Algorithms Matrix
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "headers"
                ? "btn-accent bg-yellow-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("headers")}
          >
            3. HTTP 429 Headers
          </button>
        </div>
      </div>

      {/* ── MODE 1: TOKEN BUCKET SIMULATOR ────────────────────────────────── */}
      {tabMode === "simulator" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSendRequest}
                className="btn btn-xs btn-accent bg-yellow-400 text-black font-bold font-mono"
              >
                Send Request (Consume 1 Token) ➔
              </button>
              <button
                onClick={() => setTokens((prev) => Math.min(capacity, prev + 1))}
                className="btn btn-xs btn-outline btn-success font-mono"
              >
                + Refill 1 Token
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-300">Tokens:</span>
              <span className="badge badge-sm badge-warning text-black font-bold font-mono">
                {tokens} / {capacity}
              </span>
            </div>
          </div>

          {/* Bucket Visual Stage */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-[#18181b] border border-white/10 rounded-xl">
            {/* Client Device Node */}
            <div className="p-3.5 rounded-xl border border-white/10 bg-[#161616] flex flex-col items-center gap-1.5 min-w-[130px] text-center shadow">
              <svg width="36" height="30" viewBox="0 0 44 30" fill="none">
                <rect x="2" y="2" width="40" height="26" rx="3" fill="#18181b" stroke="#facc15" strokeWidth="1.5" />
                <circle cx="6" cy="6" r="1.5" fill="#ef4444" />
                <circle cx="10" cy="6" r="1.5" fill="#f59e0b" />
                <circle cx="14" cy="6" r="1.5" fill="#10b981" />
                <rect x="6" y="11" width="32" height="13" rx="1" fill="#09090b" />
              </svg>
              <p className="text-[11px] font-bold text-zinc-100">Client IP</p>
              <span className="badge badge-xs badge-ghost text-zinc-400">192.168.1.50</span>
            </div>

            {/* Token Bucket Container */}
            <div className="p-4 rounded-2xl border border-yellow-400/40 bg-[#161616] flex flex-col items-center text-center gap-2 shadow-xl shadow-yellow-400/10 min-w-[200px]">
              <div className="flex items-center gap-1">
                {Array.from({ length: capacity }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: i < tokens ? 1 : 0.7, opacity: i < tokens ? 1 : 0.2 }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      i < tokens ? "bg-yellow-400 text-black shadow-md shadow-yellow-400/30" : "bg-zinc-700 text-zinc-500"
                    }`}
                  >
                    ⚡
                  </motion.div>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-yellow-400">Token Bucket (Redis)</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Refills +1 token every 2.5s</p>
              </div>
            </div>

            {/* Backend Protected Service */}
            <div className="p-4 rounded-2xl border border-white/10 bg-[#161616] flex flex-col items-center text-center gap-2 shadow-xl min-w-[150px]">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#60a5fa" strokeWidth="2">
                <rect x="6" y="6" width="28" height="28" rx="4" />
                <circle cx="20" cy="20" r="6" />
              </svg>
              <div>
                <p className="text-xs font-bold text-blue-400">Protected Backend</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Database / CPU Safe</p>
              </div>
              <span className="badge badge-xs badge-info font-bold">100% Protected</span>
            </div>
          </div>

          {/* Status Alert */}
          {lastStatus && (
            <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
              lastStatus === "allowed"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}>
              <span>
                {lastStatus === "allowed"
                  ? "✓ HTTP 200 OK — Request allowed. Token consumed from Redis bucket."
                  : "⛔ HTTP 429 Too Many Requests — Bucket exhausted! Request throttled."}
              </span>
              <span className="badge badge-xs font-bold">
                {lastStatus === "allowed" ? "Allowed" : "Blocked (429)"}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── MODE 2: 4 ALGORITHMS MATRIX ───────────────────────────────────── */}
      {tabMode === "matrix" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 overflow-x-auto shadow-xl font-mono text-xs">
          <table className="table table-sm w-full">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 text-[11px]">
                <th>Algorithm</th>
                <th>Mechanism</th>
                <th>Burst Handling</th>
                <th>Memory Overhead</th>
              </tr>
            </thead>
            <tbody>
              {RATE_LIMIT_ALGORITHMS.map((algo) => (
                <tr key={algo.id} className="border-b border-white/5">
                  <td className="font-bold text-yellow-400">{algo.name}</td>
                  <td className="text-zinc-300 text-[10px]">{algo.mechanism}</td>
                  <td className="text-zinc-200 text-[10px]">{algo.burstHandling}</td>
                  <td className="text-zinc-400 text-[10px]">{algo.memoryUsage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── MODE 3: HTTP 429 HEADERS INSPECTOR ────────────────────────────── */}
      {tabMode === "headers" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-yellow-400">Standard RFC Rate Limit Response Headers:</span>
            <span className="badge badge-xs badge-warning text-black font-bold">IETF Draft</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#18181b] border border-blue-400/30 space-y-1.5">
              <span className="badge badge-xs badge-info font-bold">X-RateLimit-Limit</span>
              <p className="text-zinc-200 font-bold">100</p>
              <p className="text-[10px] text-zinc-400">Maximum allowed requests permitted in the sliding time window.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-yellow-400/30 space-y-1.5">
              <span className="badge badge-xs badge-warning text-black font-bold">X-RateLimit-Remaining</span>
              <p className="text-yellow-300 font-bold">0</p>
              <p className="text-[10px] text-zinc-400">Remaining token count before the client is throttled.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-red-400/30 space-y-1.5">
              <span className="badge badge-xs badge-error text-white font-bold">Retry-After</span>
              <p className="text-red-300 font-bold">30 (Seconds)</p>
              <p className="text-[10px] text-zinc-400">Seconds the client must wait before making another attempt.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-yellow-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <div>
            <p className="font-bold text-yellow-400">Token Bucket Burst Advantage:</p>
            <p className="text-zinc-300 text-[10px]">Allows legitimate users to burst a few quick requests without false-positive 429s.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          </svg>
          <div>
            <p className="font-bold text-blue-400">Distributed Redis State:</p>
            <p className="text-zinc-300 text-[10px]">Redis in-memory counters ensure consistent rate limits across all gateway instances.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
