import type { Lesson } from "@/lib/system-design/types";

export interface ServerHardwareTier {
  id: string;
  name: string;
  cpu: number; // cores
  ram: number; // GB
  capacityRps: number;
  monthlyCost: number;
  utilizationPct: number;
  isNearCeiling?: boolean;
}

export const HARDWARE_TIERS: ServerHardwareTier[] = [
  {
    id: "small",
    name: "Small (2 vCPU / 4GB RAM)",
    cpu: 2,
    ram: 4,
    capacityRps: 1000,
    monthlyCost: 20,
    utilizationPct: 95,
  },
  {
    id: "medium",
    name: "Medium (8 vCPU / 32GB RAM)",
    cpu: 8,
    ram: 32,
    capacityRps: 10000,
    monthlyCost: 150,
    utilizationPct: 60,
  },
  {
    id: "large",
    name: "Large (32 vCPU / 128GB RAM)",
    cpu: 32,
    ram: 128,
    capacityRps: 50000,
    monthlyCost: 800,
    utilizationPct: 35,
  },
  {
    id: "max",
    name: "Max Spec (128 vCPU / 512GB RAM)",
    cpu: 128,
    ram: 512,
    capacityRps: 120000,
    monthlyCost: 4200,
    utilizationPct: 20,
    isNearCeiling: true,
  },
];

export interface VerticalScalingVisualState {
  currentStepIndex: number;
  activeTierId: string;
  trafficLoadRps: number;
  serverStatus: "healthy" | "overloaded" | "rebooting";
}

export const verticalScalingLesson: Lesson = {
  pseudocode: [
    "// Vertical Scaling (Scale-Up) Architecture",
    "function scaleUpServer(workloadRps):",
    "  if workloadRps > server.capacityRps:",
    "    // 1. Order bigger bare-metal or cloud instance tier",
    "    newTier = cloudProvider.getNextTier(server.tier)",
    "    ",
    "    // 2. Hardware Ceiling Check",
    "    if newTier.cpu > MAX_PHYSICAL_SOCKET_LIMIT:",
    "      raise HardwareCeilingExceeded('Must migrate to Horizontal Scaling!')",
    "    ",
    "    // 3. Maintenance Window Downtime required for reboot",
    "    server.scheduleMaintenanceReboot(newTier)",
    "    return server.upgrade(newTier.cpu, newTier.ram)",
  ],

  steps: [
    {
      narration:
        "Step 1: Baseline Small Server (2 vCPU, 4GB RAM). Handling 1,000 RPS smoothly. Low cost ($20/mo), zero architectural complexity.",
      activeLine: 2,
      state: {
        serverTier: "Small (2 vCPU / 4GB RAM)",
        traffic: "1,000 RPS",
        cost: "$20/month",
        spofRisk: "High (Single Point of Failure)",
        systemState: "Healthy",
      },
      visualState: {
        currentStepIndex: 0,
        activeTierId: "small",
        trafficLoadRps: 1000,
        serverStatus: "healthy",
      } satisfies VerticalScalingVisualState,
    },
    {
      narration:
        "Step 2: Traffic Spike! Server CPU reaches 100% capacity. Upgrading to Medium (8 vCPU, 32GB RAM) to handle 10,000 RPS.",
      activeLine: 4,
      state: {
        serverTier: "Medium (8 vCPU / 32GB RAM)",
        traffic: "10,000 RPS",
        cost: "$150/month",
        spofRisk: "High (Single Point of Failure)",
        systemState: "Healthy After Reboot",
      },
      visualState: {
        currentStepIndex: 1,
        activeTierId: "medium",
        trafficLoadRps: 10000,
        serverStatus: "healthy",
      } satisfies VerticalScalingVisualState,
    },
    {
      narration:
        "Step 3: Hyper-Growth. Upgrading to Large (32 vCPU, 128GB RAM). Cost increases steeply to $800/mo.",
      activeLine: 6,
      state: {
        serverTier: "Large (32 vCPU / 128GB RAM)",
        traffic: "50,000 RPS",
        cost: "$800/month",
        spofRisk: "High (Single Point of Failure)",
        systemState: "Healthy",
      },
      visualState: {
        currentStepIndex: 2,
        activeTierId: "large",
        trafficLoadRps: 50000,
        serverStatus: "healthy",
      } satisfies VerticalScalingVisualState,
    },
    {
      narration:
        "Step 4: Hard Physical Limit Reached! Max hardware (128 vCPU, 512GB RAM) costs $4,200/mo. Cannot scale up further — must scale horizontally.",
      activeLine: 8,
      state: {
        serverTier: "Max Spec (128 vCPU / 512GB RAM)",
        traffic: "120,000 RPS",
        cost: "$4,200/month (Exponential Cost)",
        spofRisk: "Critical (Hardware Ceiling Exceeded)",
        systemState: "Approaching Limits",
      },
      visualState: {
        currentStepIndex: 3,
        activeTierId: "max",
        trafficLoadRps: 120000,
        serverStatus: "healthy",
      } satisfies VerticalScalingVisualState,
    },
  ],
};
