"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import CacheEvictionVisual from "@/components/system-design/visuals/CacheEvictionVisual";
import type { CacheEvictionVisualState } from "@/lib/system-design/lessons/perf-consistency/cache-eviction";

interface CacheEvictionLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `Cache Eviction Policies are algorithmic rules that manage bounded in-memory cache capacity. When cache RAM becomes saturated, the eviction policy deterministically selects which stale or low-priority entries to discard to allocate space for incoming keys, most commonly employing LRU (Least Recently Used), LFU (Least Frequently Used), or FIFO.`;

const INTERVIEW_PREP = [
  {
    question: "How do you implement an LRU Cache with O(1) time complexity for both GET and PUT?",
    answer:
      "Use a Hash Map combined with a Doubly-Linked List. The Hash Map provides $O(1)$ key-to-node lookups, while the Doubly-Linked List allows $O(1)$ node removal and re-insertion at the Head (MRU) or removal from the Tail (LRU).",
  },
  {
    question: "What is the primary flaw of pure LFU (Least Frequently Used) caching?",
    answer:
      "Historical bias. A key that was accessed 10,000 times during a morning flash sale retains an artificially high frequency count and lingers in memory indefinitely, even if it is never queried again in the afternoon. Solution: LFU with Aging (decaying frequency counters over time).",
  },
  {
    question: "How does Redis implement LRU under memory pressure (maxmemory-policy)?",
    answer:
      "Exact LRU requires extra memory pointers for linked lists. To conserve memory, Redis uses an Approximated LRU algorithm: it samples a configurable number of random keys (e.g. 5 keys) and evicts the one with the oldest idle time.",
  },
];

export default function CacheEvictionLesson({
  topic,
  group,
  lesson,
}: CacheEvictionLessonProps) {
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
              ⭐ Eviction Policy Comparison:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>LRU (Least Recently Used):</strong> Best for temporal locality.</li>
              <li><strong>LFU (Least Frequently Used):</strong> Best for consistently hot keys.</li>
              <li><strong>FIFO:</strong> Simplest queue buffer, ignores access patterns.</li>
              <li><strong>TTL (Time-To-Live):</strong> Time-based auto expiration.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-amber-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-amber-400 text-[11px]">
              ⚡ O(1) Architecture:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              Hash Map (O(1) Lookup) + Doubly Linked List (O(1) Reordering)
            </p>
          </div>

          <div className="bg-amber-400/10 border border-amber-400/30 p-2 rounded-xl text-[10px] text-amber-300 font-mono">
            💡 <strong>Pro-Tip:</strong> In Redis production clusters, configure `maxmemory-policy: allkeys-lru` to ensure smooth eviction under traffic spikes!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <CacheEvictionVisual
          visualState={step.visualState as CacheEvictionVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
