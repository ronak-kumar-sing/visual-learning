"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import RateLimitingVisual from "@/components/system-design/visuals/RateLimitingVisual";
import type { RateLimitingVisualState } from "@/lib/system-design/lessons/reliability/rate-limiting";

interface RateLimitingLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `Rate Limiting is a defensive traffic-shaping mechanism that caps the number of requests a client (by IP address, User ID, or API Key) can execute within a specified time window. Implemented using algorithms like Token Bucket, Leaky Bucket, and Sliding Window Counter in centralized stores like Redis, rate limiters protect backends from brute-force attacks, DDoS exhaustion, and noisy-neighbor API abuse by returning HTTP 429 Too Many Requests.`;

const INTERVIEW_PREP = [
  {
    question: "Why is the Token Bucket algorithm preferred over Fixed Window Counter in real-world production systems?",
    answer:
      "Fixed Window Counter has a severe 'boundary spike' vulnerability: if a user limit is 100 req/min and they send 100 requests at 12:00:59 and another 100 requests at 12:01:01, the system experiences 200 requests within a 2-second window (2x overload). Token Bucket avoids this by continuously refilling tokens at a smooth rate $r$ while still allowing controlled bursts up to bucket capacity $C$.",
  },
  {
    question: "How do you build a distributed rate limiter across 50 API Gateway instances without race conditions?",
    answer:
      "Use Redis with atomic Lua scripts. A single Redis Lua script checks available tokens, calculates time elapsed, decrements the token count, and updates timestamps atomically in a single network roundtrip, preventing concurrency race conditions without distributed locks.",
  },
  {
    question: "What HTTP response headers should a well-designed Rate Limiter return?",
    answer:
      "Return: 1) `X-RateLimit-Limit` (Total quota allowed in the window), 2) `X-RateLimit-Remaining` (Number of remaining requests allowed), 3) `X-RateLimit-Reset` (Epoch timestamp when quota resets), and 4) `Retry-After` (Seconds to wait before retrying on HTTP 429).",
  },
];

export default function RateLimitingLesson({
  topic,
  group,
  lesson,
}: RateLimitingLessonProps) {
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
              ⭐ Rate Limiting Algorithms:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>Token Bucket:</strong> Refill rate + capacity; handles bursts.</li>
              <li><strong>Leaky Bucket:</strong> Strict FIFO outflow; smooths traffic.</li>
              <li><strong>Sliding Window:</strong> Accurate boundary calculation.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-yellow-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-yellow-400 text-[11px]">
              🛡️ Standard Error:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              Status Code: <strong className="text-red-400">HTTP 429 Too Many Requests</strong><br/>
              Header: <strong>Retry-After: 30s</strong>
            </p>
          </div>

          <div className="bg-yellow-400/10 border border-yellow-400/30 p-2 rounded-xl text-[10px] text-yellow-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Execute Token Bucket logic inside Redis Lua scripts to eliminate multi-threaded race conditions atomically!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <RateLimitingVisual
          visualState={step.visualState as RateLimitingVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
