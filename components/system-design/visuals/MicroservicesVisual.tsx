"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  MICROSERVICE_NODES,
  type MicroservicesVisualState,
} from "@/lib/system-design/lessons/realtime/microservices";

interface MicroservicesVisualProps {
  visualState: MicroservicesVisualState;
  accentHex: string;
}

export default function MicroservicesVisual({
  visualState,
  accentHex,
}: MicroservicesVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"cluster" | "matrix" | "saga">("cluster");
  const [activeNode, setActiveNode] = useState<string>("order");
  const [sagaOutcome, setSagaOutcome] = useState<"success" | "compensating">("success");

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
            <span>🧩</span> Microservices Architecture &amp; Saga Patterns
          </h2>
          <p className="text-xs text-zinc-400">
            API Gateway · Database-per-Service · Independent Deployment · Distributed Sagas
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "cluster"
                ? "btn-accent bg-green-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("cluster")}
          >
            1. Service Cluster
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "matrix"
                ? "btn-accent bg-green-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("matrix")}
          >
            2. Monolith vs Microservices
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "saga"
                ? "btn-accent bg-green-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("saga")}
          >
            3. Saga Pattern
          </button>
        </div>
      </div>

      {/* ── MODE 1: SERVICE CLUSTER SIMULATOR ─────────────────────────────── */}
      {tabMode === "cluster" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-zinc-300 font-bold">API Gateway Entry Point &amp; Microservices Mesh:</span>
            <span className="badge badge-xs badge-success text-black font-bold">Loose Coupling</span>
          </div>

          {/* Central API Gateway + 4 Satellite Microservices */}
          <div className="p-4 bg-[#18181b] border border-white/10 rounded-xl flex flex-col gap-4">
            {/* Top Bar: API Gateway */}
            <div className="p-3 rounded-xl border border-blue-400/40 bg-[#161616] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
                <div>
                  <p className="font-bold text-blue-400 text-xs">API Gateway (Port 80 / 443)</p>
                  <p className="text-[10px] text-zinc-400">Routes HTTP ➔ Internal Microservices Mesh</p>
                </div>
              </div>
              <span className="badge badge-xs badge-info font-bold">Auth &amp; Rate Limiting</span>
            </div>

            {/* 4 Isolated Microservices Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {MICROSERVICE_NODES.map((node) => (
                <div
                  key={node.id}
                  onClick={() => setActiveNode(node.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    activeNode === node.id
                      ? "bg-green-500/15 border-green-400 ring-1 ring-green-400/30 shadow-lg"
                      : "bg-[#161616] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-zinc-100">{node.name}</span>
                    <span className="badge badge-xs badge-ghost text-zinc-400">{node.badge}</span>
                  </div>
                  <div className="space-y-1 text-[10px]">
                    <p className="text-green-300">📦 <strong>DB:</strong> {node.dbType}</p>
                    <p className="text-zinc-400">⚙️ {node.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 flex items-center justify-between text-xs">
            <span>Database-Per-Service Rule: No service is allowed to query another service&apos;s database directly.</span>
            <span className="badge badge-xs badge-success text-black font-bold">Domain Isolation</span>
          </div>
        </div>
      )}

      {/* ── MODE 2: MONOLITH VS MICROSERVICES MATRIX ──────────────────────── */}
      {tabMode === "matrix" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 overflow-x-auto shadow-xl font-mono text-xs">
          <table className="table table-sm w-full">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 text-[11px]">
                <th>Dimension</th>
                <th>Monolithic Architecture</th>
                <th>Microservices Architecture</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="font-bold text-zinc-200">Blast Radius</td>
                <td className="text-red-400">High (A memory leak in chat crashes billing &amp; checkout)</td>
                <td className="text-green-400 font-bold">Low (Auth crash doesn&apos;t bring down existing video playback)</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="font-bold text-zinc-200">Deployment Speed</td>
                <td className="text-amber-400">Slow (Entire multi-GB codebase deployed together)</td>
                <td className="text-green-400 font-bold">Blazing Fast (Deploy Payment Service in 10s independently)</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="font-bold text-zinc-200">Database Coupling</td>
                <td className="text-blue-400">Single Shared Relational Database (100+ table joins)</td>
                <td className="text-green-400 font-bold">Database-per-Service (Polyglot: Postgres + Mongo + Dynamo)</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="font-bold text-zinc-200">System Complexity</td>
                <td className="text-green-400 font-bold">Low (Simple function calls, easy local debugging)</td>
                <td className="text-amber-400">High (Service discovery, distributed tracing, network latency)</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ── MODE 3: SAGA PATTERN ──────────────────────────────────────────── */}
      {tabMode === "saga" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-2 gap-2">
            <span className="font-bold text-green-400">Distributed Saga Orchestration &amp; Compensating Actions:</span>
            <div className="join">
              <button
                onClick={() => setSagaOutcome("success")}
                className={`join-item btn btn-xs ${sagaOutcome === "success" ? "btn-success text-black font-bold" : "btn-ghost text-zinc-400"}`}
              >
                1. Happy Path (Order Success)
              </button>
              <button
                onClick={() => setSagaOutcome("compensating")}
                className={`join-item btn btn-xs ${sagaOutcome === "compensating" ? "btn-error text-white font-bold" : "btn-ghost text-zinc-400"}`}
              >
                2. Out of Stock (Compensating Refund)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { step: "Step 1", title: "Create Pending Order", status: "Order Service ✓", color: "border-green-400" },
              { step: "Step 2", title: "Charge Credit Card ($149)", status: "Payment Service ✓", color: "border-green-400" },
              {
                step: "Step 3",
                title: sagaOutcome === "success" ? "Stock Reserved" : "OUT OF STOCK ❌",
                status: sagaOutcome === "success" ? "Inventory Service ✓" : "Inventory Failed",
                color: sagaOutcome === "success" ? "border-green-400" : "border-red-400",
              },
              {
                step: "Step 4",
                title: sagaOutcome === "success" ? "Order Confirmed" : "Compensating Refund ($149)",
                status: sagaOutcome === "success" ? "Complete ✓" : "Refund Issued ✓",
                color: sagaOutcome === "success" ? "border-green-400" : "border-amber-400",
              },
            ].map((s, i) => (
              <div key={i} className={`p-3 rounded-xl border bg-[#161616] ${s.color} space-y-1 shadow`}>
                <span className="badge badge-xs font-bold">{s.step}</span>
                <p className="font-bold text-zinc-100 text-xs">{s.title}</p>
                <p className="text-[10px] text-zinc-400">{s.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-green-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <div>
            <p className="font-bold text-green-400">Independent Scalability:</p>
            <p className="text-zinc-300 text-[10px]">Scale high-traffic Payment pods to 50 instances without scaling Auth.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <div>
            <p className="font-bold text-blue-400">Sagas Replace 2PC:</p>
            <p className="text-zinc-300 text-[10px]">Compensating transactions provide eventual consistency without heavy distributed locks.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
