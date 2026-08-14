"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import VerticalPartitioningVisual from "@/components/system-design/visuals/VerticalPartitioningVisual";
import type { VerticalPartitioningVisualState } from "@/lib/system-design/lessons/db-internals/vertical-partitioning";

interface VerticalPartitioningLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `Vertical Partitioning is the database optimization technique of splitting a single table by columns into two or more distinct tables with 1-to-1 relationships. It isolates frequently accessed 'hot' columns (e.g. IDs, names, statuses) into a compact table while moving large, rarely accessed 'cold' columns (e.g. JSON metadata, text bios, BLOBs) into secondary tables, dramatically increasing RAM buffer cache page density and eliminating wasted disk I/O.`;

const INTERVIEW_PREP = [
  {
    question: "How does Vertical Partitioning improve database Buffer Pool cache hit rates?",
    answer:
      "Database engines read and cache data in fixed 8KB or 16KB disk pages. In a bloated 10KB-per-row table, each page holds only 1 row (90% wasted space if large blobs aren't needed). In a vertically partitioned 100-byte-per-row table, each 8KB page holds 80 rows, fitting 80x more active users into the same RAM buffer pool.",
  },
  {
    question: "When should you vertically partition a database table?",
    answer:
      "When a table contains a mix of narrow, high-frequency columns (used in 95% of queries) and wide, low-frequency columns (such as large JSON text or binary blobs), or when different columns have vastly different security/access control requirements.",
  },
  {
    question: "What is the difference between Vertical Partitioning and Sharding (Horizontal Partitioning)?",
    answer:
      "Vertical Partitioning splits by **columns** (often within the same database instance) to optimize page I/O density. Sharding splits by **rows** across different physical database servers to scale write throughput and total data capacity.",
  },
];

export default function VerticalPartitioningLesson({
  topic,
  group,
  lesson,
}: VerticalPartitioningLessonProps) {
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
              ⭐ Vertical Partitioning Benefits:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>I/O Optimization:</strong> 80+ rows cached per 8KB RAM page.</li>
              <li><strong>Zero Bloat:</strong> Lightweight queries avoid loading 10KB BLOBs.</li>
              <li><strong>Security Isolation:</strong> Sensitive columns (e.g. SSNs) separated into restricted tables.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-orange-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-orange-400 text-[11px]">
              📊 Column Categorization:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              <strong>Hot (users_core):</strong> id, name, email, status (174B)<br/>
              <strong>Cold (users_profile):</strong> bio, avatar_blob, raw_json (10KB)
            </p>
          </div>

          <div className="bg-orange-400/10 border border-orange-400/30 p-2 rounded-xl text-[10px] text-orange-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Store large media blobs (avatars, PDFs) in object storage (S3) instead of database BLOB columns for maximum scalability!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <VerticalPartitioningVisual
          visualState={step.visualState as VerticalPartitioningVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
