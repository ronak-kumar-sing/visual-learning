"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  HTTP_IDEMPOTENCY_MATRIX,
  type IdempotencyVisualState,
} from "@/lib/system-design/lessons/reliability/idempotency";

interface IdempotencyVisualProps {
  visualState: IdempotencyVisualState;
  accentHex: string;
}

export default function IdempotencyVisual({
  visualState,
  accentHex,
}: IdempotencyVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"simulator" | "methods" | "state-machine">("simulator");
  const [attempts, setAttempts] = useState<number>(1);
  const [totalCharged, setTotalCharged] = useState<number>(149);
  const [statusMessage, setStatusMessage] = useState<string>(
    "Attempt 1: Card charged $149.00 USD. Response receipt cached in Redis."
  );

  const handleSimulateFirstAttempt = () => {
    setAttempts(1);
    setTotalCharged(149);
    setStatusMessage("Attempt 1: Card charged $149.00 USD. Response receipt cached in Redis.");
  };

  const handleSimulateDuplicateRetry = () => {
    setAttempts((prev) => prev + 1);
    // Total charged NEVER increases!
    setStatusMessage(
      `Attempt ${attempts + 1}: Duplicate Idempotency-Key detected! Replayed cached receipt from Redis. Total charged remains exactly $149.00 (Zero double charge ✓).`
    );
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
            <span>🔒</span> Idempotency &amp; Safe API Retries
          </h2>
          <p className="text-xs text-zinc-400">
            f(f(x)) = f(x) · Idempotency-Key Header · Double-Charge Prevention · Redis Locks
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
            1. Double-Charge Simulator
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "methods"
                ? "btn-accent bg-yellow-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("methods")}
          >
            2. HTTP Verbs Matrix
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "state-machine"
                ? "btn-accent bg-yellow-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("state-machine")}
          >
            3. Redis State Machine
          </button>
        </div>
      </div>

      {/* ── MODE 1: DOUBLE CHARGE SIMULATOR ───────────────────────────────── */}
      {tabMode === "simulator" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSimulateFirstAttempt}
                className="btn btn-xs btn-accent bg-yellow-400 text-black font-bold font-mono"
              >
                1. Initial Pay $149 ➔
              </button>
              <button
                onClick={handleSimulateDuplicateRetry}
                className="btn btn-xs btn-outline btn-warning font-mono"
              >
                2. Accidentally Retry / Double-Click!
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Total Billed:</span>
              <span className="badge badge-sm badge-success text-black font-bold font-mono">
                ${totalCharged}.00 USD
              </span>
              <span className="badge badge-xs badge-ghost">Attempts: {attempts}</span>
            </div>
          </div>

          {/* 3 Main Nodes: Client ➔ Idempotency Guard (Redis) ➔ Bank Gateway */}
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-[#18181b] border border-white/10 rounded-xl">
            {/* Client Device Node */}
            <div className="p-3.5 rounded-xl border border-white/10 bg-[#161616] flex flex-col items-center gap-1.5 min-w-[130px] text-center shadow">
              <svg width="36" height="30" viewBox="0 0 44 30" fill="none">
                <rect x="2" y="2" width="40" height="26" rx="3" fill="#18181b" stroke="#facc15" strokeWidth="1.5" />
                <circle cx="6" cy="6" r="1.5" fill="#ef4444" />
                <circle cx="10" cy="6" r="1.5" fill="#f59e0b" />
                <circle cx="14" cy="6" r="1.5" fill="#10b981" />
                <rect x="6" y="11" width="32" height="13" rx="1" fill="#09090b" />
              </svg>
              <p className="text-[11px] font-bold text-zinc-100">Client Checkout</p>
              <span className="badge badge-xs badge-warning text-black font-bold">Idempotency-Key: uuid-9b1d</span>
            </div>

            {/* Middle: Redis Idempotency Guard */}
            <motion.div
              animate={{
                scale: attempts > 1 ? 1.05 : 1,
                borderColor: "#facc15",
              }}
              className="p-4 rounded-2xl border bg-[#161616] flex flex-col items-center text-center gap-2 shadow-xl shadow-yellow-400/10 min-w-[190px]"
            >
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#facc15" strokeWidth="2">
                <rect x="6" y="8" width="28" height="24" rx="4" />
                <line x1="6" y1="16" x2="34" y2="16" />
                <circle cx="12" cy="12" r="1.5" fill="#facc15" />
              </svg>
              <div>
                <p className="text-xs font-bold text-yellow-400">Redis Idempotency Store</p>
                <span className={`badge badge-xs font-bold mt-0.5 ${attempts > 1 ? "badge-info" : "badge-success text-black"}`}>
                  {attempts > 1 ? "Cache Replay (0ms Bank Hit)" : "SETNX Key Created ✓"}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">TTL: 86400s (24 Hours)</p>
            </motion.div>

            {/* Bank Gateway Node */}
            <div className="p-4 rounded-2xl border border-white/10 bg-[#161616] flex flex-col items-center text-center gap-2 shadow-xl min-w-[150px]">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#60a5fa" strokeWidth="2">
                <rect x="4" y="8" width="32" height="24" rx="4" />
                <line x1="4" y1="16" x2="36" y2="16" />
              </svg>
              <div>
                <p className="text-xs font-bold text-blue-400">Visa / Stripe Gateway</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Physical Bank Charge</p>
              </div>
              <span className="badge badge-xs badge-success text-black font-bold">Charged Exactly 1x</span>
            </div>
          </div>

          {/* Status Output */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
            <span>{statusMessage}</span>
            <span className="badge badge-xs badge-success text-black font-bold font-mono">100% Idempotent</span>
          </div>
        </div>
      )}

      {/* ── MODE 2: HTTP VERBS MATRIX ─────────────────────────────────────── */}
      {tabMode === "methods" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 overflow-x-auto shadow-xl font-mono text-xs">
          <table className="table table-sm w-full">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 text-[11px]">
                <th>HTTP Method</th>
                <th>Idempotent?</th>
                <th>Safe (Read-Only)?</th>
                <th>Specification Rule</th>
              </tr>
            </thead>
            <tbody>
              {HTTP_IDEMPOTENCY_MATRIX.map((m) => (
                <tr key={m.method} className="border-b border-white/5">
                  <td className="font-bold text-yellow-400">{m.method}</td>
                  <td>
                    <span className={`badge badge-xs font-bold ${m.isIdempotent ? "badge-success text-black" : "badge-error text-white"}`}>
                      {m.isIdempotent ? "YES ✓" : "NO ❌"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-xs ${m.isSafe ? "badge-info" : "badge-ghost text-zinc-500"}`}>
                      {m.isSafe ? "Safe" : "Modifies State"}
                    </span>
                  </td>
                  <td className="text-zinc-300 text-[10px]">{m.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── MODE 3: REDIS STATE MACHINE ───────────────────────────────────── */}
      {tabMode === "state-machine" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-yellow-400">Idempotency Key Lifecycle &amp; State Transitions:</span>
            <span className="badge badge-xs badge-warning text-black font-bold">Distributed Mutex Lock</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#18181b] border border-blue-400/30 space-y-1.5">
              <span className="badge badge-xs badge-info font-bold">1. PROCESSING (Lock)</span>
              <p className="text-zinc-200 text-xs">SETNX idempotency_key &quot;PROCESSING&quot; EX 120</p>
              <p className="text-[10px] text-zinc-400">Concurrent duplicates receive HTTP 409 Conflict.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-emerald-400/30 space-y-1.5">
              <span className="badge badge-xs badge-success text-black font-bold">2. COMPLETED (Cache)</span>
              <p className="text-zinc-200 text-xs">SET idempotency_result JSON EX 86400</p>
              <p className="text-[10px] text-zinc-400">Subsequent retries replay the cached response directly.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-red-400/30 space-y-1.5">
              <span className="badge badge-xs badge-error text-white font-bold">3. FAILED (Release)</span>
              <p className="text-zinc-200 text-xs">DEL idempotency_key</p>
              <p className="text-[10px] text-zinc-400">On unrecoverable error, key is freed so client can retry cleanly.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-yellow-400/30 p-2.5 rounded-lg flex items-center gap-2.5 text-xs font-mono">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <div>
          <p className="font-bold text-yellow-400">Financial Integrity Guarantee:</p>
          <p className="text-zinc-300 text-[10px]">Idempotency keys ensure 100 retry requests result in exactly ONE bank charge.</p>
        </div>
      </div>
    </div>
  );
}
