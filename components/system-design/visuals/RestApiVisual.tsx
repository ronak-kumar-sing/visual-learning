"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  REST_CONSTRAINTS,
  type RestApiVisualState,
} from "@/lib/system-design/lessons/web-apis/rest-api";

interface RestApiVisualProps {
  visualState: RestApiVisualState;
  accentHex: string;
}

// ── Custom Vector SVG Components (No Emoji Icons) ───────────────────────────
function ClientDeviceCard({ active }: { active?: boolean }) {
  return (
    <motion.div
      animate={{
        scale: active ? 1.04 : 1,
        borderColor: active ? "#2dd4bf" : "rgba(255,255,255,0.1)",
      }}
      transition={{ duration: 0.3 }}
      className={`p-3.5 rounded-xl border bg-[#161616] flex flex-col items-center gap-1.5 text-center min-w-[120px] transition-all ${
        active ? "shadow-lg shadow-teal-400/20 ring-2 ring-teal-400/30" : "hover:border-white/20"
      }`}
    >
      <svg width="40" height="30" viewBox="0 0 44 30" fill="none">
        <rect x="2" y="2" width="40" height="26" rx="3" fill="#18181b" stroke={active ? "#2dd4bf" : "#52525b"} strokeWidth="1.5" />
        <circle cx="6" cy="6" r="1.5" fill="#ef4444" />
        <circle cx="10" cy="6" r="1.5" fill="#f59e0b" />
        <circle cx="14" cy="6" r="1.5" fill="#10b981" />
        <rect x="18" y="4.5" width="20" height="3.5" rx="1" fill="#27272a" />
        <rect x="6" y="11" width="32" height="13" rx="1" fill="#09090b" />
      </svg>
      <div>
        <p className="text-[11px] font-bold font-mono text-zinc-100">REST Client</p>
        <p className="text-[9px] font-mono text-zinc-400">(Web / Mobile App)</p>
      </div>
    </motion.div>
  );
}

function RestServerCard({ active }: { active?: boolean }) {
  return (
    <motion.div
      animate={{
        scale: active ? 1.04 : 1,
        borderColor: active ? "#2dd4bf" : "rgba(255,255,255,0.1)",
      }}
      transition={{ duration: 0.3 }}
      className={`p-3.5 rounded-xl border bg-[#161616] flex flex-col items-center gap-1.5 text-center min-w-[120px] transition-all ${
        active ? "shadow-lg shadow-teal-400/20 ring-2 ring-teal-400/30" : "hover:border-white/20"
      }`}
    >
      <svg width="40" height="36" viewBox="0 0 44 40" fill="none">
        <rect x="4" y="3" width="36" height="10" rx="2" fill="#18181b" stroke="#2dd4bf" strokeWidth="1.5" />
        <circle cx="8" cy="8" r="1.5" fill="#2dd4bf" />
        <line x1="13" y1="8" x2="32" y2="8" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="4" y="15" width="36" height="10" rx="2" fill="#18181b" stroke="#2dd4bf" strokeWidth="1.5" />
        <circle cx="8" cy="20" r="1.5" fill="#2dd4bf" />
        <line x1="13" y1="20" x2="32" y2="20" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="4" y="27" width="36" height="10" rx="2" fill="#18181b" stroke="#2dd4bf" strokeWidth="1.5" />
        <circle cx="8" cy="32" r="1.5" fill="#2dd4bf" />
        <line x1="13" y1="32" x2="32" y2="32" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div>
        <p className="text-[11px] font-bold font-mono text-zinc-100">REST API Server</p>
        <p className="text-[9px] font-mono text-zinc-400">(/api/v1/articles)</p>
      </div>
    </motion.div>
  );
}

export default function RestApiVisual({ visualState, accentHex }: RestApiVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"crud" | "constraints" | "status-codes">("crud");
  const [selectedConstraint, setSelectedConstraint] = useState(REST_CONSTRAINTS[0]);

  const activeMethod = visualState.activeMethod || "GET";
  const activePath = visualState.activePath || "/api/v1/articles/42";
  const statusCode = visualState.statusCode || 200;

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
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-teal-400/30 rounded-2xl px-5 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-teal-400 font-mono tracking-wide flex items-center gap-2">
            <span>🌐</span> REST API Architecture &amp; Resource Operations
          </h2>
          <p className="text-xs text-zinc-400">
            Representational State Transfer · 6 Constraints · Standard HTTP CRUD
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "crud"
                ? "btn-accent bg-teal-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("crud")}
          >
            1. CRUD Simulator
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "constraints"
                ? "btn-accent bg-teal-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("constraints")}
          >
            2. 6 REST Constraints
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "status-codes"
                ? "btn-accent bg-teal-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("status-codes")}
          >
            3. Status Codes Ladder
          </button>
        </div>
      </div>

      {/* ── MODE 1: CRUD SIMULATOR ────────────────────────────────────────── */}
      {tabMode === "crud" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
          {/* Active HTTP Method Bar */}
          <div className="grid grid-cols-4 gap-2 font-mono text-center text-xs">
            {[
              { method: "GET", title: "GET (Read)", sub: "Idempotent & Cacheable" },
              { method: "POST", title: "POST (Create)", sub: "Non-Idempotent" },
              { method: "PUT", title: "PUT (Replace)", sub: "Idempotent" },
              { method: "DELETE", title: "DELETE (Remove)", sub: "Idempotent" },
            ].map((m) => {
              const isActive = activeMethod === m.method;
              return (
                <div
                  key={m.method}
                  className={`p-2 rounded-xl border transition-all ${
                    isActive
                      ? "bg-teal-500/15 border-teal-400 text-teal-300 ring-1 ring-teal-400/30 shadow-lg shadow-teal-400/10"
                      : "bg-[#18181b] border-white/10 text-zinc-400"
                  }`}
                >
                  <p className="font-bold text-[11px]">{m.title}</p>
                  <p className="text-[9px] opacity-80 mt-0.5">{m.sub}</p>
                </div>
              );
            })}
          </div>

          {/* Center Stage Diagram with Animated Flows */}
          <div className="relative flex items-center justify-between gap-4 p-5 bg-[#18181b] border border-white/10 rounded-xl overflow-hidden">
            {/* Left: Client */}
            <ClientDeviceCard active={true} />

            {/* Middle Animated Packet Flow Stage */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 gap-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMethod + activePath}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex flex-col items-center gap-1.5 w-full"
                >
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 font-mono text-xs shadow">
                    <span className="font-bold">{activeMethod}</span>
                    <span className="text-white/90">{activePath}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="badge badge-sm badge-success font-mono font-bold">
                      {statusCode === 200 ? "200 OK" : statusCode === 201 ? "201 Created" : "204 No Content"}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      Content-Type: application/json
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* SVG Connecting Vector Lines with Animated Dashoffset */}
              <svg width="100%" height="12" viewBox="0 0 300 12" fill="none">
                <motion.line
                  x1="0"
                  y1="6"
                  x2="290"
                  y2="6"
                  stroke="#2dd4bf"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  animate={reduced ? {} : { strokeDashoffset: [0, -24] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
                <polygon points="290,2 300,6 290,10" fill="#2dd4bf" />
              </svg>
            </div>

            {/* Right: REST Server */}
            <RestServerCard active={true} />
          </div>

          {/* Response Payload Inspector Box */}
          <div className="p-3 rounded-xl bg-[#161616] border border-white/10 font-mono text-xs flex items-center justify-between">
            <span className="text-zinc-400 text-[11px]">Server Response Payload:</span>
            <code className="text-teal-300 text-[11px] bg-black/60 px-3 py-1 rounded border border-white/5">
              {visualState.responseBody}
            </code>
          </div>
        </div>
      )}

      {/* ── MODE 2: 6 REST CONSTRAINTS ───────────────────────────────────── */}
      {tabMode === "constraints" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          {/* Constraints Selector List */}
          <div className="flex-1 w-full space-y-1.5">
            <h3 className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider mb-2">
              The 6 Architectural Constraints of REST:
            </h3>
            {REST_CONSTRAINTS.map((c) => {
              const isSelected = selectedConstraint.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedConstraint(c)}
                  className={`w-full p-2.5 rounded-xl border text-left font-mono text-xs flex items-center justify-between transition-all ${
                    isSelected
                      ? "bg-[#18181b] border-teal-400 shadow-md shadow-teal-400/10"
                      : "bg-[#161616] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="badge badge-xs badge-accent font-bold font-mono">
                      {c.badge}
                    </span>
                    <span className="text-zinc-200 font-bold">{c.name}</span>
                  </div>
                  <span className="text-zinc-400 text-[11px] truncate max-w-[200px]">
                    {c.summary}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Constraint Detail Card */}
          <div className="w-full md:w-80 bg-[#18181b] border border-teal-400/30 rounded-xl p-4 flex flex-col gap-2.5 font-mono text-xs shadow-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-teal-400">{selectedConstraint.name}</span>
              <span className="badge badge-xs badge-info">{selectedConstraint.badge}</span>
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold mb-0.5">Core Rule:</p>
              <p className="text-[11px] text-zinc-200 leading-relaxed bg-[#09090b] p-2.5 rounded-lg border border-white/5">
                {selectedConstraint.rule}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold mb-0.5">Architectural Benefit:</p>
              <p className="text-[11px] text-teal-300 leading-relaxed">
                {selectedConstraint.benefit}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 3: STATUS CODES LADDER ───────────────────────────────────── */}
      {tabMode === "status-codes" && (
        <div className="z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-5 gap-2.5 font-mono text-xs">
          <div className="bg-[#121214] border border-blue-500/30 rounded-xl p-3 space-y-1">
            <span className="badge badge-xs badge-info font-bold">1xx Informational</span>
            <p className="font-bold text-blue-400 text-[11px]">100 Continue</p>
            <p className="text-[10px] text-zinc-400">Request received, continuing process.</p>
          </div>

          <div className="bg-[#121214] border border-emerald-500/30 rounded-xl p-3 space-y-1">
            <span className="badge badge-xs badge-success font-bold">2xx Success</span>
            <p className="font-bold text-emerald-400 text-[11px]">200 OK · 201 Created · 204 No Content</p>
            <p className="text-[10px] text-zinc-400">Action successfully received and accepted.</p>
          </div>

          <div className="bg-[#121214] border border-amber-500/30 rounded-xl p-3 space-y-1">
            <span className="badge badge-xs badge-warning font-bold">3xx Redirection</span>
            <p className="font-bold text-amber-400 text-[11px]">301 Moved · 304 Not Modified</p>
            <p className="text-[10px] text-zinc-400">Further action needed to complete request.</p>
          </div>

          <div className="bg-[#121214] border border-orange-500/30 rounded-xl p-3 space-y-1">
            <span className="badge badge-xs badge-error font-bold">4xx Client Error</span>
            <p className="font-bold text-orange-400 text-[11px]">400 Bad Req · 401 Auth · 404 Not Found</p>
            <p className="text-[10px] text-zinc-400">Request contains bad syntax or unauthorized.</p>
          </div>

          <div className="bg-[#121214] border border-red-500/30 rounded-xl p-3 space-y-1">
            <span className="badge badge-xs badge-error font-bold">5xx Server Error</span>
            <p className="font-bold text-red-400 text-[11px]">500 Internal · 502 Bad Gateway · 503</p>
            <p className="text-[10px] text-zinc-400">Server failed to fulfill valid request.</p>
          </div>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-teal-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <div>
            <p className="font-bold text-teal-400">Idempotency Rule:</p>
            <p className="text-zinc-300 text-[10px]">GET, PUT, DELETE are idempotent. POST is non-idempotent.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4l3 3" />
          </svg>
          <div>
            <p className="font-bold text-blue-400">Stateless Architecture:</p>
            <p className="text-zinc-300 text-[10px]">Every request holds its own credentials. No session affinity needed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
