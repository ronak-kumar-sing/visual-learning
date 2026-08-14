import type { Lesson } from "@/lib/system-design/types";

export type EvictionPolicy = "lru" | "lfu" | "fifo" | "ttl";

export interface CacheSlotItem {
  key: string;
  value: string;
  accessCount: number;
  lastAccessSecAgo: number;
}

export const INITIAL_CACHE_SLOTS: CacheSlotItem[] = [
  { key: "user:10", value: "Alice", accessCount: 14, lastAccessSecAgo: 5 },
  { key: "user:20", value: "Bob", accessCount: 2, lastAccessSecAgo: 45 },
  { key: "user:30", value: "Charlie", accessCount: 8, lastAccessSecAgo: 12 },
  { key: "user:40", value: "David", accessCount: 1, lastAccessSecAgo: 120 },
];

export interface CacheEvictionVisualState {
  currentStepIndex: number;
  policy: EvictionPolicy;
  slots: CacheSlotItem[];
  evictedKey: string | null;
  newInsertedKey: string | null;
}

export const cacheEvictionLesson: Lesson = {
  pseudocode: [
    "// LRU Cache Eviction Algorithm (O(1) Hash Map + Doubly Linked List)",
    "class LRUCache:",
    "  def put(key, value):",
    "    if key in self.map:",
    "      node = self.map[key]",
    "      node.val = value",
    "      self.list.moveToHead(node) // Mark most recently used",
    "    else:",
    "      if self.list.size >= CAPACITY:",
    "        // Evict Least Recently Used item at the Tail",
    "        tailNode = self.list.removeTail()",
    "        del self.map[tailNode.key]",
    "      newNode = self.list.addToHead(key, value)",
    "      self.map[key] = newNode",
  ],

  steps: [
    {
      narration:
        "Step 1: Cache is Full (4 / 4 Slots). Key user:40 is the Least Recently Used item (last accessed 120s ago).",
      activeLine: 9,
      state: {
        policy: "LRU (Least Recently Used)",
        capacity: "4 / 4 Slots (100% Full)",
        mostRecent: "user:10 (Alice, 5s ago)",
        leastRecent: "user:40 (David, 120s ago ➔ Eviction Target)",
      },
      visualState: {
        currentStepIndex: 0,
        policy: "lru",
        slots: INITIAL_CACHE_SLOTS,
        evictedKey: null,
        newInsertedKey: null,
      } satisfies CacheEvictionVisualState,
    },
    {
      narration:
        "Step 2: Insert New Key user:50 (Emma). LRU algorithm evicts user:40 from the Tail to make room for Emma at the Head.",
      activeLine: 11,
      state: {
        policy: "LRU (Least Recently Used)",
        action: "INSERT user:50 (Emma)",
        evictedItem: "user:40 (David EVICTED)",
        newHead: "user:50 (Emma at Head)",
      },
      visualState: {
        currentStepIndex: 1,
        policy: "lru",
        slots: [
          { key: "user:50", value: "Emma", accessCount: 1, lastAccessSecAgo: 0 },
          { key: "user:10", value: "Alice", accessCount: 14, lastAccessSecAgo: 5 },
          { key: "user:30", value: "Charlie", accessCount: 8, lastAccessSecAgo: 12 },
          { key: "user:20", value: "Bob", accessCount: 2, lastAccessSecAgo: 45 },
        ],
        evictedKey: "user:40",
        newInsertedKey: "user:50",
      } satisfies CacheEvictionVisualState,
    },
    {
      narration:
        "Step 3: Access Existing Key user:20 (Bob). Bob moves from the back of the queue straight to the Head (Most Recently Used).",
      activeLine: 6,
      state: {
        policy: "LRU (Least Recently Used)",
        action: "GET user:20 (Bob)",
        reorder: "user:20 moved to Head",
        leastRecent: "user:30 (Charlie is now next to evict)",
      },
      visualState: {
        currentStepIndex: 2,
        policy: "lru",
        slots: [
          { key: "user:20", value: "Bob", accessCount: 3, lastAccessSecAgo: 0 },
          { key: "user:50", value: "Emma", accessCount: 1, lastAccessSecAgo: 1 },
          { key: "user:10", value: "Alice", accessCount: 14, lastAccessSecAgo: 6 },
          { key: "user:30", value: "Charlie", accessCount: 8, lastAccessSecAgo: 13 },
        ],
        evictedKey: null,
        newInsertedKey: null,
      } satisfies CacheEvictionVisualState,
    },
  ],
};
