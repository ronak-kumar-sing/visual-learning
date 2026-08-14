"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { InfographicDnsVisualState } from "@/lib/system-design/lessons/networking/dns";

interface DnsVisualProps {
  visualState: InfographicDnsVisualState;
  accentHex: string;
}

interface DnsNode {
  id: "browser" | "isp" | "root" | "tld" | "auth" | "loaded";
  stepNum: number;
  title: string;
  sub: string;
  type: "laptop" | "router" | "root-server" | "tld-server" | "auth-server";
  ip: string;
  role: string;
}

const NODES: DnsNode[] = [
  {
    id: "browser",
    stepNum: 1,
    title: "Browser / Client",
    sub: "www.google.com",
    type: "laptop",
    ip: "192.168.1.10",
    role: "User enters www.google.com. Checks local browser/OS cache first.",
  },
  {
    id: "isp",
    stepNum: 2,
    title: "ISP DNS Resolver",
    sub: "ISP / 8.8.8.8",
    type: "router",
    ip: "8.8.8.8",
    role: "Acts as librarian. Queries Root, TLD, and Authoritative servers on behalf of the client.",
  },
  {
    id: "root",
    stepNum: 3,
    title: "Root DNS Server",
    sub: "Root (.)",
    type: "root-server",
    ip: "198.41.0.4",
    role: "Directs the resolver to the .com TLD DNS server.",
  },
  {
    id: "tld",
    stepNum: 4,
    title: "TLD DNS Server",
    sub: ".com Registry",
    type: "tld-server",
    ip: "192.5.6.30",
    role: "Manages .com domain extensions. Directs resolver to google.com Authoritative server.",
  },
  {
    id: "auth",
    stepNum: 5,
    title: "Authoritative DNS",
    sub: "google.com",
    type: "auth-server",
    ip: "142.250.190.78",
    role: "Holds the final 'A' record for google.com and returns IP 142.250.190.78.",
  },
];

// SVG Icon Helpers
function LaptopSVG({ active }: { active: boolean }) {
  return (
    <svg width="48" height="40" viewBox="0 0 48 40" fill="none">
      <rect x="6" y="4" width="36" height="24" rx="3" fill="#18181b" stroke={active ? "#fbbf24" : "#52525b"} strokeWidth="1.5" />
      <rect x="10" y="8" width="28" height="16" rx="1" fill="#09090b" />
      {active && <rect x="14" y="12" width="20" height="8" rx="1" fill="#fbbf24" fillOpacity="0.2" />}
      <path d="M0 32h48v2a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2z" fill="#27272a" stroke={active ? "#fbbf24" : "#52525b"} strokeWidth="1.5" />
    </svg>
  );
}

function RouterSVG({ active }: { active: boolean }) {
  return (
    <svg width="48" height="40" viewBox="0 0 48 40" fill="none">
      {/* Antennas */}
      <line x1="12" y1="12" x2="12" y2="4" stroke={active ? "#2dd4bf" : "#52525b"} strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="12" x2="24" y2="2" stroke={active ? "#2dd4bf" : "#52525b"} strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="12" x2="36" y2="4" stroke={active ? "#2dd4bf" : "#52525b"} strokeWidth="2" strokeLinecap="round" />
      {/* Body */}
      <rect x="4" y="14" width="40" height="20" rx="4" fill="#18181b" stroke={active ? "#2dd4bf" : "#52525b"} strokeWidth="1.5" />
      {/* LED indicators */}
      <circle cx="12" cy="24" r="2" fill={active ? "#2dd4bf" : "#3f3f46"} />
      <circle cx="18" cy="24" r="2" fill={active ? "#34d399" : "#3f3f46"} />
      <circle cx="24" cy="24" r="2" fill={active ? "#fbbf24" : "#3f3f46"} />
    </svg>
  );
}

function ServerRackSVG({ active, color }: { active: boolean; color: string }) {
  return (
    <svg width="44" height="48" viewBox="0 0 44 48" fill="none">
      <rect x="4" y="4" width="36" height="40" rx="3" fill="#18181b" stroke={active ? color : "#52525b"} strokeWidth="1.5" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="8" y={8 + i * 11} width="28" height="8" rx="1.5" fill="#09090b" stroke={color} strokeOpacity={active ? "0.6" : "0.2"} />
          <circle cx="12" cy={12 + i * 11} r="1.5" fill={active ? color : "#3f3f46"} />
          <line x1="18" y1={12 + i * 11} x2="32" y2={12 + i * 11} stroke="#3f3f46" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

export default function DnsVisual({ visualState, accentHex }: DnsVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const stepIndex = visualState.currentStepIndex;
  const activeNodeId = visualState.activeNode;

  const inspectedNode = NODES.find(
    (n) => n.id === (hoveredNodeId || activeNodeId)
  ) || NODES[0];

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-between p-6 select-none overflow-hidden"
      style={{ backgroundColor: "var(--sd-bg)" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(var(--sd-text) 1px, transparent 1px), linear-gradient(90deg, var(--sd-text) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
        aria-hidden="true"
      />

      {/* Top Banner — Target domain and resolved IP */}
      <div className="z-10 flex items-center justify-between w-full max-w-4xl bg-[#111111] border border-white/10 rounded-xl px-5 py-3 text-xs shadow-lg">
        <div className="flex items-center gap-3 font-mono">
          <span className="text-zinc-400">Target:</span>
          <span className="px-2.5 py-1 rounded bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold">
            www.google.com
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="text-zinc-400">Step {stepIndex + 1} / 7:</span>
          <span className="text-amber-400 font-bold">
            {stepIndex === 0 && "1. Enter URL"}
            {stepIndex === 1 && "2. ISP Resolver"}
            {stepIndex === 2 && "3. Query Root Server (.)"}
            {stepIndex === 3 && "4. Query TLD Server (.com)"}
            {stepIndex === 4 && "5. Query Authoritative DNS"}
            {stepIndex === 5 && "6. Return IP 142.250.190.78"}
            {stepIndex === 6 && "7. Website Loaded ✓"}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono bg-[#18181b] border border-white/10 px-3 py-1.5 rounded-lg">
          <span className="text-zinc-400">Resolved IP:</span>
          <span className="text-emerald-400 font-bold">
            {stepIndex >= 4 ? "142.250.190.78" : "Searching…"}
          </span>
        </div>
      </div>

      {/* ── CENTER STAGE: Clean Visual Diagram with directional arrows ───────── */}
      <div className="relative flex-1 w-full max-w-5xl flex items-center justify-between gap-2 my-4 px-2">
        {NODES.map((node, index) => {
          const isActive =
            (node.id === activeNodeId) ||
            (visualState.currentStepIndex === 0 && node.id === "browser") ||
            (visualState.currentStepIndex === 6 && node.id === "browser");

          const isInspected = node.id === inspectedNode?.id;

          const color =
            node.type === "laptop"
              ? "#fbbf24"
              : node.type === "router"
                ? "#2dd4bf"
                : node.type === "root-server"
                  ? "#60a5fa"
                  : node.type === "tld-server"
                    ? "#fb923c"
                    : "#34d399";

          return (
            <div key={node.id} className="relative flex-1 flex flex-col items-center">
              {/* Connecting Line & Arrow to next node */}
              {index < NODES.length - 1 && (
                <div className="absolute top-10 left-1/2 w-full flex items-center z-0 px-2 pointer-events-none">
                  {/* Line */}
                  <div className="flex-1 h-0.5 bg-zinc-800 relative">
                    {/* Active packet animation */}
                    {index === stepIndex && (
                      <motion.div
                        animate={
                          reduced
                            ? {}
                            : { x: ["0%", "100%"], opacity: [0, 1, 0] }
                        }
                        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-1 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-md shadow-amber-400/80"
                      />
                    )}
                  </div>
                  {/* Directional Arrow */}
                  <span className="text-zinc-600 font-mono text-xs font-bold -ml-1">
                    ➔
                  </span>
                </div>
              )}

              {/* Node Card */}
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className={`z-10 flex flex-col items-center gap-2 p-4 rounded-2xl border w-full max-w-[155px] text-center transition-all ${
                  isActive
                    ? "bg-[#18181b] border-amber-400 shadow-2xl shadow-amber-400/25 ring-2 ring-amber-400/30"
                    : isInspected
                      ? "bg-[#18181b] border-zinc-500"
                      : "bg-[#121214] border-white/10 hover:border-white/20"
                }`}
              >
                {/* SVG Icon */}
                <div className="relative flex items-center justify-center">
                  {node.type === "laptop" && <LaptopSVG active={isActive} />}
                  {node.type === "router" && <RouterSVG active={isActive} />}
                  {(node.type === "root-server" ||
                    node.type === "tld-server" ||
                    node.type === "auth-server") && (
                    <ServerRackSVG active={isActive} color={color} />
                  )}
                  {isActive && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                  )}
                </div>

                {/* Node Title & Subtitle */}
                <div>
                  <p
                    className="text-xs font-bold transition-colors truncate max-w-[130px]"
                    style={{ color: isActive ? "#fbbf24" : "var(--sd-text)" }}
                  >
                    {node.title}
                  </p>
                  <p className="text-[10px] font-mono text-zinc-400 truncate mt-0.5">
                    {node.sub}
                  </p>
                </div>

                {/* IP Badge */}
                <span
                  className="badge badge-xs font-mono text-[9px] border text-zinc-300"
                  style={{
                    backgroundColor: "#18181b",
                    borderColor: `${color}40`,
                  }}
                >
                  {node.ip}
                </span>
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* ── Component Inspector Overlay (Bottom of Visual Stage) ────────────── */}
      <AnimatePresence mode="wait">
        {inspectedNode && (
          <motion.div
            key={inspectedNode.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="z-20 w-full max-w-2xl bg-[#121214] border border-amber-400/40 rounded-xl p-3.5 text-xs flex flex-col gap-1 shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 flex items-center gap-2">
                <span>🔍</span> {inspectedNode.title} [{inspectedNode.sub}]
              </span>
              <span className="badge badge-xs badge-outline font-mono text-zinc-400">
                IP: {inspectedNode.ip}
              </span>
            </div>
            <p className="text-zinc-300 leading-relaxed text-[11px]">
              {inspectedNode.role}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
