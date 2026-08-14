"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  PROTOCOL_COMPARISONS,
  type RealTimeProtocol,
  type WebsocketsVisualState,
} from "@/lib/system-design/lessons/realtime/websockets";

interface WebsocketsVisualProps {
  visualState: WebsocketsVisualState;
  accentHex: string;
}

export default function WebsocketsVisual({
  visualState,
  accentHex,
}: WebsocketsVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"simulator" | "handshake" | "chat">("simulator");
  const [selectedProto, setSelectedProto] = useState<RealTimeProtocol>(
    visualState.selectedProtocol || "websocket"
  );
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: "Server", text: "Connected to WebSocket Gateway #4", time: "12:00:01" },
    { sender: "Client", text: "JOIN room:general", time: "12:00:02" },
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");

  const activeProtoDetail =
    PROTOCOL_COMPARISONS.find((p) => p.id === selectedProto) || PROTOCOL_COMPARISONS[3];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const clientMsg = { sender: "Client", text: inputMessage, time: "Just now" };
    setChatMessages((prev) => [...prev, clientMsg]);
    setInputMessage("");

    setTimeout(() => {
      const serverReply = {
        sender: "Server",
        text: `ACK: "${clientMsg.text}" broadcast to 12 room peers (<1ms)`,
        time: "Just now",
      };
      setChatMessages((prev) => [...prev, serverReply]);
    }, 400);
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
            <span>⚡</span> WebSockets &amp; Real-Time Streaming Architecture
          </h2>
          <p className="text-xs text-zinc-400">
            Full-Duplex TCP Sockets · HTTP 101 Handshake · SSE vs Polling vs WebSockets
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
            1. Protocol Simulator
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "handshake"
                ? "btn-accent bg-green-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("handshake")}
          >
            2. HTTP 101 Handshake
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "chat"
                ? "btn-accent bg-green-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("chat")}
          >
            3. Bidirectional Chat
          </button>
        </div>
      </div>

      {/* ── MODE 1: PROTOCOL SIMULATOR ────────────────────────────────────── */}
      {tabMode === "simulator" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl font-mono text-xs">
          {/* Protocol Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
            <span className="text-zinc-300 font-bold">Select Real-Time Mechanism:</span>
            <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
              {PROTOCOL_COMPARISONS.map((proto) => (
                <button
                  key={proto.id}
                  onClick={() => setSelectedProto(proto.id)}
                  className={`join-item btn btn-xs font-mono ${
                    selectedProto === proto.id
                      ? "btn-accent bg-green-400 text-black font-bold"
                      : "btn-ghost text-zinc-400"
                  }`}
                >
                  {proto.name}
                </button>
              ))}
            </div>
          </div>

          {/* Diagram Flow */}
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-[#18181b] border border-white/10 rounded-xl">
            {/* Client Node */}
            <div className="p-3.5 rounded-xl border border-white/10 bg-[#161616] flex flex-col items-center gap-1.5 min-w-[130px] text-center shadow">
              <svg width="36" height="30" viewBox="0 0 44 30" fill="none">
                <rect x="2" y="2" width="40" height="26" rx="3" fill="#18181b" stroke="#4ade80" strokeWidth="1.5" />
                <circle cx="6" cy="6" r="1.5" fill="#ef4444" />
                <circle cx="10" cy="6" r="1.5" fill="#f59e0b" />
                <circle cx="14" cy="6" r="1.5" fill="#10b981" />
                <rect x="6" y="11" width="32" height="13" rx="1" fill="#09090b" />
              </svg>
              <p className="text-[11px] font-bold text-zinc-100">Browser Client</p>
              <span className="badge badge-xs badge-success text-black font-bold">
                {selectedProto === "websocket" ? "ws:// Connected" : "HTTP Client"}
              </span>
            </div>

            {/* Middle Packet Stream (Animated) */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-green-400 font-bold">{activeProtoDetail.direction}</span>
              </div>
              <svg width="120" height="16" viewBox="0 0 120 16" fill="none">
                <motion.line
                  x1="0"
                  y1="8"
                  x2="110"
                  y2="8"
                  stroke="#4ade80"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  animate={reduced ? {} : { strokeDashoffset: [0, -24] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                />
                <polygon points="110,4 120,8 110,12" fill="#4ade80" />
              </svg>
              <span className="text-[9px] text-zinc-400">{activeProtoDetail.overhead}</span>
            </div>

            {/* Server Node */}
            <div className="p-4 rounded-2xl border border-green-400 bg-[#161616] flex flex-col items-center text-center gap-2 shadow-xl shadow-green-400/10 min-w-[150px]">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#4ade80" strokeWidth="2">
                <rect x="6" y="6" width="28" height="28" rx="4" />
                <line x1="6" y1="16" x2="34" y2="16" />
                <circle cx="12" cy="11" r="1.5" fill="#4ade80" />
              </svg>
              <div>
                <p className="text-xs font-bold text-green-400">WebSocket Server</p>
                <span className="badge badge-xs badge-ghost text-zinc-400 mt-0.5">
                  100k Concurrent Sockets
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">{activeProtoDetail.latency}</p>
            </div>
          </div>

          {/* Active Detail Banner */}
          <div className="p-3.5 rounded-xl bg-[#161616] border border-green-400/20 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-green-400">{activeProtoDetail.name}</span>
              <span className="badge badge-xs badge-success text-black font-bold">{activeProtoDetail.badge}</span>
            </div>
            <p className="text-zinc-300 text-[11px]"><strong>Best Use Case:</strong> {activeProtoDetail.bestFor}</p>
          </div>
        </div>
      )}

      {/* ── MODE 2: HTTP 101 HANDSHAKE ────────────────────────────────────── */}
      {tabMode === "handshake" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-green-400">WebSocket Protocol Switch Handshake:</span>
            <span className="badge badge-xs badge-success text-black font-bold">RFC 6455 Spec</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#18181b] border border-white/10 space-y-2">
              <span className="badge badge-xs badge-info font-bold">1. Client Request (HTTP GET Upgrade)</span>
              <pre className="p-2.5 rounded bg-black/60 text-[10px] text-blue-300 overflow-x-auto">
{`GET /chat HTTP/1.1
Host: api.app.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZQ==
Sec-WebSocket-Version: 13`}
              </pre>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-green-400/30 space-y-2">
              <span className="badge badge-xs badge-success text-black font-bold">2. Server 101 Response (Switching)</span>
              <pre className="p-2.5 rounded bg-black/60 text-[10px] text-green-300 overflow-x-auto">
{`HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9k...

// TCP socket remains open forever!`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 3: BIDIRECTIONAL CHAT SIMULATOR ──────────────────────────── */}
      {tabMode === "chat" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-3 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-green-400">Full-Duplex WebSocket Frame Stream:</span>
            <span className="badge badge-xs badge-success text-black font-bold">2-Byte Binary Frame</span>
          </div>

          {/* Messages Feed */}
          <div className="h-40 overflow-y-auto bg-[#18181b] p-3 rounded-xl border border-white/10 space-y-2">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === "Client" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`p-2 rounded-lg max-w-[80%] text-[11px] ${
                    msg.sender === "Client"
                      ? "bg-green-500/20 border border-green-400 text-green-200"
                      : "bg-[#27272a] text-zinc-200 border border-white/5"
                  }`}
                >
                  <span className="font-bold text-[9px] opacity-75 mr-1">{msg.sender}:</span>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type instant frame message..."
              className="input input-sm flex-1 bg-[#18181b] border border-white/10 text-zinc-100 font-mono text-xs"
            />
            <button
              onClick={handleSendMessage}
              className="btn btn-sm btn-accent bg-green-400 text-black font-bold font-mono"
            >
              Push Frame ➔
            </button>
          </div>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-green-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <div>
            <p className="font-bold text-green-400">Zero HTTP Polling Waste:</p>
            <p className="text-zinc-300 text-[10px]">A single persistent TCP socket replaces thousands of wasteful HTTP polling calls.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          </svg>
          <div>
            <p className="font-bold text-blue-400">SSE vs WebSockets:</p>
            <p className="text-zinc-300 text-[10px]">Use SSE for server-to-client feeds (Stock prices); Use WebSockets for two-way chat &amp; gaming.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
