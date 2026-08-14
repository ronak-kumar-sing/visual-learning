"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import WebhooksVisual from "@/components/system-design/visuals/WebhooksVisual";
import type { WebhooksVisualState } from "@/lib/system-design/lessons/realtime/webhooks";

interface WebhooksLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `A Webhook (often called a Reverse API or User-Defined HTTP Callback) is an architectural pattern where a third-party platform (such as Stripe, GitHub, Twilio, or Shopify) proactively pushes an HTTP POST payload to your registered endpoint when an asynchronous event occurs. Handling webhooks robustly requires cryptographic HMAC signature verification, distributed idempotency locks in Redis, and immediate HTTP 200 ACKs paired with asynchronous worker processing.`;

const INTERVIEW_PREP = [
  {
    question: "Why is Idempotency mandatory when designing webhook consumer endpoints?",
    answer:
      "Network timeouts are common. If your server processes a webhook (e.g. charging a card or provisioning a license) but takes longer than 5 seconds to respond, Stripe assumes the delivery failed and will retry sending the same webhook multiple times. Without idempotency checks (e.g. checking `event.id` in Redis using `SETNX`), you risk executing side effects multiple times (double-charging or creating duplicate orders).",
  },
  {
    question: "Explain the Fast ACK & Asynchronous Worker pattern for webhook ingestion.",
    answer:
      "Never execute heavy synchronous database queries or third-party API calls inside the webhook request handler. Instead, 1) Verify HMAC signature, 2) Push payload to a durable Message Queue (SQS/Kafka/RabbitMQ), 3) Return HTTP 200 OK within 50ms. An asynchronous worker pool pulls events from the queue and executes the business logic safely.",
  },
  {
    question: "How does HMAC-SHA256 signature verification protect webhook endpoints?",
    answer:
      "Because webhook endpoints are public URLs, attackers could send fake HTTP POST payloads pretending to be Stripe. The emitter hashes the raw request body with a shared secret key and includes the signature in the headers. The receiver recomputes the HMAC hash on the raw body; if the hashes match, the payload is authentic and untampered.",
  },
];

export default function WebhooksLesson({
  topic,
  group,
  lesson,
}: WebhooksLessonProps) {
  return (
    <LessonShell
      topic={topic}
      group={group}
      lesson={lesson}
      definition={DEFINITION}
      interviewPrep={INTERVIEW_PREP}
      callout={
        <div className="space-y-3 text-xs text-zinc-300">
          <div>
            <p className="font-bold text-green-400 mb-1 font-mono text-[11px]">
              ⭐ 3 Webhook Engineering Pillars:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>HMAC Signatures:</strong> Prevents spoofing and tampering.</li>
              <li><strong>Idempotency:</strong> Redis lock on `event.id` prevents duplicates.</li>
              <li><strong>Fast ACK (&lt;200ms):</strong> Push to Queue + return 200 OK immediately.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-green-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-green-400 text-[11px]">
              ⏱️ Timeout Protection:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              Stripe Timeout: <strong>5 to 10 Seconds</strong><br/>
              Your Target ACK: <strong>&lt; 50 Milliseconds!</strong>
            </p>
          </div>

          <div className="bg-green-400/10 border border-green-400/30 p-2 rounded-xl text-[10px] text-green-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Always compute HMAC against the RAW byte string of the request body BEFORE any JSON parser middleware runs!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <WebhooksVisual
          visualState={step.visualState as WebhooksVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
