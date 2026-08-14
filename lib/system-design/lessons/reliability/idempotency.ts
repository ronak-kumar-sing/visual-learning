import type { Lesson } from "@/lib/system-design/types";

export interface HttpMethodIdempotency {
  method: string;
  isIdempotent: boolean;
  isSafe: boolean;
  description: string;
}

export const HTTP_IDEMPOTENCY_MATRIX: HttpMethodIdempotency[] = [
  { method: "GET", isIdempotent: true, isSafe: true, description: "Read-only; produces zero side effects." },
  { method: "PUT", isIdempotent: true, isSafe: false, description: "Overwrites entire resource state to identical target values." },
  { method: "DELETE", isIdempotent: true, isSafe: false, description: "Deleting a resource 5 times yields the same final state (resource deleted)." },
  { method: "POST", isIdempotent: false, isSafe: false, description: "Creates a new resource every time unless guarded by an Idempotency Key." },
  { method: "PATCH", isIdempotent: false, isSafe: false, description: "Non-idempotent if operation appends (e.g. increment balance)." },
];

export interface IdempotencyVisualState {
  currentStepIndex: number;
  requestCount: number;
  totalChargedAmount: number;
  isDuplicateBlocked: boolean;
}

export const idempotencyLesson: Lesson = {
  pseudocode: [
    "// Robust Idempotent Payment Processor (Stripe / PayPal Architecture)",
    "app.post('/v1/charges', async (req, res) => {",
    "  const idempotencyKey = req.headers['idempotency-key'];",
    "  if (!idempotencyKey) return res.status(400).send('Idempotency-Key header required');",
    "  ",
    "  // 1. Try to acquire distributed lock in Redis (NX = Only if Not Exists)",
    "  const lock = await redis.set(`idem:${idempotencyKey}`, 'PROCESSING', 'NX', 'EX', 120);",
    "  ",
    "  if (!lock) {",
    "    // 2. Lock failed ➔ Request is a retry! Fetch cached response from DB",
    "    const cachedResult = await redis.get(`idem:result:${idempotencyKey}`);",
    "    if (cachedResult) return res.status(200).json(JSON.parse(cachedResult)); // Replay receipt",
    "    return res.status(409).send('Concurrent request in flight');",
    "  }",
    "  ",
    "  // 3. Process payment once and cache receipt",
    "  const charge = await bankGateway.chargeCard(req.body.amount);",
    "  await redis.set(`idem:result:${idempotencyKey}`, JSON.stringify(charge), 'EX', 86400);",
    "  return res.status(200).json(charge);",
    "});",
  ],

  steps: [
    {
      narration:
        "Step 1: First Attempt (Payment Processed). User clicks 'Pay $149'. Client sends Idempotency-Key: uuid-9b1d. Card is charged $149 and receipt is cached in Redis.",
      activeLine: 6,
      state: {
        requestAttempt: "Attempt 1 (Original Request)",
        idempotencyKey: "uuid-9b1deb4d-3a72",
        cardChargeStatus: "Charged $149.00 USD ✓",
        cachedInRedis: "Receipt saved with 24h TTL",
      },
      visualState: {
        currentStepIndex: 0,
        requestCount: 1,
        totalChargedAmount: 149,
        isDuplicateBlocked: false,
      } satisfies IdempotencyVisualState,
    },
    {
      narration:
        "Step 2: Network Timeout / User Retries. User double-clicks 'Pay' after a connection blip. Client re-sends identical Idempotency-Key: uuid-9b1d.",
      activeLine: 9,
      state: {
        requestAttempt: "Attempt 2 (Accidental Double Click)",
        idempotencyKey: "uuid-9b1deb4d-3a72 (Same Key)",
        redisCheck: "Key Found in Redis Cache!",
        action: "Bypasses Bank Charge Gateway",
      },
      visualState: {
        currentStepIndex: 1,
        requestCount: 2,
        totalChargedAmount: 149,
        isDuplicateBlocked: true,
      } satisfies IdempotencyVisualState,
    },
    {
      narration:
        "Step 3: Cached Receipt Replay (Zero Double-Charge). Server returns the cached receipt in 1ms. Total billed amount remains exactly $149!",
      activeLine: 12,
      state: {
        requestAttempt: "Attempt 2 Result",
        totalBilled: "$149.00 (Zero duplicate charge ✓)",
        response: "Cached Receipt Replayed in 1ms",
        guarantee: "Strict Idempotency Enforced",
      },
      visualState: {
        currentStepIndex: 2,
        requestCount: 2,
        totalChargedAmount: 149,
        isDuplicateBlocked: true,
      } satisfies IdempotencyVisualState,
    },
  ],
};
