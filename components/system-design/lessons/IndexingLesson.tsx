"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import IndexingVisual from "@/components/system-design/visuals/IndexingVisual";
import type { IndexingVisualState } from "@/lib/system-design/lessons/db-internals/indexing";

interface IndexingLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `A Database Index is a specialized, auxiliary data structure (predominantly a B+ Tree) that stores sorted key-to-row pointer mappings. It allows the database engine to find specific rows in O(log n) logarithmic time and execute range scans without reading the entire table sequentially from disk, at the cost of additional write overhead on INSERT/UPDATE/DELETE.`;

const INTERVIEW_PREP = [
  {
    question: "Why do relational databases use B+ Trees instead of Binary Search Trees (BST) for indexing?",
    answer:
      "B+ Trees have a high branching factor (fan-out of 100+ keys per node), keeping the tree height shallow (3-4 levels). Each node fits exactly into one 8KB or 16KB disk page, minimizing expensive disk I/O seeks. Leaf nodes are linked sequentially for blazing-fast range scans.",
  },
  {
    question: "What is a Composite Index and why does Column Order matter (Leftmost Prefix Rule)?",
    answer:
      "A composite index indexes multiple columns (e.g. `(country, city, age)`). The query planner can only use the index if the query filters by the leftmost columns first. A query filtering only on `city` cannot use a `(country, city)` index.",
  },
  {
    question: "What is the Write Penalty of over-indexing?",
    answer:
      "Every new INSERT requires the storage engine to append to the heap table AND update all associated B-Trees. If an internal node is full, a page split occurs, triggering multiple random disk writes and locking pages.",
  },
];

export default function IndexingLesson({ topic, group, lesson }: IndexingLessonProps) {
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
              ⭐ Indexing Golden Rules:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>Index Cardinality:</strong> High-cardinality columns (emails, IDs) benefit most.</li>
              <li><strong>Range Scans:</strong> B-Trees support <code className="text-orange-300">BETWEEN</code>, <code className="text-orange-300">&gt;</code>, and <code className="text-orange-300">&lt;</code>.</li>
              <li><strong>Covering Index:</strong> If an index contains all selected columns, it avoids touching table heap pages entirely!</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-orange-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-orange-400 text-[11px]">
              ⚖️ The Trade-off:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              Fast <span className="text-emerald-400 font-bold">O(log n) Reads</span> ⇄ Slower <span className="text-red-400 font-bold">Writes</span> (Page Splits)
            </p>
          </div>

          <div className="bg-orange-400/10 border border-orange-400/30 p-2 rounded-xl text-[10px] text-orange-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Never index low-cardinality boolean columns (e.g. `is_active`) alone — the query optimizer will ignore it and full-scan anyway!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <IndexingVisual
          visualState={step.visualState as IndexingVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
