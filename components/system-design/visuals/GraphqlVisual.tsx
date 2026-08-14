"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  USER_SCHEMA_FIELDS,
  type GraphqlVisualState,
} from "@/lib/system-design/lessons/web-apis/graphql";

interface GraphqlVisualProps {
  visualState: GraphqlVisualState;
  accentHex: string;
}

// ── Custom Vector SVG Components (No Emoji Icons) ───────────────────────────
function GraphqlClientCard({ active }: { active?: boolean }) {
  return (
    <motion.div
      animate={{
        scale: active ? 1.04 : 1,
        borderColor: active ? "#e879f9" : "rgba(255,255,255,0.1)",
      }}
      transition={{ duration: 0.3 }}
      className={`p-3.5 rounded-xl border bg-[#161616] flex flex-col items-center gap-1.5 text-center min-w-[120px] transition-all ${
        active ? "shadow-lg shadow-fuchsia-400/20 ring-2 ring-fuchsia-400/30" : "hover:border-white/20"
      }`}
    >
      <svg width="40" height="30" viewBox="0 0 44 30" fill="none">
        <rect x="2" y="2" width="40" height="26" rx="3" fill="#18181b" stroke={active ? "#e879f9" : "#52525b"} strokeWidth="1.5" />
        <circle cx="6" cy="6" r="1.5" fill="#ef4444" />
        <circle cx="10" cy="6" r="1.5" fill="#f59e0b" />
        <circle cx="14" cy="6" r="1.5" fill="#10b981" />
        <rect x="18" y="4.5" width="20" height="3.5" rx="1" fill="#27272a" />
        <rect x="6" y="11" width="32" height="13" rx="1" fill="#09090b" />
      </svg>
      <div>
        <p className="text-[11px] font-bold font-mono text-zinc-100">GraphQL Client</p>
        <p className="text-[9px] font-mono text-zinc-400">(Query Specifier)</p>
      </div>
    </motion.div>
  );
}

function GraphqlEngineCard({ active }: { active?: boolean }) {
  return (
    <motion.div
      animate={{
        scale: active ? 1.04 : 1,
        borderColor: active ? "#e879f9" : "rgba(255,255,255,0.1)",
      }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-2xl border bg-[#18181b] flex flex-col items-center text-center gap-2 shadow-xl min-w-[130px] transition-all ${
        active ? "ring-2 ring-fuchsia-400/20 shadow-fuchsia-400/15" : "hover:border-white/20"
      }`}
    >
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
        <polygon points="20,4 35,13 35,31 20,38 5,31 5,13" stroke="#e879f9" strokeWidth="2" fill="#18181b" />
        <circle cx="20" cy="20" r="4" fill="#e879f9" />
        <line x1="20" y1="4" x2="20" y2="16" stroke="#e879f9" strokeWidth="1.5" />
        <line x1="5" y1="13" x2="16" y2="18" stroke="#e879f9" strokeWidth="1.5" />
        <line x1="35" y1="13" x2="24" y2="18" stroke="#e879f9" strokeWidth="1.5" />
      </svg>
      <div>
        <p className="text-xs font-bold font-mono text-fuchsia-400">GraphQL Engine</p>
        <p className="text-[10px] font-mono text-zinc-400 mt-0.5">AST Schema Resolver</p>
      </div>
    </motion.div>
  );
}

function GraphqlDbCard({ active }: { active?: boolean }) {
  return (
    <motion.div
      animate={{
        scale: active ? 1.04 : 1,
        borderColor: active ? "#60a5fa" : "rgba(255,255,255,0.1)",
      }}
      transition={{ duration: 0.3 }}
      className={`p-3.5 rounded-xl border bg-[#161616] flex flex-col items-center gap-1.5 text-center min-w-[120px] transition-all ${
        active ? "shadow-lg shadow-blue-400/20 ring-2 ring-blue-400/30" : "hover:border-white/20"
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
        <p className="text-[11px] font-bold font-mono text-zinc-100">Databases / Microservices</p>
        <p className="text-[9px] font-mono text-zinc-400">(Data Sources)</p>
      </div>
    </motion.div>
  );
}

export default function GraphqlVisual({ visualState, accentHex }: GraphqlVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"builder" | "comparison" | "operations">("builder");
  const [activeFields, setActiveFields] = useState<string[]>(
    visualState.selectedFields && visualState.selectedFields.length > 0
      ? visualState.selectedFields
      : ["id", "name"]
  );

  const toggleField = (id: string) => {
    setActiveFields((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Generate dynamic JSON object based on active fields
  const dynamicResponse: Record<string, unknown> = {};
  activeFields.forEach((fId) => {
    const item = USER_SCHEMA_FIELDS.find((f) => f.id === fId);
    if (item) dynamicResponse[item.name] = item.sampleValue;
  });

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
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-fuchsia-400/30 rounded-2xl px-5 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-fuchsia-400 font-mono tracking-wide flex items-center gap-2">
            <span>⚡</span> GraphQL Architecture &amp; Precision Fetching
          </h2>
          <p className="text-xs text-zinc-400">
            Ask for exactly what you need · Single Endpoint /graphql · Zero Over/Under-fetching
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "builder"
                ? "btn-accent bg-fuchsia-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("builder")}
          >
            1. Query Builder
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "comparison"
                ? "btn-accent bg-fuchsia-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("comparison")}
          >
            2. REST vs GraphQL
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "operations"
                ? "btn-accent bg-fuchsia-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("operations")}
          >
            3. Operations Matrix
          </button>
        </div>
      </div>

      {/* ── MODE 1: INTERACTIVE QUERY BUILDER ──────────────────────────────── */}
      {tabMode === "builder" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
          {/* Top Field Selector Pills */}
          <div>
            <p className="text-[11px] font-mono font-bold text-zinc-300 mb-2">
              Select User Schema Fields to Fetch:
            </p>
            <div className="flex flex-wrap gap-2">
              {USER_SCHEMA_FIELDS.map((f) => {
                const isSelected = activeFields.includes(f.id);
                return (
                  <button
                    key={f.id}
                    onClick={() => toggleField(f.id)}
                    className={`px-3 py-1 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? "bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-300 shadow"
                        : "bg-[#18181b] border-white/10 text-zinc-400 hover:border-white/20"
                    }`}
                  >
                    <span>{isSelected ? "✓" : "+"}</span>
                    <span className="font-bold">{f.name}</span>
                    <span className="text-[10px] opacity-60">({f.type})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center Stage Diagram with Live Query and Response */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-[#18181b] border border-white/10 rounded-xl">
            {/* Left: Client Query AST */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-mono font-bold text-fuchsia-400">
                Client Query (POST /graphql)
              </span>
              <pre className="p-3 rounded-lg bg-[#09090b] border border-white/10 text-fuchsia-300 text-xs font-mono leading-relaxed overflow-x-auto">
{`query GetUser {
  user(id: 101) {
${activeFields.map((f) => `    ${f}`).join("\n")}
  }
}`}
              </pre>
            </div>

            {/* Middle: Schema Engine Execution with Animated Flow */}
            <div className="flex flex-col items-center justify-center p-2 gap-2">
              <GraphqlEngineCard active={true} />
              <svg width="100%" height="12" viewBox="0 0 160 12" fill="none">
                <motion.line
                  x1="0"
                  y1="6"
                  x2="150"
                  y2="6"
                  stroke="#e879f9"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  animate={reduced ? {} : { strokeDashoffset: [0, -16] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                />
                <polygon points="150,2 160,6 150,10" fill="#e879f9" />
              </svg>
              <span className="badge badge-xs badge-success font-mono text-[9px]">
                {activeFields.length} Fields Resolved
              </span>
            </div>

            {/* Right: Server Response JSON */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-mono font-bold text-emerald-400">
                Exact Returned JSON (Zero Over-fetching)
              </span>
              <pre className="p-3 rounded-lg bg-[#09090b] border border-white/10 text-emerald-300 text-xs font-mono leading-relaxed overflow-x-auto">
{JSON.stringify({ data: { user: dynamicResponse } }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 2: REST VS GRAPHQL COMPARISON ────────────────────────────── */}
      {tabMode === "comparison" && (
        <div className="z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* REST Card */}
          <div className="bg-[#121214] border border-red-500/30 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="badge badge-error font-bold text-white">REST API</span>
              <span className="text-red-400 text-[10px]">Over-fetching &amp; Under-fetching</span>
            </div>
            <div className="p-3 rounded-xl bg-[#18181b] border border-red-500/20 space-y-2">
              <p className="text-zinc-300 text-[11px]">
                🚨 <strong>Over-fetching:</strong> <code className="text-red-300">GET /users/1</code> returns 30 fields when you only need <code className="text-zinc-200">name</code>.
              </p>
              <p className="text-zinc-300 text-[11px]">
                🚨 <strong>Under-fetching:</strong> Requires 3 sequential roundtrips (<code className="text-red-300">/users/1</code> ➔ <code className="text-red-300">/posts</code> ➔ <code className="text-red-300">/comments</code>).
              </p>
            </div>
            <div className="bg-red-500/10 border border-red-500/40 p-2 rounded-lg text-center text-red-300 text-[10px]">
              Fixed response formats predefined by backend endpoints.
            </div>
          </div>

          {/* GraphQL Card */}
          <div className="bg-[#121214] border border-emerald-500/30 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="badge badge-success font-bold text-black">GraphQL</span>
              <span className="text-emerald-400 text-[10px]">Precision Declarative Fetching</span>
            </div>
            <div className="p-3 rounded-xl bg-[#18181b] border border-emerald-500/20 space-y-2">
              <p className="text-zinc-300 text-[11px]">
                🛡️ <strong>Zero Over-fetching:</strong> Client queries exactly the required fields. Zero wasted bandwidth.
              </p>
              <p className="text-zinc-300 text-[11px]">
                🛡️ <strong>Zero Under-fetching:</strong> Single roundtrip to <code className="text-emerald-300">POST /graphql</code> resolves nested relationships in one shot.
              </p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/40 p-2 rounded-lg text-center text-emerald-300 text-[10px]">
              Client-driven schema contract validated by strong AST types.
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 3: OPERATIONS MATRIX ─────────────────────────────────────── */}
      {tabMode === "operations" && (
        <div className="z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="bg-[#121214] border border-fuchsia-400/30 rounded-xl p-3.5 space-y-2">
            <span className="badge badge-xs badge-secondary font-bold">1. Queries (Reads)</span>
            <p className="font-bold text-fuchsia-400 text-xs">Fetch Data Precision</p>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              Read-only operations. Analogous to HTTP GET but fully customizable.
            </p>
            <pre className="p-2 rounded bg-black/60 text-fuchsia-300 text-[9px]">
{`query {
  user(id: 101) { name }
}`}
            </pre>
          </div>

          <div className="bg-[#121214] border border-amber-400/30 rounded-xl p-3.5 space-y-2">
            <span className="badge badge-xs badge-warning font-bold">2. Mutations (Writes)</span>
            <p className="font-bold text-amber-400 text-xs">Modify &amp; Return Data</p>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              Performs Create, Update, Delete and returns the updated state immediately.
            </p>
            <pre className="p-2 rounded bg-black/60 text-amber-300 text-[9px]">
{`mutation {
  updateUser(id: 101, name: "Sarah") {
    id, name
  }
}`}
            </pre>
          </div>

          <div className="bg-[#121214] border border-blue-400/30 rounded-xl p-3.5 space-y-2">
            <span className="badge badge-xs badge-info font-bold">3. Subscriptions (Real-Time)</span>
            <p className="font-bold text-blue-400 text-xs">Push via WebSockets</p>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              Maintains persistent connection to stream real-time events to client.
            </p>
            <pre className="p-2 rounded bg-black/60 text-blue-300 text-[9px]">
{`subscription {
  newComment(articleId: 42) {
    text, author
  }
}`}
            </pre>
          </div>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-fuchsia-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e879f9" strokeWidth="2">
            <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" />
          </svg>
          <div>
            <p className="font-bold text-fuchsia-400">Single Endpoint Architecture:</p>
            <p className="text-zinc-300 text-[10px]">All operations route through POST /graphql with query payload.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-emerald-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <div>
            <p className="font-bold text-emerald-400">Strong Typing &amp; Introspection:</p>
            <p className="text-zinc-300 text-[10px]">Server schema acts as self-documenting contract with IDE auto-complete.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
