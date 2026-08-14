import type { Lesson } from "@/lib/system-design/types";

export interface ConsistencyPatternItem {
  id: "strong" | "causal" | "read-after-write" | "eventual";
  name: string;
  badge: string;
  latencyLevel: string;
  guarantee: string;
  example: string;
}

export const CONSISTENCY_PATTERNS: ConsistencyPatternItem[] = [
  {
    id: "strong",
    name: "Strong Consistency (Linearizability)",
    badge: "Maximum Strictness",
    latencyLevel: "High (Synchronous Quorum)",
    guarantee: "Every read operation is guaranteed to receive the most recent write across all nodes.",
    example: "Bank account transfers, stock exchange order matching.",
  },
  {
    id: "causal",
    name: "Causal Consistency",
    badge: "Order Preserving",
    latencyLevel: "Medium",
    guarantee: "Causally related operations (e.g. a question and its reply) are observed in the same sequence by all clients.",
    example: "Forum comment threads, chat app replies.",
  },
  {
    id: "read-after-write",
    name: "Read-After-Write (Read-Your-Writes)",
    badge: "User Experience Priority",
    latencyLevel: "Low to Medium",
    guarantee: "A user will always immediately view updates they submitted themselves, even if replicas lag for other users.",
    example: "Updating profile photo, creating a tweet/status update.",
  },
  {
    id: "eventual",
    name: "Eventual Consistency",
    badge: "Maximum Performance",
    latencyLevel: "Ultra Low (Sub-millisecond)",
    guarantee: "All replicas will eventually converge to the same value in the absence of new updates.",
    example: "DNS propagation, YouTube video view counts, social follower counters.",
  },
];

export interface ConsistencyPatternsVisualState {
  currentStepIndex: number;
  activeModel: "strong" | "read-after-write" | "eventual";
  authorViewFresh: boolean;
  followerReplicationLagMs: number;
}

export const consistencyPatternsLesson: Lesson = {
  pseudocode: [
    "// Consistency Pattern & Quorum Evaluation Engine",
    "function evaluateQuorumConsistency(N, W, R):",
    "  // N = Total Replicas, W = Write Quorum, R = Read Quorum",
    "  if (W + R > N):",
    "    return {",
    "      guarantee: 'STRONG_CONSISTENCY',",
    "      reason: 'Read and write quorums overlap by at least 1 up-to-date node.'",
    "    }",
    "  else:",
    "    return {",
    "      guarantee: 'EVENTUAL_CONSISTENCY',",
    "      reason: 'Risk of stale reads because read set may miss newest write.'",
    "    }",
  ],

  steps: [
    {
      narration:
        "Step 1: Strong Consistency (W + R > N). In a 3-node cluster with W=2 and R=2, reads and writes are guaranteed to overlap on at least 1 node.",
      activeLine: 4,
      state: {
        model: "Strong Consistency (Quorum)",
        quorumMath: "W(2) + R(2) = 4 > N(3) ✓",
        guarantee: "100% Linearizable (Zero Stale Reads)",
        latency: "Higher Write Latency",
      },
      visualState: {
        currentStepIndex: 0,
        activeModel: "strong",
        authorViewFresh: true,
        followerReplicationLagMs: 0,
      } satisfies ConsistencyPatternsVisualState,
    },
    {
      narration:
        "Step 2: Read-Your-Own-Writes Pattern. User A updates their bio. User A reads directly from Leader (fresh), while User B reads from Replica (50ms lag).",
      activeLine: 5,
      state: {
        model: "Read-After-Write Consistency",
        userA_View: "Immediate Fresh Bio (Author Session)",
        userB_View: "Stale Bio for 50ms (Asynchronous Replica)",
        userExperience: "Seamless for Author ✓",
      },
      visualState: {
        currentStepIndex: 1,
        activeModel: "read-after-write",
        authorViewFresh: true,
        followerReplicationLagMs: 50,
      } satisfies ConsistencyPatternsVisualState,
    },
    {
      narration:
        "Step 3: Eventual Consistency. YouTube video view count. Writes update locally in 0.5ms and gossip asynchronously across global nodes.",
      activeLine: 9,
      state: {
        model: "Eventual Consistency (Gossip)",
        throughput: "1,000,000 Writes/Sec",
        convergenceTime: "~2-5 seconds globally",
        latency: "Ultra-Fast (0.5ms local ACK)",
      },
      visualState: {
        currentStepIndex: 2,
        activeModel: "eventual",
        authorViewFresh: true,
        followerReplicationLagMs: 2000,
      } satisfies ConsistencyPatternsVisualState,
    },
  ],
};
