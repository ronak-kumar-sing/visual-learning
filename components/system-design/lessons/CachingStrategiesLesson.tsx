"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import CachingStrategiesVisual from "@/components/system-design/visuals/CachingStrategiesVisual";
import type { CachingStrategiesVisualState } from "@/lib/system-design/lessons/perf-consistency/caching-strategies";

interface CachingStrategiesLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `Caching is the fundamental system design practice of storing copies of frequently accessed data in high-speed, volatile in-memory storage (such as Redis or Memcached). By intercepting reads before they hit the disk-based database, caching reduces read latency from 15ms+ down to sub-millisecond speeds (<1ms) and relieves database I/O pressure.`;

const INTERVIEW_PREP = [
  {
    question: "What is the Cache Stampede (Thundering Herd) problem and how do you prevent it?",
    answer:
      "A Cache Stampede occurs when a high-traffic cache key expires or is invalidated, causing thousands of concurrent requests to experience a cache miss simultaneously and hammer the database with identical queries. Solutions: 1) Mutual exclusion locks (Mutex/Singleflight) so only one request queries DB and re-populates cache, 2) Probabilistic early expiration (XFetch algorithm), 3) Refresh-ahead background worker.",
  },
  {
    question: "When should you choose Write-Through over Cache-Aside?",
    answer:
      "Choose Write-Through for systems requiring strict freshness and where reads are guaranteed immediately after writes (e.g. financial ledgers or concurrency locks). Choose Cache-Aside for general read-heavy workloads with unpredictable access patterns to avoid caching unused data.",
  },
  {
    question: "Why should you always set a Time-To-Live (TTL) on cached entries?",
    answer:
      "TTL acts as a safety net against ghost/stale keys if a manual cache invalidation event drops or fails during network blips, ensuring the cache will eventually become consistent with the source database.",
  },
];

export default function CachingStrategiesLesson({
  topic,
  group,
  lesson,
}: CachingStrategiesLessonProps) {
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
            <p className="font-bold text-amber-400 mb-1 font-mono text-[11px]">
              ⭐ 4 Core Caching Patterns:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>Cache-Aside (Lazy):</strong> App reads cache; on miss loads DB.</li>
              <li><strong>Write-Through:</strong> App writes cache + DB synchronously.</li>
              <li><strong>Write-Behind (Write-Back):</strong> App writes cache; async batches to DB.</li>
              <li><strong>Write-Around:</strong> App writes DB directly; bypasses cache.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-amber-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-amber-400 text-[11px]">
              ⚡ Speed Multiplier:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              PostgreSQL Disk Read ➔ <strong>10ms - 50ms</strong><br/>
              Redis RAM Read ➔ <strong>0.3ms - 0.8ms (50x Faster!)</strong>
            </p>
          </div>

          <div className="bg-amber-400/10 border border-amber-400/30 p-2 rounded-xl text-[10px] text-amber-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Never cache without a reasonable TTL to prevent permanent stale data when background updates occur!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <CachingStrategiesVisual
          visualState={step.visualState as CachingStrategiesVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
