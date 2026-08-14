"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  COMMON_API_ENDPOINTS,
  type ApiVisualState,
  type ApiEndpointItem,
} from "@/lib/system-design/lessons/web-apis/apis";

interface ApisVisualProps {
  visualState: ApiVisualState;
  accentHex: string;
}

// ── Custom Vector SVG UI Components with Animated Glows ──────────────────────
function ClientAppCard({ active }: { active?: boolean }) {
  return (
    <motion.div
      animate={{
        scale: active ? 1.05 : 1,
        borderColor: active ? "#34d399" : "rgba(255,255,255,0.1)",
      }}
      transition={{ duration: 0.3 }}
      className={`p-3.5 rounded-xl border bg-[#161616] flex flex-col items-center gap-1.5 transition-all text-center min-w-[120px] ${
        active
          ? "shadow-lg shadow-emerald-400/20 ring-2 ring-emerald-400/30"
          : "hover:border-white/20"
      }`}
    >
      <svg width="40" height="30" viewBox="0 0 44 30" fill="none">
        <rect x="2" y="2" width="40" height="26" rx="3" fill="#18181b" stroke={active ? "#34d399" : "#52525b"} strokeWidth="1.5" />
        <circle cx="6" cy="6" r="1.5" fill="#ef4444" />
        <circle cx="10" cy="6" r="1.5" fill="#f59e0b" />
        <circle cx="14" cy="6" r="1.5" fill="#10b981" />
        <rect x="18" y="4.5" width="20" height="3.5" rx="1" fill="#27272a" />
        <rect x="6" y="11" width="32" height="13" rx="1" fill="#09090b" />
      </svg>
      <div>
        <p className="text-[11px] font-bold font-mono text-zinc-100">Client App</p>
        <p className="text-[9px] font-mono text-zinc-400">(Travel Website)</p>
      </div>
    </motion.div>
  );
}

function ApiGatewayCard({ active }: { active?: boolean }) {
  return (
    <motion.div
      animate={{
        scale: active ? 1.05 : 1,
        borderColor: active ? "#34d399" : "rgba(255,255,255,0.1)",
      }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-2xl border bg-[#18181b] flex flex-col items-center text-center gap-2 shadow-xl min-w-[130px] transition-all ${
        active
          ? "ring-2 ring-emerald-400/20 shadow-emerald-400/15"
          : "hover:border-white/20"
      }`}
    >
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
        <rect x="6" y="6" width="28" height="28" rx="4" fill="#18181b" stroke="#34d399" strokeWidth="2" />
        <circle cx="20" cy="20" r="6" stroke="#34d399" strokeWidth="2" />
        <path d="M20 6v4M20 30v4M6 20h4M30 20h4" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div>
        <p className="text-xs font-bold font-mono text-emerald-400">API Gateway</p>
        <p className="text-[10px] font-mono text-zinc-400 mt-0.5">Router / Proxy</p>
      </div>
    </motion.div>
  );
}

function BackendServerCard({ active }: { active?: boolean }) {
  return (
    <motion.div
      animate={{
        scale: active ? 1.05 : 1,
        borderColor: active ? "#60a5fa" : "rgba(255,255,255,0.1)",
      }}
      transition={{ duration: 0.3 }}
      className={`p-3.5 rounded-xl border bg-[#161616] flex flex-col items-center gap-1.5 transition-all text-center min-w-[120px] ${
        active
          ? "shadow-lg shadow-blue-400/20 ring-2 ring-blue-400/30"
          : "hover:border-white/20"
      }`}
    >
      <svg width="40" height="36" viewBox="0 0 44 40" fill="none">
        <rect x="4" y="3" width="36" height="10" rx="2" fill="#18181b" stroke="#60a5fa" strokeWidth="1.5" />
        <circle cx="8" cy="8" r="1.5" fill="#60a5fa" />
        <line x1="13" y1="8" x2="32" y2="8" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="4" y="15" width="36" height="10" rx="2" fill="#18181b" stroke="#60a5fa" strokeWidth="1.5" />
        <circle cx="8" cy="20" r="1.5" fill="#60a5fa" />
        <line x1="13" y1="20" x2="32" y2="20" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="4" y="27" width="36" height="10" rx="2" fill="#18181b" stroke="#60a5fa" strokeWidth="1.5" />
        <circle cx="8" cy="32" r="1.5" fill="#60a5fa" />
        <line x1="13" y1="32" x2="32" y2="32" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div>
        <p className="text-[11px] font-bold font-mono text-zinc-100">Server &amp; DB</p>
        <p className="text-[9px] font-mono text-zinc-400">(Weather Service)</p>
      </div>
    </motion.div>
  );
}

export default function ApisVisual({ visualState, accentHex }: ApisVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [activeTabMode, setActiveTabMode] = useState<"flow" | "endpoints" | "types">("flow");
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpointItem>(COMMON_API_ENDPOINTS[0]);

  const stepIndex = visualState.currentStepIndex || 0;

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
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-emerald-400/30 rounded-2xl px-5 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-emerald-400 font-mono tracking-wide flex items-center gap-2">
            <span>🔌</span> API (Application Programming Interface)
          </h2>
          <p className="text-xs text-zinc-400">
            Rules and protocols for seamless inter-application communication
          </p>
        </div>

        {/* Mode Selector Join */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              activeTabMode === "flow"
                ? "btn-accent bg-emerald-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setActiveTabMode("flow")}
          >
            1. Request Flow
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              activeTabMode === "endpoints"
                ? "btn-accent bg-emerald-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setActiveTabMode("endpoints")}
          >
            2. Endpoints &amp; Methods
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              activeTabMode === "types"
                ? "btn-accent bg-emerald-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setActiveTabMode("types")}
          >
            3. Types of APIs
          </button>
        </div>
      </div>

      {/* ── MODE 1: REQUEST / RESPONSE LIFECYCLE ──────────────────────────── */}
      {activeTabMode === "flow" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
          {/* Step Sequence Indicator Bar */}
          <div className="grid grid-cols-4 gap-2 font-mono text-center text-xs">
            {[
              { num: 1, title: "1. Request (API Call)", sub: "GET /api/weather" },
              { num: 2, title: "2. Auth & Route", sub: "API Gateway" },
              { num: 3, title: "3. Process Request", sub: "Query DB / Compute" },
              { num: 4, title: "4. Return Response", sub: "200 OK (JSON)" },
            ].map((s, idx) => {
              const isActive = idx === stepIndex;
              return (
                <div
                  key={s.num}
                  className={`p-2 rounded-xl border transition-all ${
                    isActive
                      ? "bg-emerald-500/15 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400/30 shadow-lg shadow-emerald-400/10"
                      : "bg-[#18181b] border-white/10 text-zinc-400"
                  }`}
                >
                  <p className="font-bold text-[11px]">{s.title}</p>
                  <p className="text-[9px] opacity-80 mt-0.5">{s.sub}</p>
                </div>
              );
            })}
          </div>

          {/* Center Stage Diagram Flow with SVG Connectors & Animated Pulses */}
          <div className="relative flex items-center justify-between gap-4 p-5 bg-[#18181b] border border-white/10 rounded-xl overflow-hidden">
            {/* Left: Client Application */}
            <ClientAppCard active={stepIndex === 0 || stepIndex === 3} />

            {/* SVG Link Connector 1 with Animated Dashoffset */}
            <div className="flex flex-col items-center">
              <svg width="48" height="12" viewBox="0 0 48 12" fill="none">
                <motion.line
                  x1="0"
                  y1="6"
                  x2="40"
                  y2="6"
                  stroke="#34d399"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  animate={reduced ? {} : { strokeDashoffset: [0, -16] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                />
                <polygon points="40,2 48,6 40,10" fill="#34d399" />
              </svg>
              <span className="text-[9px] font-mono text-emerald-400 mt-1">1. Call</span>
            </div>

            {/* Middle: API Gateway */}
            <ApiGatewayCard active={stepIndex === 1} />

            {/* SVG Link Connector 2 with Animated Dashoffset */}
            <div className="flex flex-col items-center">
              <svg width="48" height="12" viewBox="0 0 48 12" fill="none">
                <motion.line
                  x1="0"
                  y1="6"
                  x2="40"
                  y2="6"
                  stroke="#60a5fa"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  animate={reduced ? {} : { strokeDashoffset: [0, -16] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                />
                <polygon points="40,2 48,6 40,10" fill="#60a5fa" />
              </svg>
              <span className="text-[9px] font-mono text-blue-400 mt-1">2. Process</span>
            </div>

            {/* Right: Backend Server & DB */}
            <BackendServerCard active={stepIndex === 2} />
          </div>
        </div>
      )}

      {/* ── MODE 2: API ENDPOINTS & HTTP METHODS ──────────────────────────── */}
      {activeTabMode === "endpoints" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          {/* Endpoints Table */}
          <div className="flex-1 w-full space-y-2">
            <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              API Endpoints Example Table:
            </h3>
            <div className="space-y-1.5">
              {COMMON_API_ENDPOINTS.map((ep) => {
                const isSelected = selectedEndpoint.endpoint === ep.endpoint && selectedEndpoint.method === ep.method;
                const methodColor =
                  ep.method === "GET"
                    ? "btn-success"
                    : ep.method === "POST"
                      ? "btn-warning"
                      : ep.method === "PUT"
                        ? "btn-info"
                        : "btn-error";
                return (
                  <button
                    key={`${ep.method}-${ep.endpoint}`}
                    onClick={() => setSelectedEndpoint(ep)}
                    className={`w-full p-2.5 rounded-xl border text-left font-mono text-xs flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-[#18181b] border-emerald-400 shadow-md shadow-emerald-400/10"
                        : "bg-[#161616] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`btn btn-xs ${methodColor} font-bold font-mono text-[10px]`}>
                        {ep.method}
                      </span>
                      <span className="text-zinc-200 font-bold">{ep.endpoint}</span>
                    </div>
                    <span className="text-zinc-400 text-[11px] truncate max-w-[200px]">
                      {ep.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Endpoint Tester Box */}
          <div className="w-full md:w-80 bg-[#18181b] border border-emerald-400/30 rounded-xl p-4 flex flex-col gap-2 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-emerald-400">Response Payload</span>
              <span className="badge badge-xs badge-success">200 OK</span>
            </div>
            <p className="text-[10px] text-zinc-400">{selectedEndpoint.description}</p>
            <pre className="p-3 rounded-lg bg-[#09090b] border border-white/10 text-emerald-300 text-[10px] whitespace-pre-wrap break-words">
              {selectedEndpoint.samplePayload}
            </pre>
          </div>
        </div>
      )}

      {/* ── MODE 3: TYPES OF APIS ─────────────────────────────────────────── */}
      {activeTabMode === "types" && (
        <div className="z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="bg-[#121214] border border-emerald-400/30 rounded-xl p-3.5 space-y-1.5">
            <span className="badge badge-xs badge-success font-mono">Public APIs</span>
            <p className="text-xs font-bold text-zinc-200 font-mono">Open for Public Use</p>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Available to any third-party developer (e.g. Weather API, Twitter API).
            </p>
          </div>

          <div className="bg-[#121214] border border-blue-400/30 rounded-xl p-3.5 space-y-1.5">
            <span className="badge badge-xs badge-info font-mono">Private APIs</span>
            <p className="text-xs font-bold text-zinc-200 font-mono">Internal Network Only</p>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Used strictly within an organization between internal microservices.
            </p>
          </div>

          <div className="bg-[#121214] border border-amber-400/30 rounded-xl p-3.5 space-y-1.5">
            <span className="badge badge-xs badge-warning font-mono">Partner APIs</span>
            <p className="text-xs font-bold text-zinc-200 font-mono">Trusted B2B Partners</p>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Shared exclusively with authorized business partners via dedicated keys.
            </p>
          </div>

          <div className="bg-[#121214] border border-purple-400/30 rounded-xl p-3.5 space-y-1.5">
            <span className="badge badge-xs badge-secondary font-mono">Composite APIs</span>
            <p className="text-xs font-bold text-zinc-200 font-mono">Multi-API Aggregator</p>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Combines data from multiple API endpoints into a single unified response.
            </p>
          </div>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-emerald-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
            <path d="M8 9l3 3-3 3M13 15h3M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
          </svg>
          <div>
            <p className="font-bold text-emerald-400">Protocols &amp; Formats:</p>
            <p className="text-zinc-300 text-[10px]">HTTP / HTTPS Protocols · JSON / XML Formats</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v8M8 12h8" />
          </svg>
          <div>
            <p className="font-bold text-blue-400">In Short Bridge Concept:</p>
            <p className="text-zinc-300 text-[10px]">API acts as a bridge allowing software to talk &amp; share data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
