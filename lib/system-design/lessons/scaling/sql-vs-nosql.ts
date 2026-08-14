import type { Lesson } from "@/lib/system-design/types";

export interface DatabaseModelComparison {
  dimension: string;
  sql: string;
  nosql: string;
}

export const SQL_VS_NOSQL_COMPARISON: DatabaseModelComparison[] = [
  {
    dimension: "Data Model",
    sql: "Structured Relational Tables with fixed Columns & Rows",
    nosql: "JSON Documents, Key-Value pairs, Wide-Column, Graph",
  },
  {
    dimension: "Schema",
    sql: "Rigid, predefined schema (ALTER TABLE required)",
    nosql: "Dynamic, schema-less (each record can have unique fields)",
  },
  {
    dimension: "Transaction Model",
    sql: "Strict ACID (Atomicity, Consistency, Isolation, Durability)",
    nosql: "BASE Model (Basically Available, Soft state, Eventual consistency)",
  },
  {
    dimension: "Scaling Strategy",
    sql: "Vertical Scaling (Scale-Up CPU/RAM) + Read Replicas",
    nosql: "Horizontal Scaling (Scale-Out Sharding across node clusters)",
  },
  {
    dimension: "Complex Joins",
    sql: "Native multi-table JOINs optimized by relational query engine",
    nosql: "Denormalized embedded documents (Joins handled in application code)",
  },
  {
    dimension: "Best Use Cases",
    sql: "Financial systems, ERP, e-commerce orders, relational integrity",
    nosql: "Social media feeds, real-time telemetry, session store, big data",
  },
];

export interface SqlVsNosqlVisualState {
  currentStepIndex: number;
  activeModel: "sql" | "nosql" | "cap";
  activeCapFocus: "ca" | "cp" | "ap";
}

export const sqlVsNosqlLesson: Lesson = {
  pseudocode: [
    "// Database Model Decision Matrix",
    "function selectDatabaseArchitecture(requirements):",
    "  // Step 1: Evaluate Schema & Relationship Constraints",
    "  if requirements.needsStrictAcid and requirements.hasRelationalJoins:",
    "    return configurePostgreSQL({",
    "      engine: 'Relational SQL',",
    "      schema: 'Rigid Table Columns',",
    "      consistency: 'Strong ACID',",
    "      scaling: 'Scale-Up + Read Replicas'",
    "    })",
    "  ",
    "  // Step 2: Evaluate Horizontal Scale & Flexible Documents",
    "  if requirements.highWriteThroughput or requirements.unstructuredData:",
    "    return configureMongoDB({",
    "      engine: 'Document NoSQL',",
    "      schema: 'Dynamic JSON Documents',",
    "      consistency: 'Eventual BASE',",
    "      scaling: 'Horizontal Auto-Sharding'",
    "    })",
  ],

  steps: [
    {
      narration:
        "Step 1: SQL Relational Model. Strict tables, typed columns, foreign key constraints, and ACID guarantees for relational integrity.",
      activeLine: 3,
      state: {
        model: "SQL (PostgreSQL / MySQL)",
        dataStructure: "Tables with Foreign Keys",
        consistency: "ACID (Strong Consistency)",
        scaling: "Vertical Scale-Up",
      },
      visualState: {
        currentStepIndex: 0,
        activeModel: "sql",
        activeCapFocus: "ca",
      } satisfies SqlVsNosqlVisualState,
    },
    {
      narration:
        "Step 2: NoSQL Document Model. Schema-free JSON documents, embedded relations, and native horizontal sharding across distributed clusters.",
      activeLine: 11,
      state: {
        model: "NoSQL (MongoDB / Cassandra)",
        dataStructure: "Dynamic JSON Documents",
        consistency: "BASE (Eventual Consistency)",
        scaling: "Horizontal Scale-Out Sharding",
      },
      visualState: {
        currentStepIndex: 1,
        activeModel: "nosql",
        activeCapFocus: "ap",
      } satisfies SqlVsNosqlVisualState,
    },
    {
      narration:
        "Step 3: CAP Theorem Trade-off. During network partition (P), choose Consistency (CP: MongoDB/HBase) or Availability (AP: Cassandra/DynamoDB).",
      activeLine: 13,
      state: {
        model: "CAP Theorem Decision",
        guarantee: "Pick 2 of 3: Consistency, Availability, Partition Tolerance",
        partitionRule: "Network partitions are inevitable in distributed systems",
        tradeOff: "CP (Wait for sync) vs AP (Serve stale data)",
      },
      visualState: {
        currentStepIndex: 2,
        activeModel: "cap",
        activeCapFocus: "cp",
      } satisfies SqlVsNosqlVisualState,
    },
  ],
};
