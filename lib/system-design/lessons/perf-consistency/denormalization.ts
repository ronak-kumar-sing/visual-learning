import type { Lesson } from "@/lib/system-design/types";

export interface DenormalizationModelComparison {
  dimension: string;
  normalized: string;
  denormalized: string;
}

export const DENORMALIZATION_COMPARISON: DenormalizationModelComparison[] = [
  {
    dimension: "Query Performance",
    normalized: "Slow (Requires multi-table JOINs on foreign keys: ~45ms)",
    denormalized: "Blazing Fast (Single table point lookup / zero joins: ~1.2ms)",
  },
  {
    dimension: "Write Overhead",
    normalized: "Fast (Write once in single normalized table: 1x Write)",
    denormalized: "Slow (Write amplification across duplicate rows: 100x Writes)",
  },
  {
    dimension: "Data Redundancy",
    normalized: "Zero Redundancy (Clean 3rd Normal Form / 3NF)",
    denormalized: "High Redundancy (User name duplicated across all orders)",
  },
  {
    dimension: "Consistency Risk",
    normalized: "100% Consistent (Single source of truth)",
    denormalized: "Eventual Consistency (Risk of stale copies during updates)",
  },
];

export interface DenormalizationVisualState {
  currentStepIndex: number;
  activeModel: "normalized" | "denormalized" | "cdc-sync";
  queryLatencyMs: number;
  joinCount: number;
}

export const denormalizationLesson: Lesson = {
  pseudocode: [
    "// Database Normalization vs Denormalization Trade-off",
    "function getOrderDetails(orderId, isDenormalized):",
    "  if not isDenormalized:",
    "    // 1. Normalized: Multi-table relational JOINs (45ms)",
    "    return db.query(`",
    "      SELECT o.id, u.name, u.email, p.title, p.price",
    "      FROM orders o",
    "      JOIN users u ON o.user_id = u.id",
    "      JOIN products p ON o.product_id = p.id",
    "      WHERE o.id = ?`, orderId)",
    "  ",
    "  // 2. Denormalized: Pre-aggregated single document read (1.2ms)",
    "  return db.query('SELECT * FROM orders_denormalized WHERE id = ?', orderId)",
  ],

  steps: [
    {
      narration:
        "Step 1: Normalized 3NF Schema. Data is split into 3 tables (Users, Orders, Products). Fetching an order requires 2 expensive JOINs (45ms).",
      activeLine: 5,
      state: {
        schemaModel: "Normalized (3NF)",
        tablesJoined: "3 Tables (Users, Orders, Products)",
        joinsCount: "2 Multi-Table JOINs",
        queryLatency: "45 ms (CPU & Memory Heavy)",
        dataIntegrity: "100% Consistent",
      },
      visualState: {
        currentStepIndex: 0,
        activeModel: "normalized",
        queryLatencyMs: 45,
        joinCount: 2,
      } satisfies DenormalizationVisualState,
    },
    {
      narration:
        "Step 2: Denormalized Pre-Joined View. User and Product names are embedded directly into orders_denormalized. Zero JOINs (1.2ms).",
      activeLine: 12,
      state: {
        schemaModel: "Denormalized Embedded Table",
        tablesJoined: "1 Table (orders_denormalized)",
        joinsCount: "0 JOINs (Point Lookup)",
        queryLatency: "1.2 ms (37x Speedup!)",
        dataIntegrity: "Duplicate Data Present",
      },
      visualState: {
        currentStepIndex: 1,
        activeModel: "denormalized",
        queryLatencyMs: 1.2,
        joinCount: 0,
      } satisfies DenormalizationVisualState,
    },
    {
      narration:
        "Step 3: Write Amplification & CDC Sync. When a user updates their email, Change Data Capture (CDC / Kafka) asynchronously updates 500 duplicate order records.",
      activeLine: 12,
      state: {
        schemaModel: "CDC Event-Driven Synchronization",
        trigger: "User updates email address",
        writeAmplification: "500 Order Records Updated Asynchronously",
        consistency: "Eventual Consistency (CDC Stream)",
      },
      visualState: {
        currentStepIndex: 2,
        activeModel: "cdc-sync",
        queryLatencyMs: 1.2,
        joinCount: 0,
      } satisfies DenormalizationVisualState,
    },
  ],
};
