import type { Lesson } from "@/lib/system-design/types";

export type LoadBalancingAlgorithm =
  | "round-robin"
  | "least-connections"
  | "ip-hash"
  | "weighted";

export interface TargetServerItem {
  id: number;
  name: string;
  activeConnections: number;
  weight: number;
  isHealthy: boolean;
}

export const TARGET_SERVERS_POOL: TargetServerItem[] = [
  { id: 1, name: "Server #1 (Web App)", activeConnections: 12, weight: 1, isHealthy: true },
  { id: 2, name: "Server #2 (Web App)", activeConnections: 45, weight: 2, isHealthy: true },
  { id: 3, name: "Server #3 (Web App)", activeConnections: 5, weight: 1, isHealthy: true },
  { id: 4, name: "Server #4 (Web App)", activeConnections: 28, weight: 3, isHealthy: true },
];

export interface LoadBalancersVisualState {
  currentStepIndex: number;
  algorithm: LoadBalancingAlgorithm;
  layerMode: "layer4" | "layer7";
  routedServerId: number;
  healthCheckActive: boolean;
}

export const loadBalancersLesson: Lesson = {
  pseudocode: [
    "// Load Balancer Routing & Health Check Engine",
    "function routeIncomingTraffic(request, algorithm):",
    "  healthyPool = servers.filter(s => s.isHealthy)",
    "  ",
    "  switch algorithm:",
    "    case 'ROUND_ROBIN':",
    "      // Sequential rotation across all healthy targets",
    "      target = healthyPool[counter++ % healthyPool.length]",
    "      return forwardRequest(request, target)",
    "      ",
    "    case 'LEAST_CONNECTIONS':",
    "      // Dynamic routing to server with lowest active workload",
    "      target = healthyPool.reduce((min, s) => s.connections < min.connections ? s : min)",
    "      return forwardRequest(request, target)",
    "      ",
    "    case 'LAYER_7_PATH_ROUTING':",
    "      // Content-based inspection of HTTP URL path",
    "      if request.path.startsWith('/images'): return forward(request, staticCluster)",
    "      if request.path.startsWith('/api'): return forward(request, apiCluster)",
  ],

  steps: [
    {
      narration:
        "Step 1: Round Robin Algorithm. Distributes incoming requests sequentially (1 ➔ 2 ➔ 3 ➔ 4) in rotational order.",
      activeLine: 5,
      state: {
        algorithm: "Round Robin (Static)",
        mode: "Sequential Rotation",
        targetSelected: "Server #1",
        layer: "Layer 4 / Layer 7",
      },
      visualState: {
        currentStepIndex: 0,
        algorithm: "round-robin",
        layerMode: "layer7",
        routedServerId: 1,
        healthCheckActive: false,
      } satisfies LoadBalancersVisualState,
    },
    {
      narration:
        "Step 2: Least Connections Algorithm. Dynamically checks active connection count and routes traffic to Server #3 (only 5 active connections).",
      activeLine: 10,
      state: {
        algorithm: "Least Connections (Dynamic)",
        mode: "Workload Aware",
        targetSelected: "Server #3 (Lowest load: 5 connections)",
        layer: "Layer 4 / Layer 7",
      },
      visualState: {
        currentStepIndex: 1,
        algorithm: "least-connections",
        layerMode: "layer7",
        routedServerId: 3,
        healthCheckActive: false,
      } satisfies LoadBalancersVisualState,
    },
    {
      narration:
        "Step 3: Layer 7 Path-Based Content Routing. Inspects HTTP URL headers — sends /images to static CDN/S3 and /api to microservice backend.",
      activeLine: 15,
      state: {
        algorithm: "Layer 7 Content-Based",
        mode: "Path & Header Inspection",
        targetSelected: "API Cluster for /api/*",
        layer: "Layer 7 (Application HTTP)",
      },
      visualState: {
        currentStepIndex: 2,
        algorithm: "round-robin",
        layerMode: "layer7",
        routedServerId: 2,
        healthCheckActive: false,
      } satisfies LoadBalancersVisualState,
    },
    {
      narration:
        "Step 4: Active Health Check Eviction. Load Balancer pings /healthz every 5 seconds. If Server #2 fails 3 probes, it is evicted automatically!",
      activeLine: 3,
      state: {
        algorithm: "Health Check Probe",
        mode: "Automated Eviction (/healthz)",
        targetSelected: "Server #2 Evicted (Zero Failed User Requests)",
        layer: "High Availability Active ✓",
      },
      visualState: {
        currentStepIndex: 3,
        algorithm: "round-robin",
        layerMode: "layer7",
        routedServerId: 4,
        healthCheckActive: true,
      } satisfies LoadBalancersVisualState,
    },
  ],
};
