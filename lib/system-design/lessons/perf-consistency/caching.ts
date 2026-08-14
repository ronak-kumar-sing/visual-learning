import type { Lesson } from "@/lib/system-design/types";

export type CachingPattern =
  | "cache-aside"
  | "write-through"
  | "write-behind"
  | "lru-eviction";

export interface CachingDetailItem {
  id: CachingPattern;
  name: string;
  badge: string;
  readFlow: string;
  writeFlow: string;
  bestFor: string;
  tradeOff: string;
}

export const CACHING_STRATEGIES_DETAIL: CachingDetailItem[] = [
  {
    id: "cache-aside",
    name: "Cache-Aside (Lazy Loading)",
    badge: "Most Popular",
    readFlow: "App reads Cache ➔ On Miss, reads DB and writes to Cache.",
    writeFlow: "App writes directly to DB, then invalidates (deletes) Cache key.",
    bestFor: "Read-heavy web apps, user profiles, product catalogs.",
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
    id: "lru-eviction",
    name: "LRU Eviction (O(1))",
    badge: "Memory Safety",
    readFlow: "Hash Map O(1) key lookup moves accessed node to Head (MRU).",
    writeFlow: "When memory buffer is full, node at Tail (LRU) is evicted.",
    bestFor: "Bounded memory management under high throughput traffic spikes.",
    tradeOff: "Requires extra memory pointers for doubly-linked list nodes.",
  },
];

export interface CachingVisualState {
  currentStepIndex: number;
  activePattern: CachingPattern;
  cacheHit: boolean;
  flowStep: number;
}

export const cachingLesson: Lesson = {
  pseudocode: [
    "// Comprehensive In-Memory Caching Engine (Redis / Memcached)",
    "function getCachedResource(key, pattern):",
    "  switch pattern:",
    "    case 'CACHE_ASIDE':",
    "      // 1. Read from Redis Cache in-memory (0.5ms)",
    "      val = redis.get(key)",
    "      if val != null: return val // Cache Hit (0% DB Load)",
    "      ",
    "      // 2. Cache Miss ➔ Fallback to PostgreSQL (15ms)",
    "      val = db.query('SELECT * FROM items WHERE id = ?', key)",
    "      redis.set(key, val, TTL=3600)",
    "      return val",
    "      ",
    "    case 'LRU_EVICTION':",
    "      // Evict least recently accessed key when RAM exceeds limit",
    "      if redis.memoryUsage() > MAX_RAM: redis.evictTailNode()",
  ],

  steps: [
    {
      narration:
        "Step 1: Cache-Aside (Cache Hit). Client queries user:42. App finds key in Redis memory in 0.5ms, returning instantly with 0% DB load.",
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
        activePattern: "cache-aside",
        cacheHit: true,
        flowStep: 1,
      } satisfies CachingVisualState,
    },
    {
      narration:
        "Step 2: Cache-Aside (Cache Miss). Key user:99 is not in Redis. App queries PostgreSQL (15ms), populates Redis with TTL=3600, and returns data.",
      activeLine: 9,
      state: {
        pattern: "Cache-Aside (Lazy Loading)",
        requestKey: "user:99",
        status: "Cache MISS ➔ DB Fallback",
        latency: "15 ms (Disk I/O)",
        databaseHit: "Yes (Populates Cache)",
      },
      visualState: {
        currentStepIndex: 1,
        activePattern: "cache-aside",
        cacheHit: false,
        flowStep: 2,
      } satisfies CachingVisualState,
    },
    {
      narration:
        "Step 3: LRU Eviction Under Memory Cap. Cache memory reaches 100% capacity. LRU algorithm automatically evicts the least recently accessed key.",
      activeLine: 14,
      state: {
        pattern: "LRU Eviction (Least Recently Used)",
        capacity: "100% Saturated (4/4 Slots)",
        evictedKey: "user:10 (David - 120s idle)",
        newHeadKey: "user:99 (Inserted at Head)",
      },
      visualState: {
        currentStepIndex: 2,
        activePattern: "lru-eviction",
        cacheHit: true,
        flowStep: 3,
      } satisfies CachingVisualState,
    },
  ],
};
