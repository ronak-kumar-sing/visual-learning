import type { Lesson } from "@/lib/system-design/types";

export interface ReplicaNodeItem {
  id: number;
  name: string;
  role: "primary" | "replica";
  lagMs: number;
  isAlive: boolean;
}

export const SAMPLE_REPLICAS: ReplicaNodeItem[] = [
  { id: 1, name: "Database Primary (Leader)", role: "primary", lagMs: 0, isAlive: true },
  { id: 2, name: "Read Replica #1", role: "replica", lagMs: 15, isAlive: true },
  { id: 3, name: "Read Replica #2", role: "replica", lagMs: 40, isAlive: true },
];

export interface ReplicationVisualState {
  currentStepIndex: number;
  replicationType: "async" | "sync";
  primaryAlive: boolean;
  promotedLeaderId: number | null;
  writeInProgress: boolean;
}

export const replicationLesson: Lesson = {
  pseudocode: [
    "// Leader-Follower Database Replication Engine",
    "function handleDatabaseWrite(sqlWriteQuery):",
    "  // 1. Commit write to Primary Leader Write-Ahead Log (WAL)",
    "  leader.executeWrite(sqlWriteQuery)",
    "  binlogRecord = leader.appendBinlog(sqlWriteQuery)",
    "  ",
    "  // 2. Stream Binary Replication Log to Follower Replicas",
    "  for replica in leader.getFollowers():",
    "    if replicationMode == 'SYNCHRONOUS':",
    "      replica.applyBinlog(binlogRecord) // Waits for replica ACK",
    "    else:",
    "      replica.streamAsync(binlogRecord) // Async with minor lag",
    "      ",
    "  // 3. Automated Failover & Leader Election on Crash",
    "  leader.onCrash(() => cluster.promoteFollowerToLeader(replica1))",
  ],

  steps: [
    {
      narration:
        "Step 1: Write to Primary Leader. Client sends write query to Primary DB. Leader writes to local storage and appends to binlog.",
      activeLine: 3,
      state: {
        operation: "WRITE (INSERT/UPDATE)",
        target: "Primary Database (Leader)",
        role: "Single Source of Truth",
        binlog: "Appended to WAL Log",
      },
      visualState: {
        currentStepIndex: 0,
        replicationType: "async",
        primaryAlive: true,
        promotedLeaderId: null,
        writeInProgress: true,
      } satisfies ReplicationVisualState,
    },
    {
      narration:
        "Step 2: Asynchronous Binlog Streaming. Primary broadcasts binary log stream to Read Replica #1 and Read Replica #2 in parallel.",
      activeLine: 10,
      state: {
        operation: "REPLICATION STREAM",
        target: "Read Replicas (#1 and #2)",
        mode: "Asynchronous (Low Write Latency)",
        replicationLag: "15ms - 40ms",
      },
      visualState: {
        currentStepIndex: 1,
        replicationType: "async",
        primaryAlive: true,
        promotedLeaderId: null,
        writeInProgress: false,
      } satisfies ReplicationVisualState,
    },
    {
      narration:
        "Step 3: Read-Scaling. Read-heavy user traffic is distributed across Read Replicas, offloading read pressure from the Primary Leader.",
      activeLine: 7,
      state: {
        operation: "READ (SELECT Queries)",
        target: "Distributed across Replicas",
        throughput: "10,000 Read Queries/Sec",
        readOffload: "90% Offloaded from Leader",
      },
      visualState: {
        currentStepIndex: 2,
        replicationType: "async",
        primaryAlive: true,
        promotedLeaderId: null,
        writeInProgress: false,
      } satisfies ReplicationVisualState,
    },
    {
      narration:
        "Step 4: Failover & Leader Election. Primary crashes! Cluster consensus algorithm automatically promotes Read Replica #1 to become the new Primary Leader.",
      activeLine: 13,
      state: {
        operation: "LEADER FAILOVER",
        previousPrimary: "Offline (Crashed)",
        newPrimary: "Read Replica #1 Promoted to Leader ✓",
        downtime: "Near Zero-Downtime Failover",
      },
      visualState: {
        currentStepIndex: 3,
        replicationType: "async",
        primaryAlive: false,
        promotedLeaderId: 2,
        writeInProgress: false,
      } satisfies ReplicationVisualState,
    },
  ],
};
