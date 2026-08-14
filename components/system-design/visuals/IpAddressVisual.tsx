"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { IpAddressVisualState } from "@/lib/system-design/lessons/networking/ip-address";

interface IpAddressVisualProps {
  visualState: IpAddressVisualState;
  accentHex: string;
  onSelectDevice?: (deviceId: string) => void;
}

interface DeviceNode {
  id: string;
  name: string;
  ip: string;
  type: "laptop" | "phone" | "server" | "router" | "dest-server";
  isPrivate: boolean;
  roleDescription: string;
}

const DEVICES: DeviceNode[] = [
  {
    id: "laptop-1",
    name: "Laptop 1",
    ip: "192.168.1.10",
    type: "laptop",
    isPrivate: true,
    roleDescription:
      "Client device in local LAN (192.168.1.0/24). Binary: 11000000.10101000.00000001.00001010.",
  },
  {
    id: "phone-1",
    name: "Phone 1",
    ip: "192.168.1.15",
    type: "phone",
    isPrivate: true,
    roleDescription:
      "Mobile Wi-Fi device. Uses private RFC 1918 IPv4 address assigned dynamically by DHCP.",
  },
  {
    id: "server-db",
    name: "DB Server",
    ip: "10.0.0.5",
    type: "server",
    isPrivate: true,
    roleDescription:
      "Internal database server. Isolated in private Class A subnet (10.0.0.0/8). Inaccessible directly from internet.",
  },
  {
    id: "router",
    name: "NAT Router Gateway",
    ip: "192.168.1.1 / 203.0.113.1",
    type: "router",
    isPrivate: false,
    roleDescription:
      "Gateway bridging LAN and WAN. Translates internal private IP to ISP public IP (203.0.113.1).",
  },
  {
    id: "web-server",
    name: "Remote Server",
    ip: "93.184.216.34",
    type: "dest-server",
    isPrivate: false,
    roleDescription:
      "Public Web Server on global internet with registered, globally unique IPv4 address.",
  },
];

export default function IpAddressVisual({
  visualState,
  accentHex,
  onSelectDevice,
}: IpAddressVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [selectedId, setSelectedId] = useState<string>(
    visualState.selectedDeviceId || "laptop-1"
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeSubnetMask, setActiveSubnetMask] = useState<string>("/24");

  const currentSelected = selectedId || visualState.selectedDeviceId;
  const inspectedDevice = DEVICES.find(
    (d) => d.id === (hoveredId || currentSelected)
  );

  const isNATActive =
    visualState.stepPhase === "nat-flow" || visualState.natActive;

  const handleDeviceClick = (id: string) => {
    setSelectedId(id);
    if (onSelectDevice) onSelectDevice(id);
  };

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-between p-6 select-none overflow-hidden"
      style={{ backgroundColor: "var(--sd-bg)" }}
    >
      {/* Background subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(var(--sd-text) 1px, transparent 1px), linear-gradient(90deg, var(--sd-text) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
        aria-hidden="true"
      />

      {/* Top Bar — Subnet Mask Selector */}
      <div className="z-10 flex items-center justify-between w-full max-w-4xl bg-[#111111] border border-white/10 rounded-xl px-5 py-2.5 text-xs shadow-lg">
        <div className="flex items-center gap-3">
          <span className="font-mono text-zinc-400">Subnet Mask:</span>
          <div className="join">
            <button
              className={`join-item btn btn-xs ${
                activeSubnetMask === "/24"
                  ? "btn-accent text-black font-bold"
                  : "btn-ghost text-zinc-400"
              }`}
              onClick={() => setActiveSubnetMask("/24")}
            >
              /24 (255.255.255.0)
            </button>
            <button
              className={`join-item btn btn-xs ${
                activeSubnetMask === "/16"
                  ? "btn-accent text-black font-bold"
                  : "btn-ghost text-zinc-400"
              }`}
              onClick={() => setActiveSubnetMask("/16")}
            >
              /16 (255.255.0.0)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span className="inline-flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Private (LAN)
          </span>
          <span className="inline-flex items-center gap-1.5 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Public (WAN)
          </span>
        </div>
      </div>

      {/* ── CENTER STAGE: Clean Visual Diagram with directional arrows ───────── */}
      <div className="relative flex-1 w-full max-w-5xl flex items-center justify-between gap-6 my-4 px-4">
        {/* Local Network Container */}
        <div
          className={`relative flex-1 p-5 rounded-2xl border transition-all duration-300 ${
            activeSubnetMask === "/24"
              ? "bg-emerald-500/5 border-emerald-500/30"
              : "bg-blue-500/5 border-blue-500/30"
          }`}
        >
          {/* Subnet Label */}
          <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#111111] border border-white/10 text-zinc-300 shadow">
            {activeSubnetMask === "/24"
              ? "Local Subnet (192.168.1.0/24)"
              : "Expanded LAN (192.168.0.0/16)"}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {DEVICES.filter((d) => d.isPrivate).map((device) => {
              const isSelected = device.id === currentSelected;
              return (
                <motion.button
                  key={device.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeviceClick(device.id)}
                  onMouseEnter={() => setHoveredId(device.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`relative flex flex-col items-center gap-2 p-3.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "bg-amber-400/15 border-amber-400 shadow-xl shadow-amber-400/15 ring-2 ring-amber-400/30"
                      : "bg-[#161616] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-800 text-xl border border-white/10">
                    {device.type === "laptop" && "💻"}
                    {device.type === "phone" && "📱"}
                    {device.type === "server" && "🗄️"}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-zinc-100 truncate max-w-[110px]">
                      {device.name}
                    </p>
                    <p className="text-[10px] font-mono text-emerald-400 mt-0.5">
                      {device.ip}
                    </p>
                  </div>

                  <span className="badge badge-xs badge-success badge-outline font-mono text-[9px]">
                    Private
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Directional Arrow to Router */}
        <div className="flex flex-col items-center text-zinc-500 font-mono text-xs">
          <span>➔</span>
          <span className="text-[9px]">LAN</span>
        </div>

        {/* NAT Gateway Router */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          onClick={() => handleDeviceClick("router")}
          onMouseEnter={() => setHoveredId("router")}
          onMouseLeave={() => setHoveredId(null)}
          className={`z-10 flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all ${
            currentSelected === "router" || isNATActive
              ? "bg-amber-400/20 border-amber-400 shadow-2xl shadow-amber-400/25 ring-2 ring-amber-400/30"
              : "bg-[#161616] border-white/10 hover:border-white/20"
          }`}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-400/20 text-2xl border border-amber-400/40">
            🌐
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-100">NAT Router</p>
            <p className="text-[10px] font-mono text-amber-400 mt-0.5">
              203.0.113.1
            </p>
          </div>
          <span className="badge badge-xs badge-warning font-mono text-[9px]">
            NAT Gateway
          </span>
        </motion.button>

        {/* Directional Arrow to Internet */}
        <div className="relative flex flex-col items-center text-zinc-500 font-mono text-xs">
          <span>➔</span>
          <span className="text-[9px]">WAN</span>
          {isNATActive && (
            <motion.div
              animate={reduced ? {} : { scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute -top-6 px-1.5 py-0.5 rounded bg-amber-400 text-black font-bold text-[9px] shadow"
            >
              NAT
            </motion.div>
          )}
        </div>

        {/* Remote Public Web Server */}
        {DEVICES.filter((d) => d.id === "web-server").map((device) => {
          const isSelected = device.id === currentSelected;
          return (
            <motion.button
              key={device.id}
              whileHover={{ scale: 1.06 }}
              onClick={() => handleDeviceClick(device.id)}
              onMouseEnter={() => setHoveredId(device.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`z-10 flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all ${
                isSelected
                  ? "bg-blue-400/20 border-blue-400 shadow-2xl shadow-blue-400/25 ring-2 ring-blue-400/30"
                  : "bg-[#161616] border-white/10 hover:border-white/20"
              }`}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-400/20 text-2xl border border-blue-400/40">
                ☁️
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-100">{device.name}</p>
                <p className="text-[10px] font-mono text-blue-400 mt-0.5">
                  {device.ip}
                </p>
              </div>
              <span className="badge badge-xs badge-info badge-outline font-mono text-[9px]">
                Public Server
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ── Component Inspector Overlay (Bottom of Visual Stage) ────────────── */}
      <AnimatePresence mode="wait">
        {inspectedDevice && (
          <motion.div
            key={inspectedDevice.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="z-20 w-full max-w-2xl bg-[#121214] border border-amber-400/40 rounded-xl p-3.5 text-xs flex flex-col gap-1 shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 flex items-center gap-2">
                <span>🔍</span> {inspectedDevice.name} [{inspectedDevice.ip}]
              </span>
              <span
                className={`badge badge-xs ${
                  inspectedDevice.isPrivate ? "badge-success" : "badge-warning"
                } font-mono`}
              >
                {inspectedDevice.isPrivate ? "Private IP (LAN)" : "Public IP (WAN)"}
              </span>
            </div>
            <p className="text-zinc-300 leading-relaxed text-[11px]">
              {inspectedDevice.roleDescription}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
