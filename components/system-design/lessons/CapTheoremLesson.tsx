"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import CapTheoremVisual from "@/components/system-design/visuals/CapTheoremVisual";
import type { CapTheoremVisualState } from "@/lib/system-design/lessons/perf-consistency/cap-theorem";

interface CapTheoremLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `The CAP Theorem (Brewer's Theorem) states that any distributed data store can simultaneously provide at most two out of three guarantees: Consistency (all nodes see the exact same data simultaneously), Availability (every non-failing node returns a response), and Partition Tolerance (the system functions despite arbitrary network message loss). Because network partitions are inevitable in real-world distributed infrastructure, architects must choose between Consistency (CP) or Availability (AP).`;

const INTERVIEW_PREP = [
  {
    question: "Why is 'CA' (Consistency + Availability without Partition Tolerance) practically impossible in distributed systems?",
    answer:
      "Network switches fail, fiber cables get severed, and cloud zones lose cross-connectivity. Partition Tolerance (P) is a physical reality of distributed networks. Therefore, when a partition occurs, a system cannot remain both available on all disconnected nodes and 100% consistent.",
  },
  {
    question: "How does the PACELC Theorem expand upon CAP?",
    answer:
      "PACELC states: If there is a **P**artition (**P**), how does the system trade off **A**vailability (**A**) vs **C**onsistency (**C**)? **E**lse (**E**), during normal operation with no partitions, how does the system trade off **L**atency (**L**) vs **C**onsistency (**C**)? For example, DynamoDB is PA/EL (chooses Availability during partition, and Latency normally).",
  },
  {
    question: "Give concrete examples of CP vs AP databases in industry.",
    answer:
      "CP Databases: MongoDB (primary stepdown), HBase, ZooKeeper, etcd (Raft consensus). AP Databases: Apache Cassandra (peer-to-peer ring), Amazon DynamoDB (eventual consistency), CouchDB.",
  },
];

export default function CapTheoremLesson({
  topic,
  group,
  lesson,
}: CapTheoremLessonProps) {
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
              ⭐ The 3 CAP Pillars:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>Consistency (C):</strong> Every read receives the latest write or error.</li>
              <li><strong>Availability (A):</strong> Every request receives a valid response.</li>
              <li><strong>Partition Tolerance (P):</strong> Survives network packet drops.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-amber-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-amber-400 text-[11px]">
              ⚖️ The Real Choice:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              When network partitions occur: <br/>
              <span className="text-amber-300 font-bold">CP:</span> Return Error ➔ Preserve Correctness<br/>
              <span className="text-emerald-300 font-bold">AP:</span> Return Stale ➔ Preserve 100% Uptime
            </p>
          </div>

          <div className="bg-amber-400/10 border border-amber-400/30 p-2 rounded-xl text-[10px] text-amber-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Financial transactions must always be CP, while social media feeds and notifications are almost always AP!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <CapTheoremVisual
          visualState={step.visualState as CapTheoremVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
