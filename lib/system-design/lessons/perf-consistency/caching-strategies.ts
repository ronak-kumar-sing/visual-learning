import type { Lesson } from "@/lib/system-design/types";

export type CachingPattern =
  | "cache-aside"
  | "write-through"
  | "write-behind"
  | "write-around";

export interface CachingStrategyDetail {
  id: CachingPattern;
  name: string;
  badge: string;
  readFlow: string;
  writeFlow: string;
  bestFor: string;
  tradeOff: string;
}

export const CACHING_STRATEGIES: CachingStrategyDetail[] = [
  {
    id: "cache-aside",
    name: "Cache-Aside (Lazy Loading)",
    badge: "Most Popular",
    readFlow: "App reads Cache ➔ On Miss, reads DB and writes to Cache.",
    writeFlow: "App writes directly to DB, then invalidates (deletes) Cache key.",
    bestFor: "Read-heavy general web applications, user profiles, product catalogs.",
    tradeOff: "Initial cache miss penalty; risk of stale data if invalidation fails.",
  },
  {
    id: "write-through",
    name: "Write-Through",
    badge: "Strong Freshness",
    readFlow: "App reads from Cache (always populated by writes).",
    writeFlow: "App writes to Cache; Cache synchronously writes to DB before ACK.",
    bestFor: "Financial ledgers, real-time inventory where cache must never be stale.",
    tradeOff: "Higher write latency because both Cache and DB must succeed.",
  },
  {
    id: "write-behind",
    name: "Write-Behind (Write-Back)",
    badge: "Maximum Write Speed",
    readFlow: "App reads from Cache directly.",
    writeFlow: "App writes to Cache (instant ACK); Cache batches async writes to DB.",
    bestFor: "High-volume analytics tracking, gaming leaderboards, IoT metrics.",
    tradeOff: "Risk of data loss if Cache crashes before flushing batch to DB.",
  },
  {
    id: "write-around",
    name: "Write-Around",
    badge: "No Cache Pollution",
    readFlow: "App reads from Cache ➔ On Miss, loads from DB.",
    writeFlow: "App writes directly to DB, completely bypassing Cache.",
    bestFor: "Large log streams or archive data written once and rarely read.",
    tradeOff: "First read after write will always suffer a cache miss.",
  },
];

export interface CachingStrategiesVisualState {
  currentStepIndex: number;
  activeStrategy: CachingPattern;
  cacheHit: boolean;
  flowStep: number;
}

export const cachingStrategiesLesson: Lesson = {
  pseudocode: [
    "// Caching Strategy Decision Engine",
    "function handleDataRequest(key, pattern, writePayload = null):",
    "  switch pattern:",
    "    case 'CACHE_ASIDE':",
    "      // 1. Read from Redis Cache",
    "      val = redis.get(key)",
    "      if val != null: return val // Cache Hit (0.5ms)",
    "      // 2. Cache Miss ➔ Fallback to DB",
    "      val = db.query('SELECT * FROM items WHERE id = ?', key)",
    "      redis.set(key, val, TTL=3600)",
    "      return val",
    "      ",
    "    case 'WRITE_THROUGH':",
    "      // Synchronous dual write",
    "      redis.set(key, writePayload)",
    "      db.execute('UPDATE items SET val = ? WHERE id = ?', writePayload, key)",
    "      return { status: 'COMMITTED' }",
  ],

  steps: [
    {
      narration:
        "Step 1: Cache-Aside (Cache Hit). Client requests user:42. App finds key in Redis memory in 0.5ms, bypassing the database entirely.",
      activeLine: 5,
      state: {
        pattern: "Cache-Aside (Lazy Loading)",
        requestKey: "user:42",
        status: "Cache HIT ✓",
        latency: "0.5 ms (In-Memory RAM)",
        databaseHit: "No (0% DB Load)",
      },
      visualState: {
        currentStepIndex: 0,
        activeStrategy: "cache-aside",
        cacheHit: true,
        flowStep: 1,
      } satisfies CachingStrategiesVisualState,
    },
    {
      narration:
        "Step 2: Cache-Aside (Cache Miss). Key not in Redis. App queries PostgreSQL (12ms), stores result in Redis with TTL=3600, and returns data.",
      activeLine: 9,
      state: {
        pattern: "Cache-Aside (Lazy Loading)",
        requestKey: "user:99",
        status: "Cache MISS ➔ DB Fallback",
        latency: "12 ms (Disk I/O)",
        databaseHit: "Yes (Populates Cache)",
      },
      visualState: {
        currentStepIndex: 1,
        activeStrategy: "cache-aside",
        cacheHit: false,
        flowStep: 2,
      } satisfies CachingStrategiesVisualState,
    },
    {
      narration:
        "Step 3: Write-Through Pattern. Client writes new balance. App writes to Cache, which immediately flushes synchronously to DB before acknowledging.",
      activeLine: 14,
      state: {
        pattern: "Write-Through",
        requestKey: "balance:42",
        status: "Synchronous Dual Write",
        latency: "15 ms (Cache + DB)",
        consistency: "Strong (No Stale Reads)",
      },
      visualState: {
        currentStepIndex: 2,
        activeStrategy: "write-through",
        cacheHit: true,
        flowStep: 3,
      } satisfies CachingStrategiesVisualState,
    },
  ],
};
