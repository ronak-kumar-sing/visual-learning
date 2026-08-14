"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  SAMPLE_EDGE_POPS,
  type CdnVisualState,
} from "@/lib/system-design/lessons/perf-consistency/cdn";

interface CdnVisualProps {
  visualState: CdnVisualState;
  accentHex: string;
}

export default function CdnVisual({ visualState, accentHex }: CdnVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"routing" | "headers" | "shield">("routing");
  const [selectedLocation, setSelectedLocation] = useState<string>(
    visualState.selectedEdgeId || "tyo"
  );
  const [isCdnEnabled, setIsCdnEnabled] = useState<boolean>(true);

  const activePoP =
    SAMPLE_EDGE_POPS.find((p) => p.id === selectedLocation) || SAMPLE_EDGE_POPS[0];

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
            <span>🌐</span> Content Delivery Networks (CDN) &amp; Edge PoPs
          </h2>
          <p className="text-xs text-zinc-400">
            Anycast DNS Routing · Edge Caching · Origin Offload · Cache-Control
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "routing"
                ? "btn-accent bg-amber-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("routing")}
          >
            1. Edge Routing
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "headers"
                ? "btn-accent bg-amber-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("headers")}
          >
            2. Cache Headers
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "shield"
                ? "btn-accent bg-amber-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("shield")}
          >
            3. Origin Shield
          </button>
        </div>
      </div>

      {/* ── MODE 1: GLOBAL EDGE ROUTING SIMULATOR ─────────────────────────── */}
      {tabMode === "routing" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl font-mono text-xs">
          {/* Location & CDN Toggle Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 font-bold">Client Location:</span>
              <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
                {SAMPLE_EDGE_POPS.map((pop) => (
                  <button
                    key={pop.id}
                    onClick={() => setSelectedLocation(pop.id)}
                    className={`join-item btn btn-xs font-mono ${
                      selectedLocation === pop.id
                        ? "btn-accent bg-amber-400 text-black font-bold"
                        : "btn-ghost text-zinc-400"
                    }`}
                  >
                    {pop.city}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsCdnEnabled((prev) => !prev)}
              className={`btn btn-xs font-mono font-bold ${
                isCdnEnabled ? "btn-success text-black" : "btn-error text-white"
              }`}
            >
              {isCdnEnabled ? "CDN Enabled (Edge Active)" : "Bypass CDN (Direct Origin)"}
            </button>
          </div>

          {/* Diagram Flow */}
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-[#18181b] border border-white/10 rounded-xl">
            {/* Client Node */}
            <div className="p-3.5 rounded-xl border border-white/10 bg-[#161616] flex flex-col items-center gap-1.5 min-w-[130px] text-center shadow">
              <svg width="36" height="30" viewBox="0 0 44 30" fill="none">
                <rect x="2" y="2" width="40" height="26" rx="3" fill="#18181b" stroke="#60a5fa" strokeWidth="1.5" />
                <circle cx="6" cy="6" r="1.5" fill="#ef4444" />
                <circle cx="10" cy="6" r="1.5" fill="#f59e0b" />
                <circle cx="14" cy="6" r="1.5" fill="#10b981" />
                <rect x="6" y="11" width="32" height="13" rx="1" fill="#09090b" />
              </svg>
              <p className="text-[11px] font-bold text-zinc-100">{activePoP.city} User</p>
              <span className="badge badge-xs badge-info">{activePoP.region}</span>
            </div>

            {/* Edge PoP Node (if CDN enabled) */}
            {isCdnEnabled ? (
              <>
                <div className="flex flex-col items-center">
                  <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
                    <motion.line
                      x1="0"
                      y1="6"
                      x2="32"
                      y2="6"
                      stroke="#34d399"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      animate={reduced ? {} : { strokeDashoffset: [0, -16] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    />
                    <polygon points="32,2 40,6 32,10" fill="#34d399" />
                  </svg>
                  <span className="text-[9px] text-emerald-400">{activePoP.latencyToLocalUserMs}ms (Anycast)</span>
                </div>

                <div className="p-4 rounded-2xl border border-emerald-400 bg-[#161616] flex flex-col items-center text-center gap-2 shadow-xl shadow-emerald-400/10 min-w-[160px]">
                  <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#34d399" strokeWidth="2">
                    <circle cx="20" cy="20" r="14" />
                    <path d="M20 6v28M6 20h28" />
                  </svg>
                  <div>
                    <p className="text-xs font-bold text-emerald-400">{activePoP.city} Edge PoP</p>
                    <span className="badge badge-xs badge-success text-black font-bold mt-0.5">
                      Edge Cache HIT ✓
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400">Terminates TLS &amp; HTTP</p>
                </div>
              </>
            ) : null}

            {/* SVG Connector to Origin */}
            <div className="flex flex-col items-center">
              <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
                <motion.line
                  x1="0"
                  y1="6"
                  x2="32"
                  y2="6"
                  stroke={isCdnEnabled ? "#52525b" : "#ef4444"}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  animate={reduced || isCdnEnabled ? {} : { strokeDashoffset: [0, -16] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                />
                <polygon points="32,2 40,6 32,10" fill={isCdnEnabled ? "#52525b" : "#ef4444"} />
              </svg>
              <span className="text-[9px] text-red-400">
                {isCdnEnabled ? "0% Traffic" : `${activePoP.latencyToOriginMs}ms (Cross-Pacific)`}
              </span>
            </div>

            {/* Central Origin Node */}
            <div className="p-4 rounded-2xl border border-white/10 bg-[#161616] flex flex-col items-center text-center gap-2 shadow-xl min-w-[150px]">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#60a5fa" strokeWidth="2">
                <rect x="6" y="6" width="28" height="28" rx="4" />
                <line x1="6" y1="14" x2="34" y2="14" />
              </svg>
              <div>
                <p className="text-xs font-bold text-blue-400">Central Origin Server</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Virginia, USA</p>
              </div>
              {isCdnEnabled ? (
                <span className="badge badge-xs badge-ghost text-zinc-500">100% Offloaded</span>
              ) : (
                <span className="badge badge-xs badge-error text-white font-bold">100% Origin Load</span>
              )}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#161616] border border-amber-400/20 text-xs flex items-center justify-between">
            <span className="text-zinc-400">Roundtrip Latency:</span>
            <span className={`font-bold ${isCdnEnabled ? "text-emerald-400" : "text-red-400"}`}>
              {isCdnEnabled
                ? `${activePoP.latencyToLocalUserMs} ms (Edge Cache HIT)`
                : `${activePoP.latencyToOriginMs} ms (Direct Origin Bottleneck)`}
            </span>
          </div>
        </div>
      )}

      {/* ── MODE 2: CACHE HEADERS INSPECTOR ───────────────────────────────── */}
      {tabMode === "headers" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-amber-400">HTTP Cache-Control Directives Breakdown:</span>
            <span className="badge badge-xs badge-warning">RFC 9111 Spec</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#18181b] border border-emerald-400/30 space-y-1.5">
              <span className="badge badge-xs badge-success text-black font-bold">public, max-age=86400</span>
              <p className="text-zinc-200 font-bold text-xs">Browser Cache</p>
              <p className="text-[10px] text-zinc-400">Caches asset in user&apos;s browser memory for 24 hours.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-blue-400/30 space-y-1.5">
              <span className="badge badge-xs badge-info font-bold">s-maxage=604800</span>
              <p className="text-zinc-200 font-bold text-xs">CDN Shared Cache</p>
              <p className="text-[10px] text-zinc-400">Overrides max-age specifically for public CDN Edge PoPs (7 days).</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-purple-400/30 space-y-1.5">
              <span className="badge badge-xs badge-secondary font-bold">stale-while-revalidate</span>
              <p className="text-zinc-200 font-bold text-xs">Instant Response</p>
              <p className="text-[10px] text-zinc-400">Serves stale copy instantly while fetching fresh update in background.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 3: ORIGIN SHIELD ─────────────────────────────────────────── */}
      {tabMode === "shield" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-amber-400">Origin Shield Architecture:</span>
            <span className="badge badge-xs badge-info">Collapsing Edge Stampedes</span>
          </div>

          <div className="p-4 rounded-xl bg-[#18181b] border border-blue-400/20 space-y-2">
            <p className="text-zinc-300 leading-relaxed text-xs">
              When 200 global Edge PoPs experience a simultaneous cache miss (e.g. after a deploy), an <strong>Origin Shield</strong> acts as an intermediate centralized caching tier near the origin.
            </p>
            <div className="p-3 rounded-lg bg-black/60 border border-white/5 space-y-1 text-[11px]">
              <p className="text-emerald-300">✓ 200 Edge PoPs query Origin Shield in parallel.</p>
              <p className="text-emerald-300">✓ Origin Shield makes exactly <strong>1 request</strong> to the true Origin Database.</p>
              <p className="text-emerald-300">✓ Eliminates 99.5% of origin cache stampede overload.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-emerald-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polygon points="12 6 12 12 16 14" />
          </svg>
          <div>
            <p className="font-bold text-emerald-400">Sub-15ms Global Latency:</p>
            <p className="text-zinc-300 text-[10px]">Static assets served locally within a few hops of the user.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <div>
            <p className="font-bold text-blue-400">DDoS Mitigation &amp; TLS Offload:</p>
            <p className="text-zinc-300 text-[10px]">Edge networks absorb multi-terabit volumetric attacks before hitting origin.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
