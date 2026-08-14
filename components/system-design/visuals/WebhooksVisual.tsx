"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  SAMPLE_WEBHOOK_EVENT,
  type WebhooksVisualState,
} from "@/lib/system-design/lessons/realtime/webhooks";

interface WebhooksVisualProps {
  visualState: WebhooksVisualState;
  accentHex: string;
}

export default function WebhooksVisual({
  visualState,
  accentHex,
}: WebhooksVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"simulator" | "hmac" | "retries">("simulator");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);

  const handleTriggerWebhook = () => {
    setIsSimulating(true);
    setCurrentStep(1);
    setIsDuplicate(false);

    setTimeout(() => {
      setCurrentStep(2); // HMAC Verified
      setTimeout(() => {
        setCurrentStep(3); // Idempotency check in Redis
        setTimeout(() => {
          setCurrentStep(4); // Async ACK 200 OK
          setIsSimulating(false);
        }, 800);
      }, 800);
    }, 700);
  };

  const handleTriggerDuplicate = () => {
    setIsSimulating(true);
    setCurrentStep(1);
    setIsDuplicate(true);

    setTimeout(() => {
      setCurrentStep(2);
      setTimeout(() => {
        setCurrentStep(3); // Redis Duplicate Found
        setIsSimulating(false);
      }, 800);
    }, 700);
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
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-green-400/30 rounded-2xl px-5 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-green-400 font-mono tracking-wide flex items-center gap-2">
            <span>🪝</span> Webhooks (Event-Driven Reverse APIs)
          </h2>
          <p className="text-xs text-zinc-400">
            HMAC Signatures · Idempotency Locks · Async Queue Offload · Exponential Backoff
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "simulator"
                ? "btn-accent bg-green-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("simulator")}
          >
            1. Webhook Pipeline
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "hmac"
                ? "btn-accent bg-green-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("hmac")}
          >
            2. HMAC Security
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "retries"
                ? "btn-accent bg-green-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("retries")}
          >
            3. Retry Backoff
          </button>
        </div>
      </div>

      {/* ── MODE 1: WEBHOOK PIPELINE SIMULATOR ────────────────────────────── */}
      {tabMode === "simulator" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
            <span className="text-zinc-300 font-bold">Simulate Webhook Delivery:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerWebhook}
                disabled={isSimulating}
                className="btn btn-xs btn-accent bg-green-400 text-black font-bold font-mono"
              >
                Emit Stripe Event ($149) ➔
              </button>
              <button
                onClick={handleTriggerDuplicate}
                disabled={isSimulating}
                className="btn btn-xs btn-outline btn-warning font-mono"
              >
                Test Duplicate Retry (Idempotent)
              </button>
            </div>
          </div>

          {/* Diagram Nodes: Stripe ➔ Webhook Gateway ➔ Redis / Queue */}
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-[#18181b] border border-white/10 rounded-xl">
            {/* Emitter Node (Stripe) */}
            <div className="p-3.5 rounded-xl border border-white/10 bg-[#161616] flex flex-col items-center gap-1.5 min-w-[130px] text-center shadow">
              <svg width="36" height="30" viewBox="0 0 44 30" fill="none">
                <rect x="2" y="2" width="40" height="26" rx="3" fill="#18181b" stroke="#60a5fa" strokeWidth="1.5" />
                <path d="M12 15h20M12 20h12" stroke="#60a5fa" strokeWidth="1.5" />
              </svg>
              <p className="text-[11px] font-bold text-blue-400">Stripe Billing</p>
              <span className="badge badge-xs badge-info">payment_intent.succeeded</span>
            </div>

            {/* SVG Stream 1 */}
            <div className="flex flex-col items-center">
              <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
                <motion.line
                  x1="0"
                  y1="6"
                  x2="32"
                  y2="6"
                  stroke="#4ade80"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  animate={reduced ? {} : { strokeDashoffset: [0, -16] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                />
                <polygon points="32,2 40,6 32,10" fill="#4ade80" />
              </svg>
              <span className="text-[8px] text-zinc-400">HTTP POST</span>
            </div>

            {/* Gateway Consumer Node */}
            <motion.div
              animate={{
                scale: currentStep >= 2 ? 1.05 : 1,
                borderColor: currentStep >= 2 ? "#4ade80" : "rgba(255,255,255,0.1)",
              }}
              className="p-4 rounded-2xl border bg-[#161616] flex flex-col items-center text-center gap-2 shadow-xl shadow-green-400/10 min-w-[170px]"
            >
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#4ade80" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <div>
                <p className="text-xs font-bold text-green-400">Webhook Receiver</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">HMAC-SHA256 Verified ✓</p>
              </div>
              <span className="badge badge-xs badge-success text-black font-bold">Fast ACK 200 OK (&lt;50ms)</span>
            </motion.div>

            {/* SVG Stream 2 */}
            <div className="flex flex-col items-center">
              <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
                <motion.line
                  x1="0"
                  y1="6"
                  x2="32"
                  y2="6"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  animate={reduced ? {} : { strokeDashoffset: [0, -16] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                />
                <polygon points="32,2 40,6 32,10" fill="#fbbf24" />
              </svg>
              <span className="text-[8px] text-amber-400">Queue Task</span>
            </div>

            {/* Background Worker Queue Node */}
            <div className="p-4 rounded-2xl border border-white/10 bg-[#161616] flex flex-col items-center text-center gap-2 shadow-xl min-w-[150px]">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#fbbf24" strokeWidth="2">
                <rect x="6" y="8" width="28" height="24" rx="4" />
                <path d="M6 16h28M6 24h28" />
              </svg>
              <div>
                <p className="text-xs font-bold text-amber-400">Async Message Queue</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Redis / SQS Worker</p>
              </div>
              {isDuplicate ? (
                <span className="badge badge-xs badge-warning text-black font-bold">Duplicate Ignored</span>
              ) : (
                <span className="badge badge-xs badge-info font-bold">Order Fulfilled</span>
              )}
            </div>
          </div>

          {/* 4 Pipeline Stages Indicator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {[
              { num: 1, title: "1. Event Triggered", desc: "Stripe issues HTTP POST with payload" },
              { num: 2, title: "2. HMAC Verified", desc: "Checks Stripe-Signature header" },
              { num: 3, title: "3. Idempotency Lock", desc: isDuplicate ? "⚠️ Duplicate key detected in Redis" : "SETNX lock on event.id in Redis" },
              { num: 4, title: "4. Fast 200 OK ACK", desc: "Returns 200 in <50ms; worker handles job" },
            ].map((st) => (
              <div
                key={st.num}
                className={`p-2.5 rounded-xl border text-[11px] space-y-1 ${
                  currentStep === st.num
                    ? "bg-green-500/15 border-green-400 text-green-300 ring-1 ring-green-400/30"
                    : "bg-[#18181b] border-white/10 text-zinc-400"
                }`}
              >
                <p className="font-bold text-zinc-100">{st.title}</p>
                <p className="text-[9px] opacity-80">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODE 2: HMAC SECURITY ─────────────────────────────────────────── */}
      {tabMode === "hmac" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-green-400">HMAC-SHA256 Payload Verification:</span>
            <span className="badge badge-xs badge-success text-black font-bold">Anti-Spoofing</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#18181b] border border-white/10 space-y-2">
              <span className="badge badge-xs badge-info font-bold">1. Header Components</span>
              <p className="text-zinc-200 text-xs">Stripe sends signature with timestamp:</p>
              <pre className="p-2.5 rounded bg-black/60 text-[10px] text-blue-300 overflow-x-auto">
{`Stripe-Signature:
  t=1684392019,
  v1=5257a869e7eceeda32ab62f1a9e...`}
              </pre>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-green-400/30 space-y-2">
              <span className="badge badge-xs badge-success text-black font-bold">2. Server Verification Check</span>
              <p className="text-zinc-200 text-xs">Receiver hashes body + secret:</p>
              <pre className="p-2.5 rounded bg-black/60 text-[10px] text-green-300 overflow-x-auto">
{`expectedSig = hmac_sha256(
  t + "." + rawBody,
  WEBHOOK_SECRET
)
if (expectedSig === v1):
  processEvent() // 100% Authentic`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 3: RETRY EXPONENTIAL BACKOFF ─────────────────────────────── */}
      {tabMode === "retries" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-green-400">Retry Schedule with Exponential Backoff &amp; Jitter:</span>
            <span className="badge badge-xs badge-warning text-black font-bold">Transient Fault Recovery</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { attempt: "Attempt 1", delay: "Instant (0s)", status: "HTTP 500 Timeout", color: "border-red-400/40" },
              { attempt: "Attempt 2", delay: "Wait 5s + Jitter", status: "HTTP 503 Overload", color: "border-amber-400/40" },
              { attempt: "Attempt 3", delay: "Wait 25s + Jitter", status: "HTTP 200 OK ✓", color: "border-green-400" },
              { attempt: "Dead Letter", delay: "After 72 hrs", status: "DLQ / Manual Audit", color: "border-purple-400/40" },
            ].map((r, i) => (
              <div key={i} className={`p-3 rounded-xl border bg-[#161616] ${r.color} space-y-1`}>
                <span className="badge badge-xs font-bold">{r.attempt}</span>
                <p className="text-zinc-100 font-bold text-xs">{r.delay}</p>
                <p className="text-[10px] text-zinc-400">{r.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-green-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <div>
            <p className="font-bold text-green-400">Idempotency is Crucial:</p>
            <p className="text-zinc-300 text-[10px]">Prevents double-charging or duplicate order fulfillment when webhooks retry.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <div>
            <p className="font-bold text-blue-400">Fast ACK Pattern (&lt;200ms):</p>
            <p className="text-zinc-300 text-[10px]">Return 200 OK immediately and offload heavy processing to background workers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
