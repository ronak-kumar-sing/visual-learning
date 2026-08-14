"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import IdempotencyVisual from "@/components/system-design/visuals/IdempotencyVisual";
import type { IdempotencyVisualState } from "@/lib/system-design/lessons/reliability/idempotency";

interface IdempotencyLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `Idempotency is the property of an API operation where making multiple identical requests has the exact same side effect on the system as making a single request ($f(f(x)) = f(x)$). In mission-critical workflows (such as payments and order checkout), idempotency is achieved by passing an \`Idempotency-Key\` UUID header and caching the result in Redis with distributed \`SETNX\` locks, guaranteeing that network retries and accidental user double-clicks never cause duplicate bank charges.`;

const INTERVIEW_PREP = [
  {
    question: "How do you implement an Idempotent POST endpoint using Redis?",
    answer:
      "1) Client generates a unique UUID (e.g. `Idempotency-Key: uuid-v4`) in the request header. 2) Server attempts an atomic `SET idempotency:<uuid> 'PROCESSING' NX EX 120` in Redis. 3) If the key exists and has a cached completed response, return the cached response immediately. 4) If the key is currently 'PROCESSING' (a concurrent in-flight request), return `HTTP 409 Conflict`. 5) If lock acquired, execute business logic, store the final JSON response in Redis with a 24-hour TTL, and return HTTP 200.",
  },
  {
    question: "Which HTTP verbs are naturally idempotent according to the RFC specification?",
    answer:
      "`GET`, `HEAD`, `OPTIONS` (Safe & Idempotent — no state changes). `PUT` (Idempotent — replacing a resource with the exact same payload produces identical state). `DELETE` (Idempotent — deleting resource #42 five times results in the resource being deleted). `POST` and `PATCH` are NOT idempotent by default and require custom idempotency keys.",
  },
  {
    question: "What happens if an idempotent request fails mid-way before the database write?",
    answer:
      "If the transaction crashes or fails validation, delete the Redis `PROCESSING` lock key so that subsequent retry requests can execute a fresh attempt rather than being permanently locked or receiving a corrupted cached error.",
  },
];

export default function IdempotencyLesson({
  topic,
  group,
  lesson,
}: IdempotencyLessonProps) {
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
            <p className="font-bold text-yellow-400 mb-1 font-mono text-[11px]">
              ⭐ Mathematical Guarantee:
            </p>
            <p className="text-[10px] text-zinc-400 font-mono mb-2">
              f(f(x)) = f(x) ➔ 10 Retries = Exactly 1 Side Effect
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>Idempotent Verbs:</strong> GET, PUT, DELETE.</li>
              <li><strong>Non-Idempotent:</strong> POST (Needs Idempotency Key).</li>
              <li><strong>Redis SETNX:</strong> Atomic lock + cached receipt replay.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-yellow-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-yellow-400 text-[11px]">
              💳 Financial Safety:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              Accidental Double-Click: <strong>Zero Double Charge!</strong><br/>
              Network Retry: <strong>Replays Cached Receipt in 1ms</strong>
            </p>
          </div>

          <div className="bg-yellow-400/10 border border-yellow-400/30 p-2 rounded-xl text-[10px] text-yellow-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Store idempotency keys with a 24-hour TTL in Redis so late webhook retries are always safe!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <IdempotencyVisual
          visualState={step.visualState as IdempotencyVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
