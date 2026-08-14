import type { Lesson } from "@/lib/system-design/types";

export interface ShardInstanceItem {
  id: number;
  name: string;
  keyRange: string;
  recordsCount: number;
  capacityGb: number;
}

export const SAMPLE_SHARDS: ShardInstanceItem[] = [
  { id: 1, name: "Shard #1 (Instance A)", keyRange: "hash(key) % 3 == 0", recordsCount: 1500000, capacityGb: 45 },
  { id: 2, name: "Shard #2 (Instance B)", keyRange: "hash(key) % 3 == 1", recordsCount: 1480000, capacityGb: 44 },
  { id: 3, name: "Shard #3 (Instance C)", keyRange: "hash(key) % 3 == 2", recordsCount: 1520000, capacityGb: 46 },
];

export interface ShardingVisualState {
  currentStepIndex: number;
  shardingMethod: "hash" | "range" | "scatter-gather";
  activeUserId: number;
  targetShardId: number;
}

export const shardingLesson: Lesson = {
  pseudocode: [
    "// Database Horizontal Sharding Router",
    "function routeShardedQuery(query, shardKey):",
    "  // 1. Single-Shard Point Lookup via Hash Function",
    "  if query.hasShardKey:",
    "    shardIndex = hash(shardKey) % TOTAL_SHARDS",
    "    targetShard = cluster.getShard(shardIndex)",
    "    return targetShard.execute(query) // O(1) direct single-node query",
    "  ",
    "  // 2. Scatter-Gather Cross-Shard Penalty (No Shard Key)",
    "  results = []",
    "  for shard in cluster.allShards(): // Broadcast to all physical nodes",
    "    results.append(shard.execute(query))",
    "  return mergeAndSortResults(results) // Expensive network & memory merge",
  ],

  steps: [
    {
      narration:
        "Step 1: Point Query with Shard Key. Querying user_id = 42 hashes directly to Shard #1 (42 % 3 == 0). Direct O(1) single-node execution.",
      activeLine: 5,
      state: {
        query: "SELECT * FROM users WHERE user_id = 42",
        routingStrategy: "Hash(42) % 3 = 0 ➔ Shard #1",
        queryType: "Single-Shard Point Lookup",
        latency: "1.2 ms (Blazing Fast)",
        shardsContacted: "1 of 3",
      },
      visualState: {
        currentStepIndex: 0,
        shardingMethod: "hash",
        activeUserId: 42,
        targetShardId: 1,
      } satisfies ShardingVisualState,
    },
    {
      narration:
        "Step 2: Range-Based Sharding. Sharding by Creation Date or User ID ranges allows efficient range queries but risks hotspotting on the latest shard.",
      activeLine: 6,
      state: {
        query: "SELECT * FROM orders WHERE id BETWEEN 1M AND 2M",
        routingStrategy: "Range Route: 1M-2M ➔ Shard #2",
        queryType: "Range Partition Scan",
        latency: "3.5 ms",
        shardsContacted: "1 of 3 (Targeted Range)",
      },
      visualState: {
        currentStepIndex: 1,
        shardingMethod: "range",
        activeUserId: 105,
        targetShardId: 2,
      } satisfies ShardingVisualState,
    },
    {
      narration:
        "Step 3: Scatter-Gather Penalty. Querying without a shard key (WHERE email = 'user@test.com') forces the router to broadcast to ALL shards and merge results.",
      activeLine: 10,
      state: {
        query: "SELECT * FROM users WHERE email = 'alex@gmail.com'",
        routingStrategy: "Scatter-Gather (No Shard Key)",
        queryType: "Cross-Shard Broadcast & Merge",
        latency: "68 ms (High Overhead)",
        shardsContacted: "3 of 3 (All Shards)",
      },
      visualState: {
        currentStepIndex: 2,
        shardingMethod: "scatter-gather",
        activeUserId: 999,
        targetShardId: 0, // All
      } satisfies ShardingVisualState,
    },
  ],
};
