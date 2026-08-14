"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import CachingVisual from "@/components/system-design/visuals/CachingVisual";
import type { CachingVisualState } from "@/lib/system-design/lessons/perf-consistency/caching";

interface CachingLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `Caching is the core architectural technique of storing copies of high-frequency data in volatile, high-speed in-memory storage (such as Redis or Memcached). By intercepting reads before hitting disk databases, caching reduces latencies from 15ms+ down to sub-millisecond speeds (<1ms), prevents database saturation, and utilizes eviction policies like LRU to maintain a bounded memory footprint.`;

const INTERVIEW_PREP = [
  {
    question: "What is the Cache Stampede (Thundering Herd) problem and how is it prevented?",
    answer:
      "When a high-traffic cache key expires, thousands of concurrent requests miss the cache simultaneously and hammer the database with identical queries. Solutions: 1) Mutex / Singleflight lock so only one thread queries DB and updates cache, 2) Probabilistic early expiration (XFetch algorithm), 3) Background cron refresh.",
  },
  {
    question: "How does Cache-Aside differ from Write-Through in system design?",
    answer:
      "In Cache-Aside, the application code manually checks the cache, queries the DB on a miss, and updates the cache (Lazy Loading). In Write-Through, the application writes to the cache, and the cache synchronously writes to the DB before returning success, ensuring strong freshness.",
  },
  {
    question: "How does LRU (Least Recently Used) achieve O(1) eviction?",
    answer:
      "By pairing a Hash Map (for $O(1)$ key-to-node lookups) with a Doubly-Linked List (for $O(1)$ reordering to the Head on access and $O(1)$ deletion from the Tail on eviction).",
  },
];

export default function CachingLesson({ topic, group, lesson }: CachingLessonProps) {
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
            <p className="font-bold text-pink-400 mb-1 font-mono text-[11px]">
              ⭐ Caching Essentials:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>Sub-Millisecond Read:</strong> 0.5ms in-memory RAM lookup.</li>
              <li><strong>Cache-Aside:</strong> Lazy loading keeps memory footprint lean.</li>
              <li><strong>LRU Eviction:</strong> Fixed memory buffer safely evicts idle keys.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-pink-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-pink-400 text-[11px]">
              ⚡ Speed Multiplier:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              Disk DB: <strong>15ms - 50ms</strong><br/>
              RAM Cache: <strong>0.3ms - 0.8ms (50x Faster!)</strong>
            </p>
          </div>

          <div className="bg-pink-400/10 border border-pink-400/30 p-2 rounded-xl text-[10px] text-pink-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Always set a TTL on every cache key to prevent permanent stale data in case invalidation drops!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <CachingVisual
          visualState={step.visualState as CachingVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
