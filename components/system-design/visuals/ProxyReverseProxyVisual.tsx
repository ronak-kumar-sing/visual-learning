"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type {
  ProxyInfographicVisualState,
  ArchitectureMode,
} from "@/lib/system-design/lessons/networking/proxy-reverse-proxy";

interface ProxyVisualProps {
  visualState: ProxyInfographicVisualState;
  accentHex: string;
}

// ── Custom SVG Components (No Emojis) ───────────────────────────────────────
function BrowserClientCard({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={`p-3 rounded-xl border bg-[#161616] flex flex-col items-center gap-1.5 transition-all text-center ${
        active
          ? "border-amber-400 shadow-lg shadow-amber-400/20 ring-1 ring-amber-400/40"
          : "border-white/10 hover:border-white/20"
      }`}
    >
      <svg width="40" height="28" viewBox="0 0 40 28" fill="none">
        <rect x="2" y="2" width="36" height="24" rx="3" fill="#18181b" stroke={active ? "#fbbf24" : "#52525b"} strokeWidth="1.5" />
        <circle cx="6" cy="6" r="1.5" fill="#ef4444" />
        <circle cx="10" cy="6" r="1.5" fill="#f59e0b" />
        <circle cx="14" cy="6" r="1.5" fill="#10b981" />
        <rect x="18" y="4.5" width="16" height="3" rx="1" fill="#27272a" />
        <rect x="6" y="11" width="28" height="11" rx="1" fill="#09090b" />
      </svg>
      <span className="text-[11px] font-bold text-zinc-200 font-mono">{label}</span>
    </div>
  );
}

function ServerNodeCard({ label, color = "#60a5fa" }: { label: string; color?: string }) {
  return (
    <div className="px-3 py-1.5 rounded-lg border bg-[#161616] border-white/10 flex items-center gap-2 font-mono text-[10px] text-zinc-200 hover:border-white/30 transition-colors">
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="3" width="16" height="5" rx="1" fill="#18181b" stroke={color} strokeWidth="1.2" />
        <circle cx="5" cy="5.5" r="1" fill={color} />
        <line x1="8" y1="5.5" x2="14" y2="5.5" stroke="#52525b" strokeWidth="1.2" strokeLinecap="round" />
        <rect x="2" y="11" width="16" height="5" rx="1" fill="#18181b" stroke={color} strokeWidth="1.2" />
        <circle cx="5" cy="13.5" r="1" fill={color} />
        <line x1="8" y1="13.5" x2="14" y2="13.5" stroke="#52525b" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <span>{label}</span>
    </div>
  );
}

function MicroserviceCard({ label, color = "#2dd4bf" }: { label: string; color?: string }) {
  return (
    <div className="px-2.5 py-1 rounded-md border bg-[#161616] border-white/10 flex items-center gap-2 font-mono text-[9px] text-zinc-300 hover:border-white/30 transition-colors">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="2" fill="#18181b" stroke={color} strokeWidth="1.2" />
        <path d="M5 8h6M8 5v6" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <span>{label}</span>
    </div>
  );
}

function ProxyCoreNode({
  title,
  sub,
  color,
  mode,
}: {
  title: string;
  sub: string;
  color: string;
  mode: ArchitectureMode;
}) {
  return (
    <div
      className="p-4 rounded-2xl border bg-[#18181b] flex flex-col items-center text-center gap-2 shadow-xl min-w-[130px]"
      style={{ borderColor: color, boxShadow: `0 0 20px ${color}25` }}
    >
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
        {mode === "reverse-proxy" && (
          <path d="M20 4L6 10v10c0 10.5 6 16.5 14 19 8-2.5 14-8.5 14-19V10L20 4z" fill="#18181b" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        )}
        {mode === "gateway-proxy" && (
          <g stroke={color} strokeWidth="2" fill="none">
            <rect x="6" y="6" width="28" height="28" rx="4" />
            <circle cx="20" cy="20" r="6" />
            <path d="M20 6v4M20 30v4M6 20h4M30 20h4" strokeLinecap="round" />
          </g>
        )}
        {mode === "load-balancer" && (
          <g stroke={color} strokeWidth="2" fill="none">
            <path d="M20 6v14M10 20h20M10 20l-4 8h8l-4-8zM30 20l-4 8h8l-4-8z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="20" cy="6" r="2" fill={color} />
          </g>
        )}
      </svg>
      <div>
        <p className="text-xs font-bold font-mono" style={{ color }}>
          {title}
        </p>
        <p className="text-[10px] font-mono text-zinc-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

export default function ProxyReverseProxyVisual({
  visualState,
  accentHex,
}: ProxyVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [activeFilter, setActiveFilter] = useState<ArchitectureMode | "all">(
    "all"
  );
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const stepIndex = visualState.activeStep || 0;

  const activeStepMode: ArchitectureMode =
    stepIndex === 0
      ? "reverse-proxy"
      : stepIndex === 1
        ? "gateway-proxy"
        : "load-balancer";

  const effectiveMode = activeFilter === "all" ? activeStepMode : activeFilter;

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
            <span>🛡️</span> Reverse Proxy <span className="text-zinc-500">vs</span> ⚙️ Gateway Proxy <span className="text-zinc-500">vs</span> ⚖️ Load Balancer
          </h2>
          <p className="text-xs text-zinc-400">
            Architectural flows, core purpose, and common use cases
          </p>
        </div>

        {/* View Filter Buttons */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              activeFilter === "all"
                ? "btn-amber bg-amber-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setActiveFilter("all")}
          >
            All 3 Stacked
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              activeFilter === "reverse-proxy"
                ? "btn-amber bg-amber-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setActiveFilter("reverse-proxy")}
          >
            1. Reverse Proxy
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              activeFilter === "gateway-proxy"
                ? "btn-accent bg-teal-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setActiveFilter("gateway-proxy")}
          >
            2. Gateway Proxy
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              activeFilter === "load-balancer"
                ? "btn-info bg-blue-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setActiveFilter("load-balancer")}
          >
            3. Load Balancer
          </button>
        </div>
      </div>

      {/* ── BLOCK 1: REVERSE PROXY PANEL ──────────────────────────────────── */}
      {(activeFilter === "all" || activeFilter === "reverse-proxy") && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`z-10 w-full max-w-5xl bg-[#121214] border rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-all shadow-lg ${
            effectiveMode === "reverse-proxy"
              ? "border-amber-400 ring-2 ring-amber-400/20 shadow-amber-400/10"
              : "border-white/10 opacity-80"
          }`}
        >
          {/* Left Description Card */}
          <div className="w-full md:w-72 bg-[#18181b] border border-white/10 rounded-xl p-3.5 flex flex-col justify-between gap-2.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 font-mono font-bold text-xs">
                  1 Reverse Proxy
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 font-medium leading-relaxed">
                Sits in front of servers and receives requests on their behalf.
              </p>
              <ul className="mt-2 space-y-1 text-[10px] text-zinc-400 list-disc pl-3">
                <li>Single public entry point</li>
                <li>Routes traffic to backend servers</li>
                <li>Improves security and performance</li>
                <li>Can cache static content</li>
              </ul>
            </div>
            <div className="bg-amber-400/10 border border-amber-400/30 rounded px-2 py-1 text-[10px] text-amber-300 font-mono flex items-center gap-1.5">
              <span>Best for:</span> Websites, apps &amp; protecting origin servers
            </div>
          </div>

          {/* Right Diagram Flow with SVG Connecting Lines */}
          <div className="relative flex-1 flex items-center justify-between gap-3 w-full pl-2">
            {/* Requester Node */}
            <BrowserClientCard label="Users / Browsers" active={effectiveMode === "reverse-proxy"} />

            {/* SVG Link Connector */}
            <div className="flex flex-col items-center">
              <svg width="32" height="12" viewBox="0 0 32 12" fill="none">
                <line x1="0" y1="6" x2="26" y2="6" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 3" />
                <polygon points="26,2 32,6 26,10" fill="#fbbf24" />
              </svg>
            </div>

            {/* Vertical Feature Stack */}
            <div className="flex flex-col gap-1">
              {[
                { label: "SSL Termination", desc: "Decrypts HTTPS traffic before forwarding to backend." },
                { label: "Caching", desc: "Stores static HTTP responses in RAM." },
                { label: "Compression", desc: "Gzip / Brotli compression for fast transfers." },
                { label: "Security", desc: "Filters malicious web traffic & WAF inspection." },
                { label: "Hides origin servers", desc: "Conceals internal backend server IP addresses." },
              ].map((f) => (
                <div
                  key={f.label}
                  onMouseEnter={() => setHoveredFeature(f.desc)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className="px-2.5 py-0.5 rounded bg-[#18181b] border border-amber-400/40 text-[10px] font-mono text-amber-300 text-center hover:scale-105 transition-transform cursor-pointer shadow-sm"
                >
                  {f.label}
                </div>
              ))}
            </div>

            {/* SVG Link Connector */}
            <div className="flex flex-col items-center">
              <svg width="32" height="12" viewBox="0 0 32 12" fill="none">
                <line x1="0" y1="6" x2="26" y2="6" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 3" />
                <polygon points="26,2 32,6 26,10" fill="#fbbf24" />
              </svg>
            </div>

            {/* Core Reverse Proxy Node */}
            <ProxyCoreNode
              title="Reverse Proxy"
              sub="Front door for servers"
              color="#fbbf24"
              mode="reverse-proxy"
            />

            {/* SVG Link Connector */}
            <div className="flex flex-col items-center">
              <svg width="32" height="12" viewBox="0 0 32 12" fill="none">
                <line x1="0" y1="6" x2="26" y2="6" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 3" />
                <polygon points="26,2 32,6 26,10" fill="#fbbf24" />
              </svg>
            </div>

            {/* Target Server Pool */}
            <div className="flex flex-col gap-1.5 min-w-[110px]">
              <ServerNodeCard label="Web Server A" color="#fbbf24" />
              <ServerNodeCard label="Web Server B" color="#fbbf24" />
              <ServerNodeCard label="App Server" color="#fbbf24" />
            </div>
          </div>
        </motion.div>
      )}

      {/* ── BLOCK 2: GATEWAY PROXY PANEL ──────────────────────────────────── */}
      {(activeFilter === "all" || activeFilter === "gateway-proxy") && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`z-10 w-full max-w-5xl bg-[#121214] border rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-all shadow-lg ${
            effectiveMode === "gateway-proxy"
              ? "border-teal-400 ring-2 ring-teal-400/20 shadow-teal-400/10"
              : "border-white/10 opacity-80"
          }`}
        >
          {/* Left Description Card */}
          <div className="w-full md:w-72 bg-[#18181b] border border-white/10 rounded-xl p-3.5 flex flex-col justify-between gap-2.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="px-2 py-0.5 rounded bg-teal-400/20 text-teal-400 font-mono font-bold text-xs">
                  2 Gateway Proxy
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 font-medium leading-relaxed">
                A smart entry point for APIs and microservices.
              </p>
              <ul className="mt-2 space-y-1 text-[10px] text-zinc-400 list-disc pl-3">
                <li>Centralizes cross-cutting concerns</li>
                <li>Applies auth and policies</li>
                <li>Routes requests to services</li>
                <li>Can transform &amp; aggregate responses</li>
              </ul>
            </div>
            <div className="bg-teal-400/10 border border-teal-400/30 rounded px-2 py-1 text-[10px] text-teal-300 font-mono flex items-center gap-1.5">
              <span>Best for:</span> Microservices, API management &amp; client APIs
            </div>
          </div>

          {/* Right Diagram Flow with SVG Connecting Lines */}
          <div className="relative flex-1 flex items-center justify-between gap-3 w-full pl-2">
            {/* Requester Nodes Stack */}
            <div className="flex flex-col gap-1 min-w-[90px]">
              <div className="px-2 py-1 rounded bg-[#161616] border border-white/10 text-[9px] font-mono text-zinc-300 text-center">
                Web App
              </div>
              <div className="px-2 py-1 rounded bg-[#161616] border border-white/10 text-[9px] font-mono text-zinc-300 text-center">
                Mobile App
              </div>
              <div className="px-2 py-1 rounded bg-[#161616] border border-white/10 text-[9px] font-mono text-zinc-300 text-center">
                Partner App
              </div>
            </div>

            {/* SVG Link Connector */}
            <div className="flex flex-col items-center">
              <svg width="32" height="12" viewBox="0 0 32 12" fill="none">
                <line x1="0" y1="6" x2="26" y2="6" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="3 3" />
                <polygon points="26,2 32,6 26,10" fill="#2dd4bf" />
              </svg>
            </div>

            {/* Vertical Feature Stack */}
            <div className="flex flex-col gap-1">
              {[
                { label: "Authentication", desc: "Verifies JWT tokens and client API keys." },
                { label: "Authorization", desc: "Enforces RBAC / ABAC access policies." },
                { label: "Rate Limiting", desc: "Throttles excessive requests per IP/user." },
                { label: "Request Routing", desc: "Routes path prefixes to microservices." },
                { label: "Protocol Translation", desc: "Translates REST to gRPC / WebSockets." },
                { label: "Aggregation", desc: "Combines data from multiple microservices." },
                { label: "Observability", desc: "Central logs, metrics, and trace IDs." },
              ].map((f) => (
                <div
                  key={f.label}
                  onMouseEnter={() => setHoveredFeature(f.desc)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className="px-2 py-0.5 rounded bg-[#18181b] border border-teal-400/40 text-[9px] font-mono text-teal-300 text-center hover:scale-105 transition-transform cursor-pointer shadow-sm"
                >
                  {f.label}
                </div>
              ))}
            </div>

            {/* SVG Link Connector */}
            <div className="flex flex-col items-center">
              <svg width="32" height="12" viewBox="0 0 32 12" fill="none">
                <line x1="0" y1="6" x2="26" y2="6" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="3 3" />
                <polygon points="26,2 32,6 26,10" fill="#2dd4bf" />
              </svg>
            </div>

            {/* Core API Gateway Node */}
            <ProxyCoreNode
              title="Gateway Proxy"
              sub="Control layer for APIs"
              color="#2dd4bf"
              mode="gateway-proxy"
            />

            {/* SVG Link Connector */}
            <div className="flex flex-col items-center">
              <svg width="32" height="12" viewBox="0 0 32 12" fill="none">
                <line x1="0" y1="6" x2="26" y2="6" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="3 3" />
                <polygon points="26,2 32,6 26,10" fill="#2dd4bf" />
              </svg>
            </div>

            {/* Target Microservices Pool */}
            <div className="flex flex-col gap-1 min-w-[100px]">
              <MicroserviceCard label="Auth Service" color="#2dd4bf" />
              <MicroserviceCard label="User Service" color="#2dd4bf" />
              <MicroserviceCard label="Orders Service" color="#2dd4bf" />
              <MicroserviceCard label="Payments Service" color="#2dd4bf" />
              <MicroserviceCard label="Notification" color="#2dd4bf" />
            </div>
          </div>
        </motion.div>
      )}

      {/* ── BLOCK 3: LOAD BALANCER PANEL ─────────────────────────────────── */}
      {(activeFilter === "all" || activeFilter === "load-balancer") && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`z-10 w-full max-w-5xl bg-[#121214] border rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-all shadow-lg ${
            effectiveMode === "load-balancer"
              ? "border-blue-400 ring-2 ring-blue-400/20 shadow-blue-400/10"
              : "border-white/10 opacity-80"
          }`}
        >
          {/* Left Description Card */}
          <div className="w-full md:w-72 bg-[#18181b] border border-white/10 rounded-xl p-3.5 flex flex-col justify-between gap-2.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="px-2 py-0.5 rounded bg-blue-400/20 text-blue-400 font-mono font-bold text-xs">
                  3 Load Balancer
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 font-medium leading-relaxed">
                Distributes incoming traffic across multiple healthy servers.
              </p>
              <ul className="mt-2 space-y-1 text-[10px] text-zinc-400 list-disc pl-3">
                <li>Prevents overload on one server</li>
                <li>Improves scalability</li>
                <li>Removes unhealthy instances</li>
                <li>Supports high availability</li>
              </ul>
            </div>
            <div className="bg-blue-400/10 border border-blue-400/30 rounded px-2 py-1 text-[10px] text-blue-300 font-mono flex items-center gap-1.5">
              <span>Best for:</span> Scaling traffic &amp; improving uptime
            </div>
          </div>

          {/* Right Diagram Flow with SVG Connecting Lines */}
          <div className="relative flex-1 flex items-center justify-between gap-3 w-full pl-2">
            {/* Requester Node */}
            <BrowserClientCard label="Clients" active={effectiveMode === "load-balancer"} />

            {/* SVG Link Connector */}
            <div className="flex flex-col items-center">
              <svg width="32" height="12" viewBox="0 0 32 12" fill="none">
                <line x1="0" y1="6" x2="26" y2="6" stroke="#60a5fa" strokeWidth="2" strokeDasharray="3 3" />
                <polygon points="26,2 32,6 26,10" fill="#60a5fa" />
              </svg>
            </div>

            {/* Vertical Feature Stack */}
            <div className="flex flex-col gap-1">
              {[
                { label: "Round Robin", desc: "Sequentially rotates requests across nodes." },
                { label: "Least Connections", desc: "Routes to node with fewest active connections." },
                { label: "Health Checks", desc: "Pings /health endpoint & drops dead nodes." },
                { label: "Failover", desc: "Reroutes traffic automatically if a zone fails." },
                { label: "High Availability", desc: "Guarantees 99.99% system uptime." },
              ].map((f) => (
                <div
                  key={f.label}
                  onMouseEnter={() => setHoveredFeature(f.desc)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className="px-2.5 py-0.5 rounded bg-[#18181b] border border-blue-400/40 text-[10px] font-mono text-blue-300 text-center hover:scale-105 transition-transform cursor-pointer shadow-sm"
                >
                  {f.label}
                </div>
              ))}
            </div>

            {/* SVG Link Connector */}
            <div className="flex flex-col items-center">
              <svg width="32" height="12" viewBox="0 0 32 12" fill="none">
                <line x1="0" y1="6" x2="26" y2="6" stroke="#60a5fa" strokeWidth="2" strokeDasharray="3 3" />
                <polygon points="26,2 32,6 26,10" fill="#60a5fa" />
              </svg>
            </div>

            {/* Core Load Balancer Node */}
            <ProxyCoreNode
              title="Load Balancer"
              sub="Traffic distributor"
              color="#60a5fa"
              mode="load-balancer"
            />

            {/* SVG Link Connector */}
            <div className="flex flex-col items-center">
              <svg width="32" height="12" viewBox="0 0 32 12" fill="none">
                <line x1="0" y1="6" x2="26" y2="6" stroke="#60a5fa" strokeWidth="2" strokeDasharray="3 3" />
                <polygon points="26,2 32,6 26,10" fill="#60a5fa" />
              </svg>
            </div>

            {/* Target App Instances Pool */}
            <div className="flex flex-col gap-1 min-w-[110px]">
              {[1, 2, 3, 4].map((i) => (
                <ServerNodeCard key={i} label={`Instance ${i}`} color="#60a5fa" />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR: Clean Vector Cards ──────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 flex flex-col gap-2">
        <div className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider text-center">
          ── Quick Difference Summary ──
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-[#18181b] border border-amber-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
              <path d="M12 2L3 7v6c0 5.5 3.8 10 9 11 5.2-1 9-5.5 9-11V7l-9-5z" />
            </svg>
            <div>
              <p className="font-bold text-amber-400 font-mono text-[11px]">
                Reverse Proxy:
              </p>
              <p className="text-zinc-300 text-[10px]">Front door for servers</p>
            </div>
          </div>

          <div className="bg-[#18181b] border border-teal-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="12" cy="12" r="4" />
            </svg>
            <div>
              <p className="font-bold text-teal-400 font-mono text-[11px]">
                Gateway Proxy:
              </p>
              <p className="text-zinc-300 text-[10px]">Control layer for APIs</p>
            </div>
          </div>

          <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
              <path d="M12 3v12M6 15h12M6 15l-3 6h6l-3-6zM18 15l-3 6h6l-3-6z" />
            </svg>
            <div>
              <p className="font-bold text-blue-400 font-mono text-[11px]">
                Load Balancer:
              </p>
              <p className="text-zinc-300 text-[10px]">
                Traffic distributor across instances
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Feature Inspector Overlay ────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {hoveredFeature && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="z-20 w-full max-w-xl bg-[#18181b] border border-amber-400/40 rounded-xl p-3 text-xs flex items-center gap-2 shadow-2xl backdrop-blur-md"
          >
            <span className="text-amber-400 text-base">🔍</span>
            <span className="text-zinc-200 text-[11px] leading-relaxed">
              {hoveredFeature}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
