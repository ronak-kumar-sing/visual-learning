import type { Lesson } from "@/lib/system-design/types";

export type ArchitectureMode = "reverse-proxy" | "gateway-proxy" | "load-balancer";

export interface ProxyInfographicVisualState {
  mode: ArchitectureMode;
  activeFeature: string;
  selectedNodeId: string;
  activeStep: number;
}

export const proxyLesson: Lesson = {
  pseudocode: [
    "// Architectural Routing: Reverse Proxy vs Gateway Proxy vs Load Balancer",
    "function routeIncomingTraffic(request, mode):",
    "  switch mode:",
    "    case 'REVERSE_PROXY':",
    "      sslTerminate(request)",
    "      if cache.has(request.path): return cache.get()",
    "      return forwardToOrigin(request) // Front door for servers",
    "      ",
    "    case 'GATEWAY_PROXY':",
    "      auth.verifyToken(request)",
    "      rateLimiter.checkQuota(request.clientIP)",
    "      return routeToMicroservice(request.path) // Control layer for APIs",
    "      ",
    "    case 'LOAD_BALANCER':",
    "      targetServer = selectHealthyNode(healthCheckPool)",
    "      return dispatch(targetServer, request) // Traffic distributor",
  ],

  steps: [
    {
      narration:
        "1. Reverse Proxy: Sits in front of origin servers. Provides a single public entry point, terminates SSL encryption, caches static assets, and hides internal server IPs.",
      activeLine: 4,
      state: {
        mode: "Reverse Proxy",
        role: "Front door for servers",
        keyFeatures: "SSL Termination, Caching, Compression, Security",
        bestFor: "Websites, web apps & protecting origin servers",
        trafficTarget: "Web Server A / B & App Server",
      },
      visualState: {
        mode: "reverse-proxy",
        activeFeature: "SSL Termination & Caching",
        selectedNodeId: "reverse-proxy-node",
        activeStep: 0,
      } satisfies ProxyInfographicVisualState,
    },
    {
      narration:
        "2. Gateway Proxy (API Gateway): A smart entry point for microservices. Handles authentication, authorization, rate limiting, request aggregation, and protocol translation.",
      activeLine: 9,
      state: {
        mode: "Gateway Proxy (API Gateway)",
        role: "Control layer for APIs",
        keyFeatures: "Auth, Rate Limiting, Request Routing, Aggregation",
        bestFor: "Microservices & client-specific API management",
        trafficTarget: "Auth, User, Orders, Payments, Notification Services",
      },
      visualState: {
        mode: "gateway-proxy",
        activeFeature: "Auth & Rate Limiting",
        selectedNodeId: "gateway-node",
        activeStep: 1,
      } satisfies ProxyInfographicVisualState,
    },
    {
      narration:
        "3. Load Balancer: Distributes incoming traffic across multiple healthy app instances. Uses Round-Robin or Least Connections algorithms, health checks, and failover.",
      activeLine: 14,
      state: {
        mode: "Load Balancer",
        role: "Traffic distributor across instances",
        keyFeatures: "Round Robin, Least Connections, Health Checks, Failover",
        bestFor: "Scaling traffic, improving uptime & high availability",
        trafficTarget: "App Instances 1, 2, 3, 4",
      },
      visualState: {
        mode: "load-balancer",
        activeFeature: "Round Robin & Health Checks",
        selectedNodeId: "lb-node",
        activeStep: 2,
      } satisfies ProxyInfographicVisualState,
    },
  ],
};
