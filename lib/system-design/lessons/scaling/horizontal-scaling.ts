import type { Lesson } from "@/lib/system-design/types";

export interface HorizontalScalingVisualState {
  currentStepIndex: number;
  nodeCount: number;
  trafficLoadRps: number;
  healthyNodeCount: number;
  deadNodeId: number | null;
  autoScalingActive: boolean;
}

export const horizontalScalingLesson: Lesson = {
  pseudocode: [
    "// Horizontal Scaling (Scale-Out) Auto-Scaler",
    "function autoScaleCluster(currentTrafficRps):",
    "  targetRpsPerNode = 5000",
    "  requiredNodes = ceil(currentTrafficRps / targetRpsPerNode)",
    "  ",
    "  if requiredNodes > cluster.nodeCount:",
    "    // 1. Provision new stateless container instances in parallel",
    "    newNodes = cluster.spinUpInstances(requiredNodes - cluster.nodeCount)",
    "    loadBalancer.registerTargets(newNodes)",
    "  ",
    "  // 2. High Availability Health Checks & Failover",
    "  loadBalancer.onHealthCheckFailed((deadNode) => {",
    "    loadBalancer.deregisterTarget(deadNode)",
    "    cluster.replaceNode(deadNode) // Zero downtime for users!",
    "  })",
  ],

  steps: [
    {
      narration:
        "Step 1: Baseline Single Instance (N=1). Handling 5,000 RPS. Single point of failure exists.",
      activeLine: 3,
      state: {
        clusterSize: "1 Worker Node",
        traffic: "5,000 RPS",
        capacity: "5,000 RPS (100% Load)",
        faultTolerance: "0 Nodes (SPOF)",
        autoScaler: "Monitoring Metrics",
      },
      visualState: {
        currentStepIndex: 0,
        nodeCount: 1,
        trafficLoadRps: 5000,
        healthyNodeCount: 1,
        deadNodeId: null,
        autoScalingActive: false,
      } satisfies HorizontalScalingVisualState,
    },
    {
      narration:
        "Step 2: Traffic Surge to 15,000 RPS. Auto-scaler provisions 2 new stateless nodes (N=3). Load Balancer distributes traffic evenly.",
      activeLine: 7,
      state: {
        clusterSize: "3 Worker Nodes",
        traffic: "15,000 RPS",
        capacity: "15,000 RPS (100% Distributed)",
        faultTolerance: "Can survive 1 Node Failure",
        autoScaler: "Auto-Scaled +2 Nodes",
      },
      visualState: {
        currentStepIndex: 1,
        nodeCount: 3,
        trafficLoadRps: 15000,
        healthyNodeCount: 3,
        deadNodeId: null,
        autoScalingActive: true,
      } satisfies HorizontalScalingVisualState,
    },
    {
      narration:
        "Step 3: Hardware Crash Simulation! Node #2 dies. Load Balancer detects health check failure and instantly reroutes traffic with zero downtime!",
      activeLine: 11,
      state: {
        clusterSize: "3 Nodes (1 Unhealthy)",
        traffic: "15,000 RPS",
        capacity: "10,000 RPS (Rerouted)",
        faultTolerance: "High Availability Active",
        autoScaler: "Spawning Replacement Node",
      },
      visualState: {
        currentStepIndex: 2,
        nodeCount: 3,
        trafficLoadRps: 15000,
        healthyNodeCount: 2,
        deadNodeId: 2,
        autoScalingActive: true,
      } satisfies HorizontalScalingVisualState,
    },
    {
      narration:
        "Step 4: Enterprise Scale. Cluster expanded to 6 commodity nodes handling 30,000 RPS with near-infinite horizontal elasticity.",
      activeLine: 8,
      state: {
        clusterSize: "6 Worker Nodes",
        traffic: "30,000 RPS",
        capacity: "30,000 RPS",
        faultTolerance: "Survives Multiple Node Outages",
        autoScaler: "Elastic Capacity Stable ✓",
      },
      visualState: {
        currentStepIndex: 3,
        nodeCount: 6,
        trafficLoadRps: 30000,
        healthyNodeCount: 6,
        deadNodeId: null,
        autoScalingActive: true,
      } satisfies HorizontalScalingVisualState,
    },
  ],
};
