"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import DenormalizationVisual from "@/components/system-design/visuals/DenormalizationVisual";
import type { DenormalizationVisualState } from "@/lib/system-design/lessons/perf-consistency/denormalization";

interface DenormalizationLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `Database Denormalization is the intentional architectural strategy of duplicating redundant data across multiple tables or documents to eliminate expensive relational JOIN operations. By trading data redundancy and increased write complexity for ultra-fast point reads (reducing query latency from 45ms+ to ~1ms), denormalization is widely used in high-scale distributed NoSQL databases and read-heavy analytics systems.`;

const INTERVIEW_PREP = [
  {
    question: "When should you denormalize data in a distributed system design interview?",
    answer:
      "Denormalize when the read-to-write ratio is heavily skewed towards reads (e.g. 100:1 or 1,000:1), when multi-table JOINs create unacceptable latency or are impossible across sharded database instances, or when building dedicated search/analytics read models (CQRS pattern).",
  },
  {
    question: "What is the Write Amplification trade-off in denormalized databases?",
    answer:
      "When a single piece of shared information changes (e.g. a user updates their username or profile photo), that update must be written to every single denormalized document/table where it was duplicated, turning a 1-row update into hundreds or thousands of writes.",
  },
  {
    question: "How do modern architectures keep denormalized views in sync?",
    answer:
      "Through Change Data Capture (CDC) with tools like Debezium reading the database Write-Ahead Log (WAL), publishing mutation events to Apache Kafka, and having background worker consumers update denormalized read stores asynchronously.",
  },
];

export default function DenormalizationLesson({
  topic,
  group,
  lesson,
}: DenormalizationLessonProps) {
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
              ⭐ 3NF vs Denormalization Trade-off:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>Normalized (3NF):</strong> Clean schema, zero redundancy, slow multi-table JOINs (~45ms).</li>
              <li><strong>Denormalized:</strong> Duplicate data, zero JOINs, blazing point reads (~1.2ms).</li>
              <li><strong>Write Amplification:</strong> Updating 1 field cascades to 100+ records.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-pink-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-pink-400 text-[11px]">
              ⚖️ Rule of Thumb:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              Use Normalized SQL for core transactional writes ➔ Use Denormalized views for high-speed read feeds!
            </p>
          </div>

          <div className="bg-pink-400/10 border border-pink-400/30 p-2 rounded-xl text-[10px] text-pink-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Implement the CQRS (Command Query Responsibility Segregation) pattern with Kafka CDC for reliable async sync!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <DenormalizationVisual
          visualState={step.visualState as DenormalizationVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
