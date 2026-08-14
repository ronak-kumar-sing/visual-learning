"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  GATEWAY_MIDDLEWARE_PIPELINE,
  type ApiGatewaysVisualState,
} from "@/lib/system-design/lessons/reliability/api-gateways";

interface ApiGatewaysVisualProps {
  visualState: ApiGatewaysVisualState;
  accentHex: string;
}

export default function ApiGatewaysVisual({
  visualState,
  accentHex,
}: ApiGatewaysVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"routing" | "bff" | "matrix">("routing");
  const [selectedRoute, setSelectedRoute] = useState<string>("/api/v1/orders");
  const [activeStep, setActiveStep] = useState<number>(4);

  const handleTriggerRoute = (path: string) => {
    setSelectedRoute(path);
    setActiveStep(1);
    setTimeout(() => {
      setActiveStep(2);
      setTimeout(() => {
        setActiveStep(3);
        setTimeout(() => setActiveStep(4), 400);
      }, 400);
    }, 400);
  };

  const getTargetService = () => {
    if (selectedRoute.includes("orders")) return "Order Service (Port 8002)";
    if (selectedRoute.includes("users")) return "User Service (Port 8001)";
    return "Payment Service (Port 8003)";
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
            <span>🚪</span> API Gateways &amp; Reverse Proxy Dispatch
          </h2>
          <p className="text-xs text-zinc-400">
            TLS Termination · Centralized JWT Auth · Rate Limiting · BFF Pattern
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "routing"
                ? "btn-accent bg-yellow-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("routing")}
          >
            1. Gateway Pipeline
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "bff"
                ? "btn-accent bg-yellow-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("bff")}
          >
            2. BFF Aggregator
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "matrix"
                ? "btn-accent bg-yellow-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("matrix")}
          >
            3. Gateway Matrix
          </button>
        </div>
      </div>

      {/* ── MODE 1: GATEWAY ROUTING PIPELINE ──────────────────────────────── */}
      {tabMode === "routing" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
            <span className="text-zinc-300 font-bold">Select Request Path:</span>
            <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
              {["/api/v1/orders", "/api/v1/users", "/api/v1/payments"].map((p) => (
                <button
                  key={p}
                  onClick={() => handleTriggerRoute(p)}
                  className={`join-item btn btn-xs font-mono ${
                    selectedRoute === p
                      ? "btn-accent bg-yellow-400 text-black font-bold"
                      : "btn-ghost text-zinc-400"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* 3 Main Stages: Client ➔ Gateway (Middleware) ➔ Internal Service */}
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
              <p className="text-[11px] font-bold text-zinc-100">Client Device</p>
              <span className="badge badge-xs badge-secondary">HTTPS Request</span>
            </div>

            {/* Middle: Central API Gateway */}
            <motion.div
              animate={{
                scale: 1.02,
                borderColor: "#facc15",
              }}
              className="p-4 rounded-2xl border bg-[#161616] flex flex-col items-center text-center gap-2 shadow-xl shadow-yellow-400/10 min-w-[200px]"
            >
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#facc15" strokeWidth="2">
                <polygon points="20 4 36 12 36 28 20 36 4 28 4 12" />
                <line x1="20" y1="4" x2="20" y2="36" />
              </svg>
              <div>
                <p className="text-xs font-bold text-yellow-400">API Gateway (Kong / Envoy)</p>
                <span className="badge badge-xs badge-warning text-black font-bold mt-0.5">
                  TLS + Auth + Rate Limit
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">4.5ms total middleware latency</p>
            </motion.div>

            {/* Target Microservice Pod */}
            <div className="p-4 rounded-2xl border border-green-400/40 bg-[#161616] flex flex-col items-center text-center gap-2 shadow-xl min-w-[170px]">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#4ade80" strokeWidth="2">
                <rect x="6" y="6" width="28" height="28" rx="4" />
                <circle cx="20" cy="20" r="6" />
              </svg>
              <div>
                <p className="text-xs font-bold text-green-400">{getTargetService()}</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Internal Pod</p>
              </div>
              <span className="badge badge-xs badge-success text-black font-bold">Dispatched ✓</span>
            </div>
          </div>

          {/* 4 Pipeline Middleware Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {GATEWAY_MIDDLEWARE_PIPELINE.map((m, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl border text-[11px] space-y-1 ${
                  activeStep >= i + 1
                    ? "bg-yellow-500/15 border-yellow-400 text-yellow-300 ring-1 ring-yellow-400/30"
                    : "bg-[#18181b] border-white/10 text-zinc-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-100">{m.name}</span>
                  <span className="badge badge-xs badge-ghost text-[9px]">{m.executionTime}</span>
                </div>
                <p className="text-[9px] opacity-80">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODE 2: BFF AGGREGATOR ────────────────────────────────────────── */}
      {tabMode === "bff" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-yellow-400">Backend For Frontend (BFF) Aggregation:</span>
            <span className="badge badge-xs badge-info font-bold">3 Calls ➔ 1 Consolidated Response</span>
          </div>

          <div className="p-4 rounded-xl bg-[#18181b] border border-blue-400/30 space-y-3">
            <p className="text-zinc-300 text-xs">
              Mobile clients on slow 4G cellular networks shouldn&apos;t make 3 separate HTTP requests. The API Gateway queries internal microservices in parallel and returns 1 clean payload:
            </p>
            <pre className="p-3 rounded-lg bg-black/60 text-[11px] text-blue-300 overflow-x-auto border border-white/5 leading-relaxed">
{`// Mobile App calls: GET /api/v1/mobile/home-dashboard
{
  "user": { "id": 42, "name": "Alex", "tier": "PRO" },          // from UserService
  "activeOrders": [ { "order_id": 101, "status": "SHIPPED" } ],  // from OrderService
  "recommendedItems": [ { "sku": "SD-BOOK", "price": 49.99 } ]   // from RecService
}`}
            </pre>
          </div>
        </div>
      )}

      {/* ── MODE 3: GATEWAY COMPARISON MATRIX ─────────────────────────────── */}
      {tabMode === "matrix" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 overflow-x-auto shadow-xl font-mono text-xs">
          <table className="table table-sm w-full">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 text-[11px]">
                <th>Feature</th>
                <th>Direct Client-to-Microservice (Anti-Pattern)</th>
                <th>With API Gateway (Best Practice)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="font-bold text-zinc-200">Security &amp; Auth</td>
                <td className="text-red-400">Every microservice duplicates JWT validation logic</td>
                <td className="text-yellow-400 font-bold">Centralized auth; invalid tokens rejected at perimeter</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="font-bold text-zinc-200">Network Hops</td>
                <td className="text-red-400">Mobile app makes 10+ external HTTP requests per screen</td>
                <td className="text-yellow-400 font-bold">1 external call; Gateway queries microservices over fast LAN</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="font-bold text-zinc-200">SSL Overhead</td>
                <td className="text-amber-400">Every pod spends CPU on TLS crypto handshakes</td>
                <td className="text-yellow-400 font-bold">TLS terminated at Gateway; unencrypted internal gRPC/HTTP</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-yellow-400/30 p-2.5 rounded-lg flex items-center gap-2.5 text-xs font-mono">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
        <div>
          <p className="font-bold text-yellow-400">Single Perimeter Security:</p>
          <p className="text-zinc-300 text-[10px]">Internal microservices never expose public ports to the open internet.</p>
        </div>
      </div>
    </div>
  );
}
