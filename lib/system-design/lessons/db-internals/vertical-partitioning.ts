import type { Lesson } from "@/lib/system-design/types";

export interface ColumnDetailItem {
  name: string;
  type: string;
  sizeBytes: number;
  frequency: "hot" | "cold";
  targetTable: "users_core" | "users_profile";
}

export const USER_TABLE_COLUMNS: ColumnDetailItem[] = [
  { name: "user_id", type: "INT (PK)", sizeBytes: 4, frequency: "hot", targetTable: "users_core" },
  { name: "name", type: "VARCHAR(50)", sizeBytes: 50, frequency: "hot", targetTable: "users_core" },
  { name: "email", type: "VARCHAR(100)", sizeBytes: 100, frequency: "hot", targetTable: "users_core" },
  { name: "role", type: "VARCHAR(20)", sizeBytes: 20, frequency: "hot", targetTable: "users_core" },
  { name: "bio_description", type: "TEXT", sizeBytes: 2000, frequency: "cold", targetTable: "users_profile" },
  { name: "avatar_image_blob", type: "BYTEA", sizeBytes: 8000, frequency: "cold", targetTable: "users_profile" },
];

export interface VerticalPartitioningVisualState {
  currentStepIndex: number;
  viewMode: "monolith" | "partitioned" | "page-packing";
  activeQuery: "core" | "full";
}

export const verticalPartitioningLesson: Lesson = {
  pseudocode: [
    "// Vertical Partitioning (Column Split Architecture)",
    "// 1. Before: Single Bloated Table (Row size = ~10,174 bytes)",
    "// Reading 1000 users requires reading 1000 * 10KB = 10MB of Disk I/O!",
    "",
    "// 2. After: Split into Hot and Cold Tables by Column Access Frequency",
    "CREATE TABLE users_core (",
    "  user_id INT PRIMARY KEY,",
    "  name VARCHAR(50),",
    "  email VARCHAR(100),",
    "  role VARCHAR(20)",
    "); // Row size: 174 bytes (fits 46 rows per 8KB page!)",
    "",
    "CREATE TABLE users_profile (",
    "  user_id INT PRIMARY KEY REFERENCES users_core(user_id),",
    "  bio_description TEXT,",
    "  avatar_image_blob BYTEA",
    "); // Cold table only queried on demand",
  ],

  steps: [
    {
      narration:
        "Step 1: The Bloated Monolith Table Problem. Each row is 10KB due to large text and blob columns. An 8KB memory buffer page can only fit 0.8 rows!",
      activeLine: 2,
      state: {
        tableStructure: "Single Monolithic Table (users)",
        avgRowSize: "10,174 Bytes (~10KB)",
        pagePacking: "0.8 Rows per 8KB Disk Page",
        ioEfficiency: "Very Low (Reading 1,000 rows burns 10MB I/O)",
      },
      visualState: {
        currentStepIndex: 0,
        viewMode: "monolith",
        activeQuery: "core",
      } satisfies VerticalPartitioningVisualState,
    },
    {
      narration:
        "Step 2: Vertical Partitioning by Column Access. Move hot columns (id, name, email, role) to users_core, and large cold columns to users_profile.",
      activeLine: 6,
      state: {
        tableStructure: "2 Tables: users_core + users_profile",
        hotRowSize: "174 Bytes (users_core)",
        coldRowSize: "10,000 Bytes (users_profile)",
        pagePacking: "46 Rows per 8KB Disk Page (57x Improvement!)",
      },
      visualState: {
        currentStepIndex: 1,
        viewMode: "partitioned",
        activeQuery: "core",
      } satisfies VerticalPartitioningVisualState,
    },
    {
      narration:
        "Step 3: High-Speed I/O Page Packing. 95% of queries only touch users_core. The database buffer pool caches 46x more users in the same RAM!",
      activeLine: 11,
      state: {
        query: "SELECT user_id, name, email FROM users_core",
        bufferHitRatio: "99.4% Cached in RAM",
        diskIoReduction: "98.2% Reduction in Disk Reads",
        systemPerformance: "Blazing Fast Core Queries ✓",
      },
      visualState: {
        currentStepIndex: 2,
        viewMode: "page-packing",
        activeQuery: "core",
      } satisfies VerticalPartitioningVisualState,
    },
  ],
};
