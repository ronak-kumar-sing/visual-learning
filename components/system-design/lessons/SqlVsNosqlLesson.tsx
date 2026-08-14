"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import SqlVsNosqlVisual from "@/components/system-design/visuals/SqlVsNosqlVisual";
import type { SqlVsNosqlVisualState } from "@/lib/system-design/lessons/scaling/sql-vs-nosql";

interface SqlVsNosqlLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `SQL (Relational Databases) organize data into structured tables with rigid schemas, strict foreign key constraints, and strong ACID guarantees, traditionally scaling vertically. NoSQL (Non-Relational Databases) store data in flexible models (JSON Documents, Key-Value, Columnar, Graph), embrace BASE eventual consistency, and scale out horizontally via distributed sharding.`;

const INTERVIEW_PREP = [
  {
    question: "When should you choose SQL over NoSQL in an enterprise architecture interview?",
    answer:
      "Choose SQL (PostgreSQL/MySQL) when you need strict transactional integrity (financial ledgers), complex relational joins, rigid schema validation, and predictable queries. Choose NoSQL (MongoDB/Cassandra) for unstructured/rapidly evolving schemas, ultra-high write throughput, and massive horizontal dataset scaling.",
  },
  {
    question: "Explain the trade-off in the CAP theorem during a network partition.",
    answer:
      "Network partitions are inevitable in distributed systems. When a partition occurs, an architect must choose between Consistency (CP: reject requests or wait for nodes to sync, ensuring no stale reads) and Availability (AP: return immediately from any reachable node, risking stale data).",
  },
  {
    question: "What is the difference between ACID and BASE consistency models?",
    answer:
      "ACID (SQL) is pessimistic and enforces immediate strong consistency across all nodes before a commit returns. BASE (NoSQL) is optimistic (Basically Available, Soft state, Eventual consistency), sacrificing immediate consistency for high availability and low latency.",
  },
];

export default function SqlVsNosqlLesson({ topic, group, lesson }: SqlVsNosqlLessonProps) {
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
            <p className="font-bold text-blue-400 mb-1 font-mono text-[11px]">
              ⭐ Key Architectural Trade-offs:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>SQL (PostgreSQL/MySQL):</strong> Strict Schema, ACID, Relational JOINs, Vertical Scale.</li>
              <li><strong>NoSQL (MongoDB/Cassandra):</strong> Dynamic Schema, BASE, Horizontal Sharding.</li>
              <li><strong>CAP Theorem:</strong> Pick 2 of Consistency, Availability, Partition Tolerance.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-blue-400 text-[11px]">
              ⚖️ Database Selection Rule:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              Finance &amp; Relational Data ➔ <span className="text-blue-300 font-bold">SQL</span><br/>
              Big Data Streams &amp; Documents ➔ <span className="text-emerald-300 font-bold">NoSQL</span>
            </p>
          </div>

          <div className="bg-blue-400/10 border border-blue-400/30 p-2 rounded-xl text-[10px] text-blue-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Modern architectures often use Polyglot Persistence (SQL for core user billing + NoSQL/Redis for high-speed feeds and sessions)!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <SqlVsNosqlVisual
          visualState={step.visualState as SqlVsNosqlVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
