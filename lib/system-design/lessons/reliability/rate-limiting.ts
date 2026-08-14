import type { Lesson } from "@/lib/system-design/types";

export type RateLimitAlgorithm =
  | "token-bucket"
  | "leaky-bucket"
  | "fixed-window"
  | "sliding-window";

export interface RateLimitAlgoDetail {
  id: RateLimitAlgorithm;
  name: string;
  badge: string;
  mechanism: string;
  burstHandling: string;
  memoryUsage: string;
}

export const RATE_LIMIT_ALGORITHMS: RateLimitAlgoDetail[] = [
  {
    id: "token-bucket",
    name: "Token Bucket",
    badge: "Industry Standard (Stripe/AWS)",
    mechanism: "Tokens added at fixed rate r/sec up to capacity C. Request takes 1 token.",
    burstHandling: "Allows short bursts up to max capacity C.",
    memoryUsage: "O(1) memory per user (stores only token count + timestamp).",
  },
  {
    id: "leaky-bucket",
    name: "Leaky Bucket",
    badge: "Constant Outflow",
    mechanism: "Requests enter FIFO buffer and leak out at a strictly constant rate.",
    burstHandling: "Smooths out bursts into continuous steady traffic flow.",
    memoryUsage: "O(Queue Size) memory per user.",
  },
  {
    id: "fixed-window",
    name: "Fixed Window Counter",
    badge: "Simple But Flawed",
    mechanism: "Increments counter per minute window (e.g. 12:00:00 to 12:01:00).",
    burstHandling: "Vulnerable to 2x boundary spikes at window edges (e.g. 12:00:59 + 12:01:01).",
    memoryUsage: "O(1) memory per user.",
  },
  {
    id: "sliding-window",
    name: "Sliding Window Counter",
    badge: "Accurate & Efficient",
    mechanism: "Weights previous window count + current window count to smooth boundary.",
    burstHandling: "Prevents 2x boundary spikes completely with minimal calculation overhead.",
    memoryUsage: "O(1) memory per user.",
  },
];

export interface RateLimitingVisualState {
  currentStepIndex: number;
  selectedAlgo: RateLimitAlgorithm;
  currentTokens: number;
  isRateLimited: boolean;
}

export const rateLimitingLesson: Lesson = {
  pseudocode: [
    "// Token Bucket Rate Limiting Algorithm (Redis Implementation)",
    "function allowRequest(userIp, capacity = 5, refillRatePerSec = 1):",
    "  const now = Date.now() / 1000",
    "  let [tokens, lastRefill] = await redis.mget(`rate:${userIp}:tokens`, `rate:${userIp}:last`)",
    "  ",
    "  // 1. Refill tokens based on elapsed time",
    "  const elapsed = now - (lastRefill || now)",
    "  tokens = Math.min(capacity, (tokens || capacity) + elapsed * refillRatePerSec)",
    "  ",
    "  // 2. Check if token available",
    "  if (tokens >= 1):",
    "    await redis.mset(`rate:${userIp}:tokens`, tokens - 1, `rate:${userIp}:last`, now)",
    "    return { allowed: true, remaining: Math.floor(tokens - 1) }",
    "  else:",
    "    return { allowed: false, status: 429, retryAfter: Math.ceil(1 / refillRatePerSec) }",
  ],

  steps: [
    {
      narration:
        "Step 1: Normal Request (Tokens Available). User has 5/5 tokens in their bucket. A request consumes 1 token and proceeds to backend in 0.5ms.",
      activeLine: 9,
      state: {
        algorithm: "Token Bucket (Redis)",
        bucketCapacity: "5 Tokens",
        availableTokens: "4 / 5 Tokens Remaining",
        status: "HTTP 200 OK (Allowed ✓)",
      },
      visualState: {
        currentStepIndex: 0,
        selectedAlgo: "token-bucket",
        currentTokens: 4,
        isRateLimited: false,
      } satisfies RateLimitingVisualState,
    },
    {
      narration:
        "Step 2: Traffic Burst. User fires 4 requests in rapid succession, draining the bucket to 0 tokens.",
      activeLine: 11,
      state: {
        algorithm: "Token Bucket (Redis)",
        availableTokens: "0 / 5 Tokens (Bucket Empty)",
        refillSpeed: "1 token every 1.0 second",
        status: "Capacity Saturated",
      },
      visualState: {
        currentStepIndex: 1,
        selectedAlgo: "token-bucket",
        currentTokens: 0,
        isRateLimited: false,
      } satisfies RateLimitingVisualState,
    },
    {
      narration:
        "Step 3: Rate Limit Exceeded (HTTP 429). The next request is rejected with HTTP 429 Too Many Requests and a Retry-After header, protecting backend servers.",
      activeLine: 13,
      state: {
        algorithm: "Token Bucket (Redis)",
        availableTokens: "0 Tokens",
        status: "HTTP 429 Too Many Requests ⛔",
        header: "Retry-After: 2 seconds",
      },
      visualState: {
        currentStepIndex: 2,
        selectedAlgo: "token-bucket",
        currentTokens: 0,
        isRateLimited: true,
      } satisfies RateLimitingVisualState,
    },
  ],
};
