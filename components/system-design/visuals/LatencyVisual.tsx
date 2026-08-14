"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { LatencyVisualState } from "@/lib/system-design/lessons/networking/latency";

interface LatencyVisualProps {
  visualState: LatencyVisualState;
  accentHex: string;
}

export default function LatencyVisual({
  visualState,
  accentHex,
}: LatencyVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [activeRegion, setActiveRegion] = useState<
    "local" | "cross-country" | "intercontinental"
  >(visualState.region || "local");
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);

  const region = activeRegion;

  const getDistanceDetails = () => {
    switch (region) {
      case "local":
        return {
          title: "Same Datacenter / City",
          dist: "50 km",
          rtt: 5,
          prop: 0.5,
          queue: 1.0,
          proc: 1.5,
          desc: "Fiber optic cables within same metro area. Ultra-low delay.",
        };
      case "cross-country":
        return {
          title: "NYC → San Francisco",
          dist: "4,000 km",
          rtt: 50,
          prop: 20,
          queue: 3,
          proc: 2,
          desc: "Continental fiber. Speed of light limits minimum RTT to ~40ms.",
        };
      case "intercontinental":
        return {
          title: "London → Tokyo",
          dist: "9,500 km",
          rtt: 220,
          prop: 95,
          queue: 10,
          proc: 5,
          desc: "Undersea submarine fiber cables across oceans. Significant latency.",
        };
    }
  };

  const details = getDistanceDetails();

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

      {/* Top Distance Selector (DaisyUI Join) */}
      <div className="z-10 flex items-center justify-between w-full max-w-3xl bg-[#111111] border border-white/10 rounded-xl px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-zinc-400">Distance Scenario:</span>
          <div className="join">
            <button
              className={`join-item btn btn-xs ${
                region === "local"
                  ? "btn-success text-black font-bold"
                  : "btn-ghost text-zinc-400"
              }`}
              onClick={() => setActiveRegion("local")}
            >
              🏢 Local (50km)
            </button>
            <button
              className={`join-item btn btn-xs ${
                region === "cross-country"
                  ? "btn-warning text-black font-bold"
                  : "btn-ghost text-zinc-400"
              }`}
              onClick={() => setActiveRegion("cross-country")}
            >
              🇺🇸 Cross-Country (4,000km)
            </button>
            <button
              className={`join-item btn btn-xs ${
                region === "intercontinental"
                  ? "btn-error text-black font-bold"
                  : "btn-ghost text-zinc-400"
              }`}
              onClick={() => setActiveRegion("intercontinental")}
            >
              🌏 Global (9,500km)
            </button>
          </div>
        </div>

        <div className="font-mono text-[11px] text-zinc-400">
          RTT: <strong className="text-amber-400 text-sm">{details.rtt} ms</strong>
        </div>
      </div>

      {/* Interactive Fiber Cable Diagram */}
      <div className="relative flex-1 w-full max-w-4xl flex items-center justify-between gap-6 my-4 px-4">
        {/* Source Client */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onMouseEnter={() => setHoveredComponent("client")}
          onMouseLeave={() => setHoveredComponent(null)}
          className="p-4 rounded-xl border bg-[#161616] border-white/10 flex flex-col items-center gap-2"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-zinc-800 text-2xl">
            💻
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-zinc-100">Origin Client</p>
            <p className="text-[10px] font-mono text-zinc-400">New York</p>
          </div>
        </motion.button>

        {/* Cable Transmission Stage */}
        <div
          className="relative flex-1 h-20 flex flex-col justify-center items-center px-4"
          onMouseEnter={() => setHoveredComponent("medium")}
          onMouseLeave={() => setHoveredComponent(null)}
        >
          {/* Fiber Cable Line */}
          <div className="w-full h-1.5 rounded-full bg-zinc-800 relative overflow-hidden">
            <motion.div
              animate={
                reduced
                  ? {}
                  : { x: ["-100%", "100%"] }
              }
              transition={{
                duration: details.rtt > 100 ? 2.5 : details.rtt > 30 ? 1.2 : 0.5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-1/3 h-full bg-amber-400 rounded-full shadow-lg shadow-amber-400/50"
            />
          </div>

          <div className="flex items-center justify-between w-full mt-2 font-mono text-[11px] text-zinc-400">
            <span>{details.dist} Fiber Link</span>
            <span className="text-amber-400 font-semibold">{details.rtt}ms RTT</span>
          </div>
        </div>

        {/* Destination Server */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onMouseEnter={() => setHoveredComponent("server")}
          onMouseLeave={() => setHoveredComponent(null)}
          className="p-4 rounded-xl border bg-[#161616] border-white/10 flex flex-col items-center gap-2"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-zinc-800 text-2xl">
            🗄️
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-zinc-100">Target Server</p>
            <p className="text-[10px] font-mono text-zinc-400">
              {region === "local"
                ? "Local DC"
                : region === "cross-country"
                  ? "San Francisco"
                  : "Tokyo DC"}
            </p>
          </div>
        </motion.button>
      </div>

      {/* Latency Breakdown Bar Chart */}
      <div className="z-10 w-full max-w-3xl bg-[#111111] border border-white/10 rounded-xl p-3.5 text-xs flex flex-col gap-2">
        <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400">
          <span>Latency Components Breakdown:</span>
          <span>Total: {details.rtt}ms</span>
        </div>

        {/* Progress Bar Stack */}
        <div className="w-full h-3 rounded-full bg-zinc-800 flex overflow-hidden">
          <div
            className="bg-amber-400 h-full transition-all duration-300"
            style={{ width: `${(details.prop / details.rtt) * 100}%` }}
            title={`Propagation: ${details.prop}ms`}
          />
          <div
            className="bg-blue-400 h-full transition-all duration-300"
            style={{ width: `${(details.queue / details.rtt) * 100}%` }}
            title={`Queuing: ${details.queue}ms`}
          />
          <div
            className="bg-emerald-400 h-full transition-all duration-300"
            style={{ width: `${(details.proc / details.rtt) * 100}%` }}
            title={`Processing: ${details.proc}ms`}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-amber-400" /> Propagation ({details.prop}ms)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-blue-400" /> Router Queue ({details.queue}ms)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-400" /> CPU Proc ({details.proc}ms)
          </span>
        </div>
      </div>

      {/* Component Inspector Overlay */}
      <AnimatePresence mode="wait">
        {hoveredComponent && (
          <motion.div
            key={hoveredComponent}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="z-20 w-full max-w-2xl bg-[#161616] border border-amber-400/40 rounded-xl p-3 text-xs flex flex-col gap-1 shadow-2xl backdrop-blur-md mt-2"
          >
            {hoveredComponent === "medium" && (
              <p className="text-zinc-300">
                <strong className="text-amber-400">Physical Fiber Optic Cable:</strong> Light travels through glass fiber at ~200,000 km/sec (approx. 5ms per 1,000km). This physical constant forms the absolute floor for network latency.
              </p>
            )}
            {hoveredComponent === "client" && (
              <p className="text-zinc-300">
                <strong className="text-amber-400">Origin Client:</strong> Measures Round-Trip Time (RTT). Uses CDNs (Content Delivery Networks) to cache assets at the edge to reduce travel distance.
              </p>
            )}
            {hoveredComponent === "server" && (
              <p className="text-zinc-300">
                <strong className="text-emerald-400">Destination Server:</strong> Executes backend code and processes database queries. High CPU load or unindexed DB queries add server processing delay to overall latency.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
