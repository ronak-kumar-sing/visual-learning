import type { Lesson } from "@/lib/system-design/types";

export type QueueEngine = "kafka" | "rabbitmq";

export interface QueueSystemComparison {
  dimension: string;
  rabbitmq: string;
  kafka: string;
}

export const QUEUE_COMPARISONS: QueueSystemComparison[] = [
  {
    dimension: "Communication Model",
    rabbitmq: "Push-based (Broker actively pushes tasks to workers)",
    kafka: "Pull-based (Consumers pull batches from partition offsets)",
  },
  {
    dimension: "Message Retention",
    rabbitmq: "Ephemeral (Deleted immediately once consumer sends ACK)",
    kafka: "Durable Log (Retained on disk for days; can replay history)",
  },
  {
    dimension: "Throughput Capacity",
    rabbitmq: "Moderate (~20,000 - 50,000 msgs/sec)",
    kafka: "Ultra-High (>1,000,000 msgs/sec via sequential disk writes)",
  },
  {
    dimension: "Primary Use Case",
    rabbitmq: "Complex background task routing, email jobs, priority queues",
    kafka: "High-volume event streaming, real-time analytics, event sourcing",
  },
];

export interface MessageQueuesVisualState {
  currentStepIndex: number;
  selectedEngine: QueueEngine;
  queueDepth: number;
  isConsumerLagging: boolean;
}

export const messageQueuesLesson: Lesson = {
  pseudocode: [
    "// Asynchronous Message Queue Producer & Consumer Loop",
    "// 1. Producer pushes task to queue buffer (Non-blocking: 1ms)",
    "function submitOrderJob(orderData):",
    "  const message = { id: orderData.id, payload: orderData, timestamp: Date.now() }",
    "  await queue.publish('orders_topic', message)",
    "  return { status: 'QUEUED', trackingId: message.id }",
    "  ",
    "// 2. Consumer Worker pulls jobs at its own sustainable rate",
    "queue.consume('orders_topic', async (message) => {",
    "  try {",
    "    await processPaymentAndGenerateInvoice(message.payload)",
    "    await message.ack() // Acknowledge completion",
    "  } catch (err) {",
    "    await deadLetterQueue.push(message, err) // Failed task to DLQ",
    "  }",
    "})",
  ],

  steps: [
    {
      narration:
        "Step 1: Producer Push (Non-Blocking). The web server enqueues a video transcoding job in 1ms and returns HTTP 202 Accepted to the user without waiting.",
      activeLine: 4,
      state: {
        pattern: "Asynchronous Queue Buffer",
        producerSpeed: "10,000 requests/sec (Traffic Spike)",
        queueBufferStatus: "Durable In-Flight Buffer (Depth: 1,420 msgs)",
        producerResponseTime: "1.2 ms (Instant Return)",
      },
      visualState: {
        currentStepIndex: 0,
        selectedEngine: "kafka",
        queueDepth: 1420,
        isConsumerLagging: true,
      } satisfies MessageQueuesVisualState,
    },
    {
      narration:
        "Step 2: Consumer Pull & Backpressure Smoothing. Background workers process heavy 5-second video tasks at their own steady rate without crashing.",
      activeLine: 9,
      state: {
        pattern: "Backpressure Leveling",
        consumerProcessingRate: "500 tasks/sec across 10 workers",
        systemHealth: "100% Stable (No OOM / CPU Overload)",
        workerStatus: "10 Active Worker Pods",
      },
      visualState: {
        currentStepIndex: 1,
        selectedEngine: "kafka",
        queueDepth: 800,
        isConsumerLagging: false,
      } satisfies MessageQueuesVisualState,
    },
    {
      narration:
        "Step 3: Dead Letter Queue (DLQ). When a corrupt message fails 3 retry attempts, it is diverted to the Dead Letter Queue for manual investigation.",
      activeLine: 13,
      state: {
        pattern: "Dead Letter Queue (DLQ) Isolation",
        failedMessage: "order_id: 9942 (Invalid currency payload)",
        retryAttempts: "3/3 Max Retries Exceeded",
        resolution: "Diverted to DLQ (Queue unblocked ✓)",
      },
      visualState: {
        currentStepIndex: 2,
        selectedEngine: "rabbitmq",
        queueDepth: 12,
        isConsumerLagging: false,
      } satisfies MessageQueuesVisualState,
    },
  ],
};
