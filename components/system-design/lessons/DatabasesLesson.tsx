"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import DatabasesVisual from "@/components/system-design/visuals/DatabasesVisual";
import type { DatabasesVisualState } from "@/lib/system-design/lessons/web-apis/databases";

interface DatabasesLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `A Database is an organized, durable, and indexed collection of structured data managed by a Database Management System (DBMS). Unlike volatile in-memory variables, databases persist data to non-volatile storage, enforce ACID transaction guarantees (Atomicity, Consistency, Isolation, Durability), and provide efficient query optimization across large data volumes.`;

const INTERVIEW_PREP = [
  {
    question: "How does a Write-Ahead Log (WAL) ensure Durability in relational databases?",
    answer:
      "Before any database modification is written to disk data files, it is appended sequentially to the WAL on persistent disk. If the database crashes mid-operation, the recovery engine replays the WAL on startup to restore all committed transactions.",
  },
  {
    question: "What are the 4 Isolation Levels in SQL and what concurrency phenomena do they prevent?",
    answer:
      "1) Read Uncommitted (prone to dirty reads), 2) Read Committed (prevents dirty reads), 3) Repeatable Read (prevents non-repeatable reads), 4) Serializable (strictest level, prevents phantom reads by locking full ranges).",
  },
  {
    question: "When should you pick SQL (Postgres/MySQL) over NoSQL (Mongo/Cassandra)?",
    answer:
      "Pick SQL when you need strict ACID compliance, complex JOIN queries, structured data integrity, and financial accuracy. Pick NoSQL when you need massive horizontal write scaling, flexible schema evolution, high-throughput caching (Redis), or document storage.",
  },
];

export default function DatabasesLesson({ topic, group, lesson }: DatabasesLessonProps) {
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
            <p className="font-bold text-emerald-400 mb-1 font-mono text-[11px]">
              ⭐ ACID Transaction Guarantees:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>Atomicity:</strong> All-or-nothing execution.</li>
              <li><strong>Consistency:</strong> Moves from valid state to valid state.</li>
              <li><strong>Isolation:</strong> In-flight transactions are invisible to others.</li>
              <li><strong>Durability:</strong> Committed data survives power failure via WAL.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-emerald-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-emerald-400 text-[11px]">
              📊 SQL vs NoSQL Trade-off:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              <strong>SQL:</strong> Schema, Joins, ACID, Vertical scale.<br/>
              <strong>NoSQL:</strong> Document/Key-Value, BASE, Horizontal scale.
            </p>
          </div>

          <div className="bg-emerald-400/10 border border-emerald-400/30 p-2 rounded-xl text-[10px] text-emerald-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Always use database transactions with explicit error rollback for multi-step financial operations!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <DatabasesVisual
          visualState={step.visualState as DatabasesVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
