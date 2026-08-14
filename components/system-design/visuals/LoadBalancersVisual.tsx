"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  TARGET_SERVERS_POOL,
  type LoadBalancingAlgorithm,
  type LoadBalancersVisualState,
} from "@/lib/system-design/lessons/scaling/load-balancers";

interface LoadBalancersVisualProps {
  visualState: LoadBalancersVisualState;
  accentHex: string;
}

export default function LoadBalancersVisual({
  visualState,
  accentHex,
}: LoadBalancersVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"algorithms" | "l4-vs-l7" | "health">("algorithms");
  const [selectedAlgo, setSelectedAlgo] = useState<LoadBalancingAlgorithm>(
    visualState.algorithm || "round-robin"
  );
  const [routedId, setRoutedId] = useState<number>(visualState.routedServerId || 1);

  const simulateDispatch = (algo: LoadBalancingAlgorithm) => {
    setSelectedAlgo(algo);
    if (algo === "round-robin") {
      setRoutedId((prev) => (prev >= 4 ? 1 : prev + 1));
    } else if (algo === "least-connections") {
      setRoutedId(3); // Server #3 has fewest connections (5)
    } else if (algo === "weighted") {
      setRoutedId(4); // Server #4 has highest weight (3)
    } else {
      setRoutedId(2); // IP Hash deterministic match
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
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-blue-400/30 rounded-2xl px-5 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-blue-400 font-mono tracking-wide flex items-center gap-2">
            <span>⚖️</span> Load Balancer Architecture &amp; Routing
          </h2>
          <p className="text-xs text-zinc-400">
            Traffic distribution · Layer 4 vs Layer 7 · Health checks &amp; failover
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "algorithms"
                ? "btn-accent bg-blue-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("algorithms")}
          >
            1. Algorithms
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "l4-vs-l7"
                ? "btn-accent bg-blue-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("l4-vs-l7")}
          >
            2. Layer 4 vs Layer 7
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "health"
                ? "btn-accent bg-blue-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("health")}
          >
            3. Health Checks
          </button>
        </div>
      </div>

      {/* ── MODE 1: ALGORITHM SIMULATOR ───────────────────────────────────── */}
      {tabMode === "algorithms" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
          {/* Algorithm Selector Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
            <span className="font-mono text-xs text-zinc-400 font-bold">Select Routing Algorithm:</span>
            <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
              {[
                { id: "round-robin", label: "Round Robin" },
                { id: "least-connections", label: "Least Connections" },
                { id: "weighted", label: "Weighted Round Robin" },
                { id: "ip-hash", label: "IP Hash" },
              ].map((algo) => (
                <button
                  key={algo.id}
                  onClick={() => simulateDispatch(algo.id as LoadBalancingAlgorithm)}
                  className={`join-item btn btn-xs font-mono ${
                    selectedAlgo === algo.id
                      ? "btn-accent bg-blue-400 text-black font-bold"
                      : "btn-ghost text-zinc-400"
                  }`}
                >
                  {algo.label}
                </button>
              ))}
            </div>
          </div>

          {/* Center Stage Diagram */}
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-[#18181b] border border-white/10 rounded-xl">
            {/* Left: Client */}
            <div className="p-3.5 rounded-xl border bg-[#161616] border-white/10 flex flex-col items-center gap-1.5 min-w-[120px] text-center shadow">
              <svg width="36" height="30" viewBox="0 0 44 30" fill="none">
                <rect x="2" y="2" width="40" height="26" rx="3" fill="#18181b" stroke="#34d399" strokeWidth="1.5" />
                <circle cx="6" cy="6" r="1.5" fill="#ef4444" />
                <circle cx="10" cy="6" r="1.5" fill="#f59e0b" />
                <circle cx="14" cy="6" r="1.5" fill="#10b981" />
                <rect x="6" y="11" width="32" height="13" rx="1" fill="#09090b" />
              </svg>
              <p className="text-[11px] font-bold font-mono text-zinc-100">Incoming User</p>
              <p className="text-[9px] font-mono text-zinc-400">198.51.100.42</p>
            </div>

            {/* Middle: Load Balancer Node */}
            <div className="p-4 rounded-2xl border border-blue-400 bg-[#18181b] flex flex-col items-center text-center gap-2 shadow-xl min-w-[140px]">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#60a5fa" strokeWidth="2">
                <path d="M20 6v14M10 20h20M10 20l-4 8h8l-4-8zM30 20l-4 8h8l-4-8z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="20" cy="6" r="2" fill="#60a5fa" />
              </svg>
              <div>
                <p className="text-xs font-bold font-mono text-blue-400">Load Balancer</p>
                <span className="badge badge-xs badge-info font-mono font-bold mt-0.5">
                  {selectedAlgo === "round-robin" && "Sequential"}
                  {selectedAlgo === "least-connections" && "Fewest Conns"}
                  {selectedAlgo === "weighted" && "Capacity Weighted"}
                  {selectedAlgo === "ip-hash" && "Deterministic Hash"}
                </span>
              </div>
            </div>

            {/* Right: Target Server Pool */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
              {TARGET_SERVERS_POOL.map((s) => {
                const isSelected = routedId === s.id;
                return (
                  <motion.div
                    key={s.id}
                    animate={{
                      scale: isSelected ? 1.04 : 1,
                      borderColor: isSelected ? "#60a5fa" : "rgba(255,255,255,0.1)",
                    }}
                    transition={{ duration: 0.2 }}
                    className={`p-3 rounded-xl border bg-[#161616] flex flex-col gap-1 font-mono text-xs transition-all ${
                      isSelected
                        ? "shadow-lg shadow-blue-400/20 ring-2 ring-blue-400/30"
                        : "hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-100">{s.name}</span>
                      {isSelected && (
                        <span className="badge badge-xs badge-success text-black font-bold">
                          Routed ➔
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400">
                      <span>Active Conns: {s.activeConnections}</span>
                      <span>Weight: {s.weight}x</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 2: LAYER 4 VS LAYER 7 ────────────────────────────────────── */}
      {tabMode === "l4-vs-l7" && (
        <div className="z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* Layer 4 Card */}
          <div className="bg-[#121214] border border-blue-500/30 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="badge badge-info font-bold">Layer 4 (Transport Layer)</span>
              <span className="text-blue-400 text-[10px]">TCP / UDP (IP &amp; Port Only)</span>
            </div>
            <div className="p-3 rounded-xl bg-[#18181b] border border-blue-500/20 space-y-2 text-[11px]">
              <p className="text-zinc-300">⚡ <strong>Ultra High Speed:</strong> Fast packet switching with zero TLS decryption or HTTP payload parsing.</p>
              <p className="text-zinc-300">🔍 <strong>No Content Inspection:</strong> Cannot inspect URL paths, HTTP headers, or cookies.</p>
              <p className="text-zinc-300">🎯 <strong>Best For:</strong> High-throughput raw TCP streams, gaming, VoIP, DNS balancing.</p>
            </div>
          </div>

          {/* Layer 7 Card */}
          <div className="bg-[#121214] border border-emerald-500/30 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="badge badge-success font-bold text-black">Layer 7 (Application Layer)</span>
              <span className="text-emerald-400 text-[10px]">HTTP / HTTPS (Content-Based)</span>
            </div>
            <div className="p-3 rounded-xl bg-[#18181b] border border-emerald-500/20 space-y-2 text-[11px]">
              <p className="text-zinc-300">🧠 <strong>Intelligent Routing:</strong> Routes based on URL path (<code className="text-emerald-300">/api</code> vs <code className="text-emerald-300">/images</code>) or cookie sessions.</p>
              <p className="text-zinc-300">🔒 <strong>SSL Termination:</strong> Decrypts HTTPS traffic to inspect payload and enforce security filters.</p>
              <p className="text-zinc-300">🎯 <strong>Best For:</strong> Web applications, microservice routing, A/B testing, session stickiness.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 3: HEALTH CHECKS & FAILOVER ──────────────────────────────── */}
      {tabMode === "health" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-blue-400 uppercase tracking-wider text-xs">
              Automated /healthz Heartbeat &amp; Eviction Pipeline:
            </span>
            <span className="badge badge-xs badge-success">Periodic Ping Every 5s</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#18181b] border border-emerald-400/30 space-y-1.5">
              <span className="badge badge-xs badge-success font-bold">1. Periodic Probe</span>
              <p className="font-bold text-zinc-200 text-xs">GET /healthz</p>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                Load Balancer sends HTTP GET /healthz every 5 seconds to each registered node.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-amber-400/30 space-y-1.5">
              <span className="badge badge-xs badge-warning font-bold">2. Thresholds</span>
              <p className="font-bold text-amber-400 text-xs">Unhealthy Threshold: 3</p>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                If a server times out or returns HTTP 500 three consecutive times, it is marked degraded.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-red-400/30 space-y-1.5">
              <span className="badge badge-xs badge-error font-bold text-white">3. Zero-Downtime Eviction</span>
              <p className="font-bold text-red-400 text-xs">Deregister Target</p>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                LB removes dead server from rotation immediately so zero users receive 502 errors!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <div>
            <p className="font-bold text-blue-400">Least Connections Rule:</p>
            <p className="text-zinc-300 text-[10px]">Optimal for long-running connections (e.g. WebSockets, large uploads).</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-emerald-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <div>
            <p className="font-bold text-emerald-400">Layer 7 Content Routing:</p>
            <p className="text-zinc-300 text-[10px]">Enables microservice URL splitting and canary deployment routing.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
