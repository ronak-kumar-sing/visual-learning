"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  SQL_VS_NOSQL_COMPARISON,
  type SqlVsNosqlVisualState,
} from "@/lib/system-design/lessons/scaling/sql-vs-nosql";

interface SqlVsNosqlVisualProps {
  visualState: SqlVsNosqlVisualState;
  accentHex: string;
}

// ── Custom Vector SVG Components (No Emoji Icons) ───────────────────────────
function SqlTableCard({ name, columns }: { name: string; columns: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3.5 rounded-xl border bg-[#161616] border-blue-400/30 font-mono text-xs flex flex-col gap-2 min-w-[170px] shadow-lg shadow-blue-400/5"
    >
      <div className="flex items-center gap-2 border-b border-white/10 pb-1.5 text-blue-400 font-bold">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#60a5fa" strokeWidth="1.5">
          <rect x="2" y="3" width="16" height="14" rx="2" />
          <line x1="2" y1="8" x2="18" y2="8" />
          <line x1="8" y1="3" x2="8" y2="17" />
        </svg>
        <span>{name}</span>
      </div>
      <div className="space-y-1 text-[10px] text-zinc-300">
        {columns.map((col, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="text-zinc-200">{col}</span>
            <span className="text-zinc-500">{idx === 0 ? "PK" : idx === 1 ? "FK" : "VAL"}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function NoSqlDocCard({ collection, json }: { collection: string; json: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3.5 rounded-xl border bg-[#161616] border-emerald-400/30 font-mono text-xs flex flex-col gap-2 min-w-[200px] shadow-lg shadow-emerald-400/5"
    >
      <div className="flex items-center gap-2 border-b border-white/10 pb-1.5 text-emerald-400 font-bold">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#34d399" strokeWidth="1.5">
          <path d="M4 2h8l4 4v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
          <polyline points="12 2 12 6 16 6" />
        </svg>
        <span>{collection}</span>
      </div>
      <pre className="p-2 rounded bg-[#09090b] text-[10px] text-emerald-300 overflow-x-auto leading-relaxed border border-white/5">
        {json}
      </pre>
    </motion.div>
  );
}

export default function SqlVsNosqlVisual({
  visualState,
  accentHex,
}: SqlVsNosqlVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"sql" | "nosql" | "cap" | "matrix">(
    visualState.activeModel || "sql"
  );
  const [capFocus, setCapFocus] = useState<"ca" | "cp" | "ap">("cp");

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
            <span>⚖️</span> SQL (Relational) vs NoSQL (Non-Relational)
          </h2>
          <p className="text-xs text-zinc-400">
            Structured Relational Tables &amp; ACID vs Flexible Distributed Documents &amp; BASE
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "sql"
                ? "btn-accent bg-blue-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("sql")}
          >
            1. SQL Relational
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "nosql"
                ? "btn-accent bg-emerald-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("nosql")}
          >
            2. NoSQL Document
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "cap"
                ? "btn-accent bg-amber-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("cap")}
          >
            3. CAP Theorem
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "matrix"
                ? "btn-accent bg-purple-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("matrix")}
          >
            4. Comparison Matrix
          </button>
        </div>
      </div>

      {/* ── MODE 1: SQL RELATIONAL MODEL ──────────────────────────────────── */}
      {tabMode === "sql" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="badge badge-info font-mono font-bold">SQL Schema Architecture (PostgreSQL / MySQL)</span>
            <span className="text-blue-400 font-mono text-xs">Foreign Key Relational Joins · Strict ACID</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-[#18181b] border border-white/10 rounded-xl">
            <SqlTableCard
              name="Users Table"
              columns={["user_id: INT", "name: VARCHAR", "email: VARCHAR"]}
            />

            {/* SVG Connecting Foreign Key Arrow */}
            <div className="flex flex-col items-center">
              <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                <motion.line
                  x1="0"
                  y1="10"
                  x2="50"
                  y2="10"
                  stroke="#60a5fa"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  animate={reduced ? {} : { strokeDashoffset: [0, -16] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                />
                <polygon points="50,6 60,10 50,14" fill="#60a5fa" />
              </svg>
              <span className="text-[9px] font-mono text-blue-400">1:N FK JOIN</span>
            </div>

            <SqlTableCard
              name="Orders Table"
              columns={["order_id: INT", "user_id: INT (FK)", "total: DECIMAL"]}
            />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/40 p-2.5 rounded-xl text-center text-xs font-mono text-blue-300">
            🔒 <strong>Strict ACID Compliance:</strong> All row joins and constraints are validated before write commit.
          </div>
        </div>
      )}

      {/* ── MODE 2: NOSQL DOCUMENT MODEL ──────────────────────────────────── */}
      {tabMode === "nosql" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="badge badge-success font-mono font-bold text-black">NoSQL Document Architecture (MongoDB)</span>
            <span className="text-emerald-400 font-mono text-xs">Embedded JSON · Horizontal Sharding</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-[#18181b] border border-white/10 rounded-xl">
            <NoSqlDocCard
              collection="users.json (Embedded Document)"
              json={`{
  "_id": "usr_99",
  "name": "Alex Mercer",
  "orders": [
    { "id": 101, "total": 49.99 },
    { "id": 102, "total": 120.00 }
  ]
}`}
            />
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/40 p-2.5 rounded-xl text-center text-xs font-mono text-emerald-300">
            ⚡ <strong>Horizontal Sharding:</strong> Documents are distributed across shards by shard key for high-throughput scaling.
          </div>
        </div>
      )}

      {/* ── MODE 3: CAP THEOREM ───────────────────────────────────────────── */}
      {tabMode === "cap" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="badge badge-warning font-mono font-bold">CAP Theorem Guarantees</span>
            <span className="text-amber-400">Pick 2: Consistency, Availability, Partition Tolerance</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setCapFocus("cp")}
              className={`p-3.5 rounded-xl border text-left space-y-1.5 transition-all ${
                capFocus === "cp"
                  ? "bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/30"
                  : "bg-[#18181b] border-white/10 text-zinc-400"
              }`}
            >
              <span className="badge badge-xs badge-warning font-bold">CP Systems</span>
              <p className="font-bold text-zinc-100 text-xs">Consistency + Partition Tolerance</p>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                MongoDB, HBase, CockroachDB. During partition, returns error until state is synced.
              </p>
            </button>

            <button
              onClick={() => setCapFocus("ap")}
              className={`p-3.5 rounded-xl border text-left space-y-1.5 transition-all ${
                capFocus === "ap"
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/30"
                  : "bg-[#18181b] border-white/10 text-zinc-400"
              }`}
            >
              <span className="badge badge-xs badge-success font-bold">AP Systems</span>
              <p className="font-bold text-zinc-100 text-xs">Availability + Partition Tolerance</p>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                Cassandra, DynamoDB, CouchDB. Always responds, but data may be eventually consistent.
              </p>
            </button>

            <button
              onClick={() => setCapFocus("ca")}
              className={`p-3.5 rounded-xl border text-left space-y-1.5 transition-all ${
                capFocus === "ca"
                  ? "bg-blue-500/20 border-blue-400 text-blue-300 ring-2 ring-blue-400/30"
                  : "bg-[#18181b] border-white/10 text-zinc-400"
              }`}
            >
              <span className="badge badge-xs badge-info font-bold">CA Systems</span>
              <p className="font-bold text-zinc-100 text-xs">Consistency + Availability</p>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                Single-node RDBMS (Postgres, MySQL). Cannot handle network partitions across nodes.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* ── MODE 4: COMPARISON MATRIX ─────────────────────────────────────── */}
      {tabMode === "matrix" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 overflow-x-auto shadow-xl font-mono text-xs">
          <table className="table table-sm w-full">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 text-[11px]">
                <th>Dimension</th>
                <th className="text-blue-400">SQL (Relational)</th>
                <th className="text-emerald-400">NoSQL (Non-Relational)</th>
              </tr>
            </thead>
            <tbody>
              {SQL_VS_NOSQL_COMPARISON.map((row, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="font-bold text-zinc-300">{row.dimension}</td>
                  <td className="text-zinc-400">{row.sql}</td>
                  <td className="text-zinc-400">{row.nosql}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
          </svg>
          <div>
            <p className="font-bold text-blue-400">SQL Relational Strength:</p>
            <p className="text-zinc-300 text-[10px]">Strict schema, multi-table joins, and ACID compliance.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-emerald-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v8M8 12h8" />
          </svg>
          <div>
            <p className="font-bold text-emerald-400">NoSQL Scalability Strength:</p>
            <p className="text-zinc-300 text-[10px]">Flexible JSON documents and horizontal auto-sharding.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
