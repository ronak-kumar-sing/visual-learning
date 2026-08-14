"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type {
  HttpHttpsVisualState,
  HttpsPhase,
} from "@/lib/system-design/lessons/web-apis/http-https";

interface HttpHttpsVisualProps {
  visualState: HttpHttpsVisualState;
  accentHex: string;
}

// ── Custom Vector SVG Components with Animated Glows ────────────────────────
function WebBrowserCard({ active, secured }: { active?: boolean; secured?: boolean }) {
  return (
    <motion.div
      animate={{
        scale: active ? 1.05 : 1,
        borderColor: active ? (secured ? "#34d399" : "#f87171") : "rgba(255,255,255,0.1)",
      }}
      transition={{ duration: 0.3 }}
      className={`p-3.5 rounded-xl border bg-[#161616] flex flex-col items-center gap-1.5 transition-all text-center min-w-[120px] ${
        active
          ? secured
            ? "shadow-lg shadow-emerald-400/20 ring-2 ring-emerald-400/30"
            : "shadow-lg shadow-red-400/20 ring-2 ring-red-400/30"
          : "hover:border-white/20"
      }`}
    >
      <svg width="44" height="30" viewBox="0 0 44 30" fill="none">
        <rect x="2" y="2" width="40" height="26" rx="3" fill="#18181b" stroke={secured ? "#34d399" : "#f87171"} strokeWidth="1.5" />
        <circle cx="6" cy="6" r="1.5" fill="#ef4444" />
        <circle cx="10" cy="6" r="1.5" fill="#f59e0b" />
        <circle cx="14" cy="6" r="1.5" fill="#10b981" />
        <rect x="18" y="4.5" width="20" height="3.5" rx="1" fill="#27272a" />
        <rect x="6" y="11" width="32" height="13" rx="1" fill="#09090b" />
      </svg>
      <div>
        <p className="text-[11px] font-bold font-mono text-zinc-100">Web Browser</p>
        <p className="text-[9px] font-mono text-zinc-400">(User Client)</p>
      </div>
    </motion.div>
  );
}

function WebServerCard({ active, secured }: { active?: boolean; secured?: boolean }) {
  const color = secured ? "#34d399" : "#f87171";
  return (
    <motion.div
      animate={{
        scale: active ? 1.05 : 1,
        borderColor: active ? color : "rgba(255,255,255,0.1)",
      }}
      transition={{ duration: 0.3 }}
      className={`p-3.5 rounded-xl border bg-[#161616] flex flex-col items-center gap-1.5 text-center min-w-[120px] transition-all ${
        active ? `shadow-lg shadow-${secured ? "emerald" : "red"}-400/20 ring-2 ring-${secured ? "emerald" : "red"}-400/30` : "hover:border-white/30"
      }`}
    >
      <svg width="40" height="36" viewBox="0 0 44 40" fill="none">
        <rect x="4" y="3" width="36" height="10" rx="2" fill="#18181b" stroke={color} strokeWidth="1.5" />
        <circle cx="8" cy="8" r="1.5" fill={color} />
        <line x1="13" y1="8" x2="32" y2="8" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="4" y="15" width="36" height="10" rx="2" fill="#18181b" stroke={color} strokeWidth="1.5" />
        <circle cx="8" cy="20" r="1.5" fill={color} />
        <line x1="13" y1="20" x2="32" y2="20" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="4" y="27" width="36" height="10" rx="2" fill="#18181b" stroke={color} strokeWidth="1.5" />
        <circle cx="8" cy="32" r="1.5" fill={color} />
        <line x1="13" y1="32" x2="32" y2="32" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div>
        <p className="text-[11px] font-bold font-mono text-zinc-100">Web Server</p>
        <p className="text-[9px] font-mono text-zinc-400">(Origin Host)</p>
      </div>
    </motion.div>
  );
}

function ThreatActorIcon({ type }: { type: "forgery" | "theft" | "eavesdrop" }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.5">
        <path d="M12 2a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5zM9 7a3 3 0 0 1 6 0v3H9V7z" />
      </svg>
      <span className="text-[9px] font-mono text-red-400 font-medium">
        {type === "forgery" && "Message Forgery"}
        {type === "theft" && "Data Theft"}
        {type === "eavesdrop" && "Eavesdropping"}
      </span>
    </div>
  );
}

export default function HttpHttpsVisual({ visualState, accentHex }: HttpHttpsVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [viewMode, setViewMode] = useState<"handshake" | "comparison">("handshake");

  const activePhase = visualState.phase || "tcp-handshake";

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
            <span>🔐</span> HTTP vs HTTPS &amp; Working of HTTPS (TLS Handshake)
          </h2>
          <p className="text-xs text-zinc-400">
            Plaintext vulnerability vs 4-Phase TLS Security Pipeline
          </p>
        </div>

        {/* View Mode Join Toggle */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              viewMode === "handshake"
                ? "btn-accent bg-emerald-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setViewMode("handshake")}
          >
            Working of HTTPS (4 Phases)
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              viewMode === "comparison"
                ? "btn-accent bg-emerald-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setViewMode("comparison")}
          >
            HTTP vs HTTPS Comparison
          </button>
        </div>
      </div>

      {/* ── VIEW MODE 1: WORKING OF HTTPS (TLS HANDSHAKE PIPELINE) ───────── */}
      {viewMode === "handshake" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
          {/* Phase Indicators Bar */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "tcp-handshake", num: 1, title: "1. TCP Handshake", sub: "SYN, SYN+ACK, ACK" },
              { id: "certificate-check", num: 2, title: "2. Certificate Check", sub: "Public Key 🗝️ Exchanged" },
              { id: "key-exchange", num: 3, title: "3. Key Exchange", sub: "Encrypted Session Key" },
              { id: "data-transmission", num: 4, title: "4. Data Transmission", sub: "Symmetric Encryption" },
            ].map((p) => {
              const isActive = activePhase === p.id;
              return (
                <div
                  key={p.id}
                  className={`p-2 rounded-xl border text-center font-mono transition-all ${
                    isActive
                      ? "bg-emerald-500/15 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400/30 shadow-lg shadow-emerald-400/10"
                      : "bg-[#18181b] border-white/10 text-zinc-400"
                  }`}
                >
                  <p className="text-[11px] font-bold">{p.title}</p>
                  <p className="text-[9px] opacity-80 mt-0.5">{p.sub}</p>
                </div>
              );
            })}
          </div>

          {/* Center Stage Diagram: Client <---> Server with Animated Packets */}
          <div className="relative flex items-center justify-between gap-4 p-5 bg-[#18181b] border border-white/10 rounded-xl overflow-hidden">
            {/* Left: Client */}
            <WebBrowserCard active={true} secured={activePhase === "data-transmission"} />

            {/* Middle Animated Packet Flow Stage */}
            <div className="relative flex-1 flex flex-col items-center justify-center px-4 gap-3 min-h-[140px]">
              <AnimatePresence mode="wait">
                {/* Phase 1: TCP Handshake Packets */}
                {activePhase === "tcp-handshake" && (
                  <motion.div
                    key="p1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center gap-1.5 w-full"
                  >
                    <motion.div
                      animate={reduced ? {} : { x: [-10, 10, -10] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 font-mono text-[10px] flex items-center gap-2 shadow"
                    >
                      <span>➔ Client: TCP SYN</span>
                    </motion.div>
                    <motion.div
                      animate={reduced ? {} : { x: [10, -10, 10] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] flex items-center gap-2 shadow"
                    >
                      <span>⬅ Server: TCP SYN+ACK</span>
                    </motion.div>
                    <motion.div
                      animate={reduced ? {} : { x: [-10, 10, -10] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 font-mono text-[10px] flex items-center gap-2 shadow"
                    >
                      <span>➔ Client: TCP ACK</span>
                    </motion.div>
                    <span className="badge badge-xs badge-success font-mono text-[9px] mt-1">
                      Raw TCP Connection Established
                    </span>
                  </motion.div>
                )}

                {/* Phase 2: Certificate Check */}
                {activePhase === "certificate-check" && (
                  <motion.div
                    key="p2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center gap-1.5 w-full"
                  >
                    <div className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 font-mono text-[10px]">
                      ➔ Client Hello (TLS 1.3 / Cipher Suites)
                    </div>
                    <motion.div
                      animate={reduced ? {} : { scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] shadow-md shadow-emerald-500/10"
                    >
                      ⬅ Server Hello &amp; TLS Certificate (Public Key 🗝️)
                    </motion.div>
                    <div className="px-3.5 py-1 rounded bg-black/50 border border-emerald-400/40 text-emerald-300 font-mono text-[10px] text-center">
                      Client verifies Certificate Signature with Certificate Authority (CA)
                    </div>
                  </motion.div>
                )}

                {/* Phase 3: Key Exchange */}
                {activePhase === "key-exchange" && (
                  <motion.div
                    key="p3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center gap-1.5 w-full"
                  >
                    <motion.div
                      animate={reduced ? {} : { x: [-15, 15, -15] }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                      className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] shadow"
                    >
                      ➔ Client Key Exchange (Encrypted Session Key 🔑)
                    </motion.div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px]">
                      ⬅ Change Cipher Spec &amp; Finished
                    </div>
                    <div className="px-3.5 py-1 rounded bg-black/50 border border-amber-400/40 text-amber-300 font-mono text-[10px] text-center">
                      Server decrypts Session Key 🔑 using its Private Key 🗝️
                    </div>
                  </motion.div>
                )}

                {/* Phase 4: Encrypted Data Transmission */}
                {activePhase === "data-transmission" && (
                  <motion.div
                    key="p4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center gap-2 w-full"
                  >
                    <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400 text-emerald-300 font-mono text-xs shadow-lg shadow-emerald-400/10">
                      <span>🔒 Encrypted HTTP Payload</span>
                      <motion.span
                        animate={reduced ? {} : { rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8 }}
                        className="badge badge-sm badge-success font-bold"
                      >
                        Session Key 🔑 Active
                      </motion.span>
                      <span>Encrypted Data ➔</span>
                    </div>
                    <p className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <span>✓</span> Symmetric AES-GCM / ChaCha20 Stream Active
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SVG Connecting Vector Lines with Animated Dashoffset */}
              <svg width="100%" height="12" viewBox="0 0 300 12" fill="none">
                <motion.line
                  x1="0"
                  y1="6"
                  x2="290"
                  y2="6"
                  stroke="#34d399"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  animate={reduced ? {} : { strokeDashoffset: [0, -24] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
                <polygon points="290,2 300,6 290,10" fill="#34d399" />
              </svg>
            </div>

            {/* Right: Server */}
            <WebServerCard active={true} secured={activePhase === "data-transmission"} />
          </div>
        </div>
      )}

      {/* ── VIEW MODE 2: HTTP VS HTTPS COMPARISON ──────────────────────────── */}
      {viewMode === "comparison" && (
        <div className="z-10 w-full max-w-5xl flex flex-col gap-4">
          {/* HTTP Row (Unencrypted - Not Secure) */}
          <div className="bg-[#121214] border border-red-500/30 rounded-2xl p-4 flex flex-col gap-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-md bg-red-500 text-white font-mono font-bold text-xs">
                HTTP (Port 80)
              </span>
              <div className="flex items-center gap-4">
                <ThreatActorIcon type="forgery" />
                <ThreatActorIcon type="theft" />
                <ThreatActorIcon type="eavesdrop" />
                <span className="badge badge-error font-mono text-xs text-white">Not Secure</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 p-3 bg-[#18181b] border border-red-500/20 rounded-xl">
              <WebBrowserCard active={false} secured={false} />
              <div className="flex-1 flex flex-col items-center">
                <span className="text-red-400 font-mono text-xs font-bold mb-1">
                  http://yoursite.com (Plaintext Data)
                </span>
                <svg width="100%" height="10" viewBox="0 0 200 10" fill="none">
                  <motion.line
                    x1="0"
                    y1="5"
                    x2="190"
                    y2="5"
                    stroke="#f87171"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    animate={reduced ? {} : { strokeDashoffset: [0, -16] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  />
                  <polygon points="190,1 200,5 190,9" fill="#f87171" />
                </svg>
              </div>
              <WebServerCard active={false} secured={false} />
            </div>

            <div className="bg-red-500/10 border border-red-500/40 p-2 rounded-lg text-center text-xs font-mono text-red-300">
              🚨 Data such as user password and user ID is <strong>Visible To Anyone</strong> on the network wire.
            </div>
          </div>

          {/* HTTPS Row (Encrypted - Secured) */}
          <div className="bg-[#121214] border border-emerald-500/30 rounded-2xl p-4 flex flex-col gap-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-md bg-emerald-500 text-black font-mono font-bold text-xs">
                HTTPS (Port 443)
              </span>
              <span className="badge badge-success font-mono text-xs text-black font-bold">
                Secured ✓
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 p-3 bg-[#18181b] border border-emerald-500/20 rounded-xl">
              <WebBrowserCard active={true} secured={true} />
              <div className="flex-1 flex flex-col items-center">
                <span className="text-emerald-400 font-mono text-xs font-bold mb-1">
                  🔒 https://yoursite.com (SSL/TLS Encrypted)
                </span>
                <svg width="100%" height="10" viewBox="0 0 200 10" fill="none">
                  <motion.line
                    x1="0"
                    y1="5"
                    x2="190"
                    y2="5"
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    animate={reduced ? {} : { strokeDashoffset: [0, -16] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  />
                  <polygon points="190,1 200,5 190,9" fill="#34d399" />
                </svg>
              </div>
              <WebServerCard active={true} secured={true} />
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/40 p-2 rounded-lg text-center text-xs font-mono text-emerald-300">
              🛡️ Data such as user password and user ID is <strong>Encrypted</strong> with symmetric Session Key 🔑.
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM SUMMARY BAR ────────────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-red-500/30 p-2.5 rounded-lg">
          <p className="font-bold text-red-400">HTTP (Port 80):</p>
          <p className="text-zinc-300 text-[10px]">Plaintext transmission. Vulnerable to forgery, theft, and eavesdropping.</p>
        </div>
        <div className="bg-[#18181b] border border-emerald-400/30 p-2.5 rounded-lg">
          <p className="font-bold text-emerald-400">HTTPS (Port 443):</p>
          <p className="text-zinc-300 text-[10px]">HTTP over TLS. Uses Asymmetric key exchange + Symmetric Session Key encryption.</p>
        </div>
      </div>
    </div>
  );
}
