import type { Lesson } from "@/lib/system-design/types";

export interface LatencyVisualState {
  region: "local" | "cross-country" | "intercontinental";
  propagationMs: number;
  queuingMs: number;
  processingMs: number;
  totalRttMs: number;
  throughputGbps: number;
  packetLossPercent: number;
}

export const latencyLesson: Lesson = {
  pseudocode: [
    "// Network Latency & RTT Calculation",
    "function calculateRTT(distanceKm, queueLength, packetSize):",
    "  propagation = (distanceKm / 200000) * 1000 // Speed of light in fiber",
    "  transmission = packetSize / bandwidth",
    "  queuing = queueLength * routerBufferDelay",
    "  processing = server.cpuTime",
    "  ",
    "  totalOneWay = propagation + transmission + queuing + processing",
    "  return totalOneWay * 2 // Round-Trip Time (RTT)",
  ],

  steps: [
    {
      narration:
        "Local datacenter connection (same city, ~50km). Propagation is negligible, resulting in ultra-low latency (~5ms RTT).",
      activeLine: 2,
      state: {
        distanceKm: "50 km (Same City)",
        propagationDelay: "0.5 ms",
        queuingDelay: "1.0 ms",
        serverProcessing: "1.5 ms",
        totalRTT: "5 ms",
        p99Latency: "12 ms",
      },
      visualState: {
        region: "local",
        propagationMs: 0.5,
        queuingMs: 1.0,
        processingMs: 1.5,
        totalRttMs: 5,
        throughputGbps: 10,
        packetLossPercent: 0,
      } satisfies LatencyVisualState,
    },
    {
      narration:
        "Cross-country connection (NYC to SF, ~4,000km). Physical speed of light through fiber sets a hard floor of ~40ms RTT.",
      activeLine: 7,
      state: {
        distanceKm: "4,000 km (NYC → SF)",
        propagationDelay: "20 ms",
        queuingDelay: "3 ms",
        serverProcessing: "2 ms",
        totalRTT: "50 ms",
        p99Latency: "85 ms",
      },
      visualState: {
        region: "cross-country",
        propagationMs: 20,
        queuingMs: 3,
        processingMs: 2,
        totalRttMs: 50,
        throughputGbps: 1,
        packetLossPercent: 0.1,
      } satisfies LatencyVisualState,
    },
    {
      narration:
        "Intercontinental connection (London to Tokyo, ~9,500km). Undersea fiber cables and router queuing push total RTT to ~220ms.",
      activeLine: 8,
      state: {
        distanceKm: "9,500 km (London → Tokyo)",
        propagationDelay: "95 ms",
        queuingDelay: "10 ms",
        serverProcessing: "5 ms",
        totalRTT: "220 ms",
        p99Latency: "350 ms",
      },
      visualState: {
        region: "intercontinental",
        propagationMs: 95,
        queuingMs: 10,
        processingMs: 5,
        totalRttMs: 220,
        throughputGbps: 0.5,
        packetLossPercent: 0.5,
      } satisfies LatencyVisualState,
    },
    {
      narration:
        "Network congestion increases router queue buffers, spiking tail latency (P99). System design relies on Edge CDNs to move data closer to users.",
      activeLine: 4,
      state: {
        distanceKm: "Congested Network Route",
        propagationDelay: "95 ms",
        queuingDelay: "80 ms (Buffer Bloat)",
        serverProcessing: "15 ms",
        totalRTT: "380 ms",
        p99Latency: "650 ms (P99 Spike)",
      },
      visualState: {
        region: "intercontinental",
        propagationMs: 95,
        queuingMs: 80,
        processingMs: 15,
        totalRttMs: 380,
        throughputGbps: 0.1,
        packetLossPercent: 2.0,
      } satisfies LatencyVisualState,
    },
  ],
};
