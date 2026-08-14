"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import ShardingVisual from "@/components/system-design/visuals/ShardingVisual";
import type { ShardingVisualState } from "@/lib/system-design/lessons/db-internals/sharding";

interface ShardingLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `Database Sharding (Horizontal Partitioning) is the architectural pattern of splitting a massive database table by rows and distributing those subsets across multiple independent physical database instances. Each instance holds a unique partition identified by a Shard Key (e.g. user_id), enabling near-infinite horizontal write scaling and massive dataset storage.`;

const INTERVIEW_PREP = [
  {
    question: "What are the core criteria for picking an effective Shard Key?",
    answer:
      "1) High Cardinality (many unique values to avoid monolithic shards), 2) Uniform Distribution (prevents hot shards where one server receives 90% of traffic), 3) Query Alignment (matches the `WHERE` clause of 90%+ of application queries to avoid scatter-gather broadcasts).",
  },
  {
    question: "How do you rebalance shards when adding new database instances (Consistent Hashing)?",
    answer:
      "Naive modulo hashing (`hash(key) % N`) forces 100% of data to move when N changes. Consistent Hashing maps both keys and servers to a 360° ring, meaning adding a new shard only requires moving $K/N$ keys from its immediate neighbor.",
  },
  {
    question: "How do you handle distributed transactions and cross-shard joins?",
    answer:
      "Cross-shard joins should be avoided by denormalizing data into embedded documents or pre-joining tables. Distributed transactions require Two-Phase Commit (2PC) or Sagas, which introduce substantial latency and operational complexity.",
  },
];

export default function ShardingLesson({
  topic,
  group,
  lesson,
}: ShardingLessonProps) {
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
            <p className="font-bold text-orange-400 mb-1 font-mono text-[11px]">
              ⭐ Sharding Architecture Rules:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>Shard Key:</strong> Choose high-cardinality keys (e.g. <code className="text-orange-300">user_id</code>).</li>
              <li><strong>Scatter-Gather Penalty:</strong> Queries without shard keys broadcast to all nodes.</li>
              <li><strong>Hotspot Prevention:</strong> Use hash-based sharding over monotonically increasing dates.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-orange-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-orange-400 text-[11px]">
              ⚖️ When to Shard:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              Only shard when single-node write IOPS or storage exceed hardware limits (&gt;2TB+ or &gt;20,000 writes/sec)!
            </p>
          </div>

          <div className="bg-orange-400/10 border border-orange-400/30 p-2 rounded-xl text-[10px] text-orange-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Consistent Hashing with virtual nodes prevents hotspots and simplifies dynamic shard cluster resizing!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <ShardingVisual
          visualState={step.visualState as ShardingVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
