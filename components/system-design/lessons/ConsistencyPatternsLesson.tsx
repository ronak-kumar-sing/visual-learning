"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import ConsistencyPatternsVisual from "@/components/system-design/visuals/ConsistencyPatternsVisual";
import type { ConsistencyPatternsVisualState } from "@/lib/system-design/lessons/perf-consistency/consistency-patterns";

interface ConsistencyPatternsLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `Consistency Models in distributed systems define the contractual guarantees regarding the order and freshness of read operations across multiple physical nodes. The spectrum spans from Strong Consistency (Linearizable, synchronous quorum locks) to Causal Consistency, Read-After-Write (Read-Your-Own-Writes), and Eventual Consistency (asynchronous convergence).`;

const INTERVIEW_PREP = [
  {
    question: "Explain the Quorum Consistency formula R + W > N.",
    answer:
      "In a distributed system with $N$ total replicas, if the number of nodes required for a write confirmation ($W$) plus the number of nodes queried for a read ($R$) is strictly greater than $N$ ($R + W > N$), the Pigeonhole Principle guarantees that at least ONE node in the read quorum has the most recent write version, ensuring Strong Consistency.",
  },
  {
    question: "What is Monotonic Read Consistency?",
    answer:
      "Monotonic Read guarantees that if a client reads value $v_1$ at time $t_1$, any subsequent read by that same client will never observe an older value $v_0$ (time cannot move backwards for a single user, even across different replicas).",
  },
  {
    question: "How does Causal Consistency handle concurrent updates?",
    answer:
      "If Event B is caused by Event A (e.g. A posts a question, B replies), every node will observe A before B. However, if two operations are concurrent and unrelated (C and D submitted at the same time by different users), different nodes may observe them in different orders without violating causality.",
  },
];

export default function ConsistencyPatternsLesson({
  topic,
  group,
  lesson,
}: ConsistencyPatternsLessonProps) {
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
              ⭐ The Consistency Spectrum:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>Strong:</strong> All nodes immediately agree (Synchronous locks).</li>
              <li><strong>Causal:</strong> Preserves cause-and-effect sequence (Replies).</li>
              <li><strong>Read-Your-Writes:</strong> Author always sees their own update.</li>
              <li><strong>Eventual:</strong> Nodes converge asynchronously over time.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-amber-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-amber-400 text-[11px]">
              📐 Quorum Formula:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              <span className="text-emerald-400 font-bold">R + W &gt; N</span> ➔ Strong Consistency<br/>
              <span className="text-amber-400 font-bold">R + W ≤ N</span> ➔ Eventual Consistency
            </p>
          </div>

          <div className="bg-amber-400/10 border border-amber-400/30 p-2 rounded-xl text-[10px] text-amber-300 font-mono">
            💡 <strong>Pro-Tip:</strong> In DynamoDB and Cassandra, setting `QUORUM` on both reads and writes guarantees strong linearizability without expensive distributed locks!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <ConsistencyPatternsVisual
          visualState={step.visualState as ConsistencyPatternsVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
