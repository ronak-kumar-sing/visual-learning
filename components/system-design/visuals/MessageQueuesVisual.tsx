"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  QUEUE_COMPARISONS,
  type QueueEngine,
  type MessageQueuesVisualState,
} from "@/lib/system-design/lessons/reliability/message-queues";

interface MessageQueuesVisualProps {
  visualState: MessageQueuesVisualState;
  accentHex: string;
}

export default function MessageQueuesVisual({
  visualState,
  accentHex,
}: MessageQueuesVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"simulator" | "matrix" | "dlq">("simulator");
  const [engine, setEngine] = useState<QueueEngine>(visualState.selectedEngine || "kafka");
  const [queueCount, setQueueCount] = useState<number>(visualState.queueDepth || 4);
  const [processedCount, setProcessedCount] = useState<number>(142);

  const handleProduceTask = () => {
    setQueueCount((prev) => prev + 1);
  };

  const handleConsumeTask = () => {
    if (queueCount > 0) {
      setQueueCount((prev) => prev - 1);
      setProcessedCount((prev) => prev + 1);
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
            <span>📨</span> Message Queues &amp; Asynchronous Decoupling
          </h2>
          <p className="text-xs text-zinc-400">
            Producer/Consumer · Backpressure Leveling · Kafka vs RabbitMQ · Dead Letter Queues
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
            1. Queue Simulator
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "matrix"
                ? "btn-accent bg-yellow-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("matrix")}
          >
            2. Kafka vs RabbitMQ
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "dlq"
                ? "btn-accent bg-yellow-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("dlq")}
          >
            3. Dead Letter Queue
          </button>
        </div>
      </div>

      {/* ── MODE 1: QUEUE SIMULATOR ───────────────────────────────────────── */}
      {tabMode === "simulator" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-zinc-300 font-bold">Interactive Stream Controls:</span>
              <button
                onClick={handleProduceTask}
                className="btn btn-xs btn-accent bg-yellow-400 text-black font-bold font-mono"
              >
                + Produce Job (1ms)
              </button>
              <button
                onClick={handleConsumeTask}
                disabled={queueCount === 0}
                className="btn btn-xs btn-outline btn-info font-mono"
              >
                Worker: Pull &amp; Process Job ➔
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="badge badge-xs badge-ghost text-zinc-400">Queue Depth: {queueCount}</span>
              <span className="badge badge-xs badge-success text-black font-bold">Processed: {processedCount}</span>
            </div>
          </div>

          {/* 3 Main Nodes: Producer ➔ Queue Buffer ➔ Worker Pool */}
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-[#18181b] border border-white/10 rounded-xl">
            {/* Producer Node */}
            <div className="p-3.5 rounded-xl border border-white/10 bg-[#161616] flex flex-col items-center gap-1.5 min-w-[130px] text-center shadow">
              <svg width="36" height="30" viewBox="0 0 44 30" fill="none">
                <rect x="2" y="2" width="40" height="26" rx="3" fill="#18181b" stroke="#facc15" strokeWidth="1.5" />
                <circle cx="6" cy="6" r="1.5" fill="#ef4444" />
                <circle cx="10" cy="6" r="1.5" fill="#f59e0b" />
                <circle cx="14" cy="6" r="1.5" fill="#10b981" />
                <rect x="6" y="11" width="32" height="13" rx="1" fill="#09090b" />
              </svg>
              <p className="text-[11px] font-bold text-zinc-100">API Web Server</p>
              <span className="badge badge-xs badge-warning text-black font-bold">Producer (Non-Blocking)</span>
            </div>

            {/* SVG Stream 1 */}
            <div className="flex flex-col items-center">
              <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
                <motion.line
                  x1="0"
                  y1="6"
                  x2="32"
                  y2="6"
                  stroke="#facc15"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  animate={reduced ? {} : { strokeDashoffset: [0, -16] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                />
                <polygon points="32,2 40,6 32,10" fill="#facc15" />
              </svg>
              <span className="text-[8px] text-yellow-400">1ms Push</span>
            </div>

            {/* Queue Buffer Node */}
            <motion.div
              animate={{
                scale: queueCount > 0 ? 1.05 : 1,
                borderColor: queueCount > 0 ? "#facc15" : "rgba(255,255,255,0.1)",
              }}
              className="p-4 rounded-2xl border bg-[#161616] flex flex-col items-center text-center gap-2 shadow-xl shadow-yellow-400/10 min-w-[170px]"
            >
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#facc15" strokeWidth="2">
                <rect x="6" y="8" width="28" height="24" rx="4" />
                <line x1="14" y1="8" x2="14" y2="32" />
                <line x1="22" y1="8" x2="22" y2="32" />
                <line x1="30" y1="8" x2="30" y2="32" />
              </svg>
              <div>
                <p className="text-xs font-bold text-yellow-400">Queue Buffer (Kafka / SQS)</p>
                <span className="badge badge-xs badge-warning text-black font-bold mt-0.5">
                  {queueCount} In-Flight Tasks
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">Absorbs 10,000 req/s bursts</p>
            </motion.div>

            {/* SVG Stream 2 */}
            <div className="flex flex-col items-center">
              <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
                <motion.line
                  x1="0"
                  y1="6"
                  x2="32"
                  y2="6"
                  stroke="#60a5fa"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  animate={reduced ? {} : { strokeDashoffset: [0, -16] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                />
                <polygon points="32,2 40,6 32,10" fill="#60a5fa" />
              </svg>
              <span className="text-[8px] text-blue-400">Steady Pull</span>
            </div>

            {/* Consumer Worker Node */}
            <div className="p-4 rounded-2xl border border-white/10 bg-[#161616] flex flex-col items-center text-center gap-2 shadow-xl min-w-[150px]">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#60a5fa" strokeWidth="2">
                <rect x="6" y="6" width="28" height="28" rx="4" />
                <circle cx="20" cy="20" r="6" />
              </svg>
              <div>
                <p className="text-xs font-bold text-blue-400">Async Worker Pool</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Processes Heavy Video Tasks</p>
              </div>
              <span className="badge badge-xs badge-info font-bold">500 tasks/sec</span>
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 2: KAFKA VS RABBITMQ MATRIX ──────────────────────────────── */}
      {tabMode === "matrix" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 overflow-x-auto shadow-xl font-mono text-xs">
          <table className="table table-sm w-full">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 text-[11px]">
                <th>Dimension</th>
                <th>RabbitMQ (Message Broker)</th>
                <th>Apache Kafka (Event Stream)</th>
              </tr>
            </thead>
            <tbody>
              {QUEUE_COMPARISONS.map((row, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="font-bold text-zinc-200">{row.dimension}</td>
                  <td className="text-amber-400">{row.rabbitmq}</td>
                  <td className="text-yellow-400 font-bold">{row.kafka}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── MODE 3: DEAD LETTER QUEUE (DLQ) ───────────────────────────────── */}
      {tabMode === "dlq" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-yellow-400">Dead Letter Queue (DLQ) Poison Pill Isolation:</span>
            <span className="badge badge-xs badge-error text-white font-bold">Prevents Queue Freezes</span>
          </div>

          <div className="p-4 rounded-xl bg-[#18181b] border border-red-500/30 space-y-2">
            <p className="text-zinc-300 leading-relaxed text-xs">
              When a corrupted message repeatedly crashes consumer workers (a <strong>Poison Pill</strong>), an automatic retry policy diverts it after 3 failures into a dedicated <strong>Dead Letter Queue</strong>.
            </p>
            <div className="p-3 rounded-lg bg-black/60 border border-white/5 space-y-1 text-[11px]">
              <p className="text-red-400 font-bold">1. Attempt 1 Failed ➔ Requeue</p>
              <p className="text-amber-400 font-bold">2. Attempt 2 Failed ➔ Requeue with backoff</p>
              <p className="text-red-300 font-bold">3. Attempt 3 Failed ➔ Diverted to DLQ</p>
              <p className="text-emerald-300 font-bold">✓ Main queue unblocked; engineers alerted for manual payload fix.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-yellow-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <div>
            <p className="font-bold text-yellow-400">Traffic Spike Leveling:</p>
            <p className="text-zinc-300 text-[10px]">Queues absorb 100x traffic surges so backend workers never crash from overload.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <div>
            <p className="font-bold text-blue-400">Non-Blocking UX:</p>
            <p className="text-zinc-300 text-[10px]">Producers return 202 Accepted in 1ms instead of waiting for heavy 10s jobs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
