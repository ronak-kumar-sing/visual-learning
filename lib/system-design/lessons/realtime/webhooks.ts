import type { Lesson } from "@/lib/system-design/types";

export interface WebhookEventSample {
  id: string;
  type: string;
  source: string;
  hmacVerified: boolean;
  isIdempotent: boolean;
  status: "success" | "retry" | "duplicate";
}

export const SAMPLE_WEBHOOK_EVENT = {
  id: "evt_1N4kP02eZvKYlo2C",
  type: "payment_intent.succeeded",
  source: "Stripe Payment Gateway",
  amount: "$149.00 USD",
  customer: "alex@example.com",
};

export interface WebhooksVisualState {
  currentStepIndex: number;
  activeStage: "emission" | "hmac" | "idempotency" | "async-ack";
  retryAttempt: number;
}

export const webhooksLesson: Lesson = {
  pseudocode: [
    "// Robust Webhook Consumer Pipeline (Stripe / GitHub / Shopify)",
    "app.post('/webhooks/stripe', async (req, res) => {",
    "  // 1. HMAC-SHA256 Signature Verification",
    "  const signature = req.headers['stripe-signature'];",
    "  const event = verifyHmacSignature(req.rawBody, signature, WEBHOOK_SECRET);",
    "  ",
    "  // 2. Idempotency Check (Prevent duplicate charges / orders)",
    "  const isProcessed = await redis.set(`webhook:${event.id}`, 'LOCKED', 'NX', 'EX', 86400);",
    "  if (!isProcessed) return res.status(200).send('Duplicate event ignored');",
    "  ",
    "  // 3. Fast ACK: Push to Message Queue and return 200 OK within 200ms",
    "  await messageQueue.publish('PROCESS_PAYMENT_ORDER', event.data);",
    "  return res.status(200).json({ received: true });",
    "});",
  ],

  steps: [
    {
      narration:
        "Step 1: Event Emission. Stripe completes a $149 credit card charge and issues an HTTP POST webhook payload to your registered endpoint.",
      activeLine: 2,
      state: {
        stage: "Event Trigger (Reverse API)",
        emitter: "Stripe Billing Engine",
        eventType: "payment_intent.succeeded",
        targetUrl: "https://api.myapp.com/webhooks/stripe",
      },
      visualState: {
        currentStepIndex: 0,
        activeStage: "emission",
        retryAttempt: 0,
      } satisfies WebhooksVisualState,
    },
    {
      narration:
        "Step 2: Cryptographic HMAC Signature Verification. Your server hashes the raw body with the shared secret to guarantee the payload was not spoofed by an attacker.",
      activeLine: 5,
      state: {
        stage: "HMAC Security Verification",
        signatureHeader: "Stripe-Signature: t=168... v1=9a3f...",
        validation: "HMAC-SHA256 Match ✓ (Authentic)",
        securityStatus: "Spoofing Blocked",
      },
      visualState: {
        currentStepIndex: 1,
        activeStage: "hmac",
        retryAttempt: 0,
      } satisfies WebhooksVisualState,
    },
    {
      narration:
        "Step 3: Idempotency Check & Instant 200 OK ACK. Server checks Redis lock for event.id, queues order fulfillment job, and returns 200 OK in <50ms.",
      activeLine: 11,
      state: {
        stage: "Idempotency & Fast ACK",
        idempotencyKey: "evt_1N4kP02eZvKYlo2C",
        redisLock: "SETNX webhook:evt_1N4k... ✓",
        ackResponse: "HTTP 200 OK (<50ms)",
        backgroundWorker: "Dispatched to Async Queue",
      },
      visualState: {
        currentStepIndex: 2,
        activeStage: "async-ack",
        retryAttempt: 0,
      } satisfies WebhooksVisualState,
    },
  ],
};
