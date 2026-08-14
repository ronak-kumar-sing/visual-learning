"use client";

import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import type {
  ClientServerVisualState,
  ClientServerPhase,
} from "@/lib/system-design/lessons/networking/client-server-architecture";

interface ClientServerVisualProps {
  visualState: ClientServerVisualState;
  accentHex: string;
}

// ── Sub-components ─────────────────────────────────────────────────────────

function LaptopIcon({ color, glow }: { color: string; glow: boolean }) {
  return (
    <svg width="72" height="60" viewBox="0 0 72 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {glow && (
        <ellipse cx="36" cy="52" rx="28" ry="6" fill={color} opacity="0.15" />
      )}
      {/* Screen body */}
      <rect x="8" y="4" width="56" height="38" rx="4" fill="#1a1a1a" stroke={color} strokeWidth="1.5" />
      {/* Screen content */}
      <rect x="13" y="9" width="46" height="28" rx="2" fill="#0d0d0d" />
      {/* Screen glow when active */}
      {glow && (
        <rect x="13" y="9" width="46" height="28" rx="2" fill={color} fillOpacity="0.08" />
      )}
      {/* Browser bar */}
      <rect x="15" y="11" width="42" height="5" rx="1.5" fill="#222" />
      <circle cx="18" cy="13.5" r="1.2" fill="#f87171" />
      <circle cx="22" cy="13.5" r="1.2" fill="#fbbf24" />
      <circle cx="26" cy="13.5" r="1.2" fill="#34d399" />
      {/* URL bar */}
      <rect x="30" y="11.5" width="25" height="4" rx="1" fill="#333" />
      {/* Browser content lines */}
      <rect x="15" y="19" width="38" height="2" rx="1" fill="#2a2a2a" />
      <rect x="15" y="23" width="28" height="2" rx="1" fill="#2a2a2a" />
      <rect x="15" y="27" width="33" height="2" rx="1" fill="#2a2a2a" />
      <rect x="15" y="31" width="20" height="2" rx="1" fill="#2a2a2a" />
      {/* Base */}
      <path d="M0 46h72v2a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4v-2z" fill="#1a1a1a" stroke={color} strokeWidth="1.5" />
      {/* Hinge */}
      <path d="M22 44h28" stroke={color} strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

function ServerIcon({ color, pulsing }: { color: string; pulsing: boolean }) {
  return (
    <svg width="64" height="72" viewBox="0 0 64 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {pulsing && (
        <ellipse cx="32" cy="66" rx="22" ry="5" fill={color} opacity="0.2" />
      )}
      {/* Server chassis */}
      <rect x="4" y="6" width="56" height="58" rx="4" fill="#1a1a1a" stroke={color} strokeWidth="1.5" />
      {/* Server units */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x="8"
            y={10 + i * 13}
            width="48"
            height="10"
            rx="2"
            fill="#0d0d0d"
            stroke={color}
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
          {/* Status LED */}
          <circle
            cx="14"
            cy={15 + i * 13}
            r="2"
            fill={i === 0 && pulsing ? color : "#34d399"}
            opacity={i === 0 && pulsing ? 1 : 0.7}
          />
          {/* Drive slots */}
          <rect x="20" y={11.5 + i * 13} width="8" height="7" rx="1" fill="#222" />
          <rect x="30" y={11.5 + i * 13} width="8" height="7" rx="1" fill="#222" />
          {/* Vent lines */}
          {[0, 1, 2].map((v) => (
            <rect
              key={v}
              x={42 + v * 4}
              y={11.5 + i * 13}
              width="2"
              height="7"
              rx="0.5"
              fill="#333"
            />
          ))}
        </g>
      ))}
      {/* Bottom badge */}
      <rect x="8" y="58" width="48" height="3" rx="1.5" fill="#111" />
      <rect x="10" y="59" width="16" height="1" rx="0.5" fill="#333" />
    </svg>
  );
}

function PacketToken({
  label,
  color,
  direction,
  active,
  reduced,
  onHover,
}: {
  label: string;
  color: string;
  direction: "right" | "left";
  active: boolean;
  reduced: boolean;
  onHover?: (hovering: boolean) => void;
}) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={`packet-${direction}`}
          initial={reduced ? { opacity: 1 } : { opacity: 0, x: direction === "right" ? -60 : 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction === "right" ? 60 : -60 }}
          transition={reduced ? { duration: 0 } : { duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          {/* Dashed line */}
          <div className="relative flex items-center w-full px-28">
            <div
              className="flex-1 border-t-2 border-dashed opacity-60"
              style={{ borderColor: color }}
            />
            {/* Packet blob */}
            <div
              onMouseEnter={() => onHover && onHover(true)}
              onMouseLeave={() => onHover && onHover(false)}
              className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-medium shadow-xl pointer-events-auto cursor-pointer transition-transform hover:scale-105"
              style={{
                backgroundColor: "var(--sd-bg, #0a0a0a)",
                borderColor: color,
                color: color,
                boxShadow: `0 0 16px ${color}30`,
              }}
            >
              {direction === "right" ? (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M8 5H2M4.5 2.5L2 5l2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {label}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main Visual ────────────────────────────────────────────────────────────

export default function ClientServerVisual({
  visualState,
  accentHex,
}: ClientServerVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const { phase, requestLabel, responseLabel, statusCode } = visualState;

  const [hoveredNode, setHoveredNode] = useState<"client" | "server" | "packet" | null>(null);

  const clientActive = ["idle", "connecting", "request-fly", "complete"].includes(phase);
  const serverPulsing = phase === "processing";
  const serverActive = ["processing", "response-fly", "complete"].includes(phase);

  const showRequest = phase === "request-fly";
  const showResponse = phase === "response-fly";

  const showConnLine = ["connecting", "request-fly", "processing", "response-fly", "complete"].includes(phase);

  const isComplete = phase === "complete";

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden select-none"
      style={{ backgroundColor: "var(--sd-bg)" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(var(--sd-text) 1px, transparent 1px), linear-gradient(90deg, var(--sd-text) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      {/* Scene */}
      <div className="relative flex items-center justify-center gap-0 w-full max-w-2xl px-8">
        {/* Client node */}
        <div
          className="flex flex-col items-center gap-3 z-10 w-36 cursor-pointer group"
          onMouseEnter={() => setHoveredNode("client")}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <motion.div
            animate={
              reduced
                ? {}
                : {
                    filter: clientActive
                      ? `drop-shadow(0 0 16px ${accentHex}50)`
                      : "drop-shadow(0 0 0 transparent)",
                  }
            }
            transition={{ duration: 0.4 }}
          >
            <LaptopIcon color={accentHex} glow={clientActive} />
          </motion.div>

          <div className="text-center">
            <p className="text-sm font-semibold group-hover:text-amber-400 transition-colors" style={{ color: "var(--sd-text)" }}>
              Client
            </p>
            <p className="text-xs font-mono mt-0.5" style={{ color: "var(--sd-text-faint)" }}>
              browser / app
            </p>
          </div>

          {/* Status badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={phase + "-client"}
              initial={reduced ? {} : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? {} : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="rounded-full px-3 py-1 text-[11px] font-mono"
              style={{
                backgroundColor: isComplete
                  ? "#34d399" + "18"
                  : accentHex + "14",
                color: isComplete ? "#34d399" : accentHex,
                border: `1px solid ${isComplete ? "#34d399" : accentHex}30`,
              }}
            >
              {phase === "idle" && "waiting"}
              {phase === "connecting" && "connecting…"}
              {phase === "request-fly" && "sending →"}
              {phase === "processing" && "waiting…"}
              {phase === "response-fly" && "← receiving"}
              {phase === "complete" && "✓ rendered"}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Connection / packet area */}
        <div className="relative flex-1 h-32 mx-2">
          {/* Static connection line */}
          <AnimatePresence>
            {showConnLine && (
              <motion.div
                key="conn-line"
                initial={reduced ? {} : { scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ opacity: 0 }}
                transition={reduced ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 right-0 flex items-center"
              >
                <div
                  className="w-full h-px"
                  style={{ backgroundColor: accentHex + "30" }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Request packet */}
          <PacketToken
            label={requestLabel || "GET / HTTP/1.1"}
            color={accentHex}
            direction="right"
            active={showRequest}
            reduced={reduced}
            onHover={(h) => setHoveredNode(h ? "packet" : null)}
          />

          {/* Response packet */}
          <PacketToken
            label={responseLabel || "HTTP/1.1 200 OK"}
            color={isComplete ? "#34d399" : accentHex}
            direction="left"
            active={showResponse || isComplete}
            reduced={reduced}
            onHover={(h) => setHoveredNode(h ? "packet" : null)}
          />

          {/* Processing spinner */}
          <AnimatePresence>
            {serverPulsing && (
              <motion.div
                key="spinner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={reduced ? {} : { y: [0, -6, 0] }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.15,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: accentHex }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Server node */}
        <div
          className="flex flex-col items-center gap-3 z-10 w-36 cursor-pointer group"
          onMouseEnter={() => setHoveredNode("server")}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <motion.div
            animate={
              reduced
                ? {}
                : {
                    filter: serverActive
                      ? `drop-shadow(0 0 16px ${accentHex}50)`
                      : "drop-shadow(0 0 0 transparent)",
                    scale: serverPulsing ? [1, 1.04, 1] : 1,
                  }
            }
            transition={
              serverPulsing
                ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.4 }
            }
          >
            <ServerIcon color={accentHex} pulsing={serverPulsing} />
          </motion.div>

          <div className="text-center">
            <p className="text-sm font-semibold group-hover:text-amber-400 transition-colors" style={{ color: "var(--sd-text)" }}>
              Server
            </p>
            <p className="text-xs font-mono mt-0.5" style={{ color: "var(--sd-text-faint)" }}>
              api.example.com
            </p>
          </div>

          {/* Status badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={phase + "-server"}
              initial={reduced ? {} : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? {} : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="rounded-full px-3 py-1 text-[11px] font-mono"
              style={{
                backgroundColor:
                  serverPulsing
                    ? accentHex + "20"
                    : isComplete
                      ? "#34d399" + "18"
                      : "var(--sd-surface-2)",
                color: serverPulsing
                  ? accentHex
                  : isComplete
                    ? "#34d399"
                    : "var(--sd-text-faint)",
                border: `1px solid ${serverPulsing ? accentHex + "40" : isComplete ? "#34d39930" : "var(--sd-border)"}`,
              }}
            >
              {phase === "idle" && "listening"}
              {phase === "connecting" && "accepting"}
              {phase === "request-fly" && "← receiving"}
              {phase === "processing" && "processing…"}
              {phase === "response-fly" && "sending →"}
              {phase === "complete" && "✓ done"}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Hover / Inspector Tooltip Overlay */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-20 z-30 max-w-sm bg-[#161616] border border-amber-400/40 rounded-xl p-3.5 shadow-2xl backdrop-blur-md text-xs"
          >
            {hoveredNode === "client" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-amber-400">Client Node</span>
                  <span className="badge badge-xs badge-warning font-mono">Frontend</span>
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  Initiates outbound connections, constructs HTTP headers, handles user interactions, and renders HTML/CSS/JS payloads returned by the server.
                </p>
              </div>
            )}
            {hoveredNode === "server" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-amber-400">Server Node</span>
                  <span className="badge badge-xs badge-accent font-mono">Backend</span>
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  Listens on port 443, parses incoming HTTP requests, executes business logic, queries database tables, and returns formatted HTTP responses.
                </p>
              </div>
            )}
            {hoveredNode === "packet" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-amber-400">HTTP Packet</span>
                  <span className="badge badge-xs badge-success font-mono">Network Payload</span>
                </div>
                <p className="text-zinc-300 leading-relaxed font-mono">
                  Payload: {requestLabel || responseLabel || "HTTP/1.1 200 OK"}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HTTP Status chip — bottom center */}
      <AnimatePresence>
        {statusCode !== "—" && statusCode !== "" && (
          <motion.div
            key={statusCode}
            initial={reduced ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-mono font-semibold border"
            style={{
              backgroundColor: "var(--sd-bg, #0a0a0a)",
              borderColor: "#34d39960",
              color: "#34d399",
              boxShadow: "0 0 12px rgba(52, 211, 153, 0.2)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {statusCode}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase label — top center */}
      <div
        className="absolute top-5 left-1/2 -translate-x-1/2 text-xs font-mono uppercase tracking-widest"
        style={{ color: "var(--sd-text-faint)" }}
      >
        {phaseLabel(phase)}
      </div>
    </div>
  );
}

function phaseLabel(phase: ClientServerPhase): string {
  switch (phase) {
    case "idle": return "— idle —";
    case "connecting": return "TCP handshake";
    case "request-fly": return "HTTP request →";
    case "processing": return "server processing";
    case "response-fly": return "← HTTP response";
    case "complete": return "complete";
  }
}
