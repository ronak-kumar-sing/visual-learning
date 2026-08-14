import type { Lesson } from "@/lib/system-design/types";

export interface CapSystemItem {
  name: string;
  category: "CP" | "AP" | "CA";
  badge: string;
  examples: string[];
  partitionBehavior: string;
  useCase: string;
}

export const CAP_SYSTEM_PROFILES: CapSystemItem[] = [
  {
    name: "CP Systems",
    category: "CP",
    badge: "Consistency + Partition Tolerance",
    examples: ["MongoDB", "HBase", "CockroachDB", "etcd", "ZooKeeper"],
    partitionBehavior: "Rejects writes or returns errors on disconnected partition until nodes sync.",
    useCase: "Financial ledgers, consensus locks, inventory counters.",
  },
  {
    name: "AP Systems",
    category: "AP",
    badge: "Availability + Partition Tolerance",
    examples: ["Apache Cassandra", "Amazon DynamoDB", "CouchDB"],
    partitionBehavior: "Accepts writes & serves reads on any reachable node, returning potentially stale data.",
    useCase: "Social media feeds, telemetry, shopping carts, chat streams.",
  },
  {
    name: "CA Systems",
    category: "CA",
    badge: "Consistency + Availability",
    examples: ["PostgreSQL (Single Instance)", "MySQL (Single Instance)", "SQLite"],
    partitionBehavior: "Cannot tolerate network partitions across multiple distributed servers.",
    useCase: "Traditional monolithic databases on a single physical machine.",
  },
];

export interface CapTheoremVisualState {
  currentStepIndex: number;
  selectedModel: "CP" | "AP" | "CA";
  networkPartitionActive: boolean;
  writtenValue: number;
  node1Val: number;
  node2Val: number;
}

export const capTheoremLesson: Lesson = {
  pseudocode: [
    "// CAP Theorem Distributed Decision Engine",
    "function handlePartitionedRead(nodeId, clientKey):",
    "  if isNetworkPartitioned(nodeId):",
    "    if systemStrategy == 'CP_CONSISTENCY':",
    "      // Reject request to avoid serving stale data",
    "      raise ConsistencyError('Cannot verify quorum sync with Leader')",
    "      ",
    "    if systemStrategy == 'AP_AVAILABILITY':",
    "      // Return local copy immediately to preserve 100% availability",
    "      return node.localRead(clientKey) // Might be stale!",
    "      ",
    "  return node.read(clientKey)",
  ],

  steps: [
    {
      narration:
        "Step 1: Normal Distributed State (No Partition). Nodes A and B are synchronized. Variable X = 5 across both nodes.",
      activeLine: 11,
      state: {
        networkState: "Connected (Healthy)",
        nodeA_Value: "X = 5",
        nodeB_Value: "X = 5",
        consistency: "100% Consistent",
        availability: "100% Available",
      },
      visualState: {
        currentStepIndex: 0,
        selectedModel: "CP",
        networkPartitionActive: false,
        writtenValue: 5,
        node1Val: 5,
        node2Val: 5,
      } satisfies CapTheoremVisualState,
    },
    {
      narration:
        "Step 2: Network Partition Occurs (P)! Cable severed between Node A and Node B. Client writes X = 10 to Node A.",
      activeLine: 3,
      state: {
        networkState: "PARTITIONED (Split Network)",
        nodeA_Value: "X = 10 (Updated)",
        nodeB_Value: "X = 5 (Stale - Disconnected)",
        tradeOff: "Must choose CP or AP for Node B reads!",
      },
      visualState: {
        currentStepIndex: 1,
        selectedModel: "CP",
        networkPartitionActive: true,
        writtenValue: 10,
        node1Val: 10,
        node2Val: 5,
      } satisfies CapTheoremVisualState,
    },
    {
      narration:
        "Step 3: CP Decision (Consistency). Client queries Node B. Node B refuses to serve stale X=5 and returns an Error (Sacrifices Availability).",
      activeLine: 5,
      state: {
        strategy: "CP (Consistency Focused)",
        clientQueryToNodeB: "SELECT X",
        nodeB_Response: "HTTP 503 / ConsistencyError",
        result: "Zero Stale Reads (Sacrifices Availability)",
      },
      visualState: {
        currentStepIndex: 2,
        selectedModel: "CP",
        networkPartitionActive: true,
        writtenValue: 10,
        node1Val: 10,
        node2Val: 5,
      } satisfies CapTheoremVisualState,
    },
    {
      narration:
        "Step 4: AP Decision (Availability). Client queries Node B. Node B returns X=5 immediately without error (Sacrifices Consistency for 100% Uptime).",
      activeLine: 8,
      state: {
        strategy: "AP (Availability Focused)",
        clientQueryToNodeB: "SELECT X",
        nodeB_Response: "X = 5 (Stale Data)",
        result: "100% Uptime (Sacrifices Immediate Consistency)",
      },
      visualState: {
        currentStepIndex: 3,
        selectedModel: "AP",
        networkPartitionActive: true,
        writtenValue: 10,
        node1Val: 10,
        node2Val: 5,
      } satisfies CapTheoremVisualState,
    },
  ],
};
