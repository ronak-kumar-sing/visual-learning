import type { Lesson } from "@/lib/system-design/types";

export interface BTreeNodeItem {
  id: string;
  keys: number[];
  level: "root" | "internal" | "leaf";
  rows?: { id: number; name: string }[];
}

export const SAMPLE_BTREE_NODES: BTreeNodeItem[] = [
  { id: "root", keys: [50], level: "root" },
  { id: "int-left", keys: [25], level: "internal" },
  { id: "int-right", keys: [75], level: "internal" },
  {
    id: "leaf-1",
    keys: [10, 20],
    level: "leaf",
    rows: [
      { id: 10, name: "Alice" },
      { id: 20, name: "Bob" },
    ],
  },
  {
    id: "leaf-2",
    keys: [30, 40],
    level: "leaf",
    rows: [
      { id: 30, name: "Charlie" },
      { id: 40, name: "David" },
    ],
  },
  {
    id: "leaf-3",
    keys: [60, 70],
    level: "leaf",
    rows: [
      { id: 60, name: "Emma" },
      { id: 70, name: "Frank" },
    ],
  },
  {
    id: "leaf-4",
    keys: [80, 90],
    level: "leaf",
    rows: [
      { id: 80, name: "Grace" },
      { id: 90, name: "Hank" },
    ],
  },
];

export interface IndexingVisualState {
  currentStepIndex: number;
  lookupMode: "btree-index" | "full-scan" | "write-penalty";
  targetId: number;
  pagesReadCount: number;
  activePathNodes: string[];
}

export const indexingLesson: Lesson = {
  pseudocode: [
    "// Database B-Tree Index vs Full Table Scan Search",
    "function queryUserById(targetId, useIndex):",
    "  if not useIndex:",
    "    // 1. Full Table Scan: O(N) Disk I/O reads every single disk page",
    "    for page in database.allDiskPages():",
    "      if page.contains(targetId): return page.readRow(targetId)",
    "    ",
    "  // 2. B-Tree Index Seek: O(log N) logarithmic tree traversal",
    "  currNode = btree.getRoot()",
    "  while currNode.isNotLeaf():",
    "    currNode = currNode.traversePointer(targetId)",
    "  return currNode.getLeafRow(targetId) // Only 3 disk page reads!",
  ],

  steps: [
    {
      narration:
        "Step 1: Full Table Scan (No Index). Querying WHERE id = 70 without an index forces the engine to scan every table row O(N), reading 1,000,000 pages.",
      activeLine: 4,
      state: {
        query: "SELECT * FROM users WHERE id = 70",
        strategy: "Full Table Scan (Sequential)",
        complexity: "O(N) Linear Time",
        diskPagesRead: "1,000,000 Pages (Heavy Disk I/O)",
        latency: "450 ms (Slow)",
      },
      visualState: {
        currentStepIndex: 0,
        lookupMode: "full-scan",
        targetId: 70,
        pagesReadCount: 1000000,
        activePathNodes: ["leaf-1", "leaf-2", "leaf-3"],
      } satisfies IndexingVisualState,
    },
    {
      narration:
        "Step 2: B-Tree Index Seek. Engine starts at Root (50 ➔ right pointer), moves to Internal (75 ➔ left pointer), and lands on Leaf in 3 page reads!",
      activeLine: 9,
      state: {
        query: "SELECT * FROM users WHERE id = 70 (Indexed)",
        strategy: "B-Tree Index Seek",
        complexity: "O(log N) Logarithmic",
        diskPagesRead: "3 Pages (Root ➔ Internal ➔ Leaf)",
        latency: "0.8 ms (Blazing Fast)",
      },
      visualState: {
        currentStepIndex: 1,
        lookupMode: "btree-index",
        targetId: 70,
        pagesReadCount: 3,
        activePathNodes: ["root", "int-right", "leaf-3"],
      } satisfies IndexingVisualState,
    },
    {
      narration:
        "Step 3: The Write Penalty Trade-off. Every INSERT/UPDATE/DELETE requires rebalancing the B-Tree and updating index files, increasing write latency.",
      activeLine: 12,
      state: {
        query: "INSERT INTO users (id, name) VALUES (95, 'Ivy')",
        strategy: "B-Tree Page Split & Rebalance",
        complexity: "O(log N) + Index Maintenance Cost",
        diskPagesRead: "Tree Rebalance + WAL Append",
        tradeOff: "Fast Reads vs Slower Writes",
      },
      visualState: {
        currentStepIndex: 2,
        lookupMode: "write-penalty",
        targetId: 95,
        pagesReadCount: 4,
        activePathNodes: ["root", "int-right", "leaf-4"],
      } satisfies IndexingVisualState,
    },
  ],
};
