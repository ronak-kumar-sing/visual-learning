"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import ReplicationVisual from "@/components/system-design/visuals/ReplicationVisual";
import type { ReplicationVisualState } from "@/lib/system-design/lessons/db-internals/replication";

interface ReplicationLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `Database Replication is the continuous synchronization of database state across multiple interconnected database instances. In the Leader-Follower (Primary-Replica) architecture, all write operations are processed by a single Primary Leader and streamed via binary logs to Read Replicas, dramatically multiplying read capacity and enabling automated high-availability failover.`;

const INTERVIEW_PREP = [
  {
    question: "How do you solve the 'Read-Your-Own-Writes' consistency problem with asynchronous replicas?",
    answer:
      "When a user updates their profile or creates a comment, immediate follow-up reads from an asynchronous replica might show stale data due to replication lag. Solution: Route read requests from that specific user to the Primary Leader for 5-10 seconds after a write, while routing all other users' reads to Replicas.",
  },
  {
    question: "What is Split-Brain syndrome during automated database failover?",
    answer:
      "Split-Brain occurs when network partitioning causes followers to believe the Leader is dead and elect a new Leader, while the old Leader is still running and accepting writes. It leads to irreconcilable data conflicts. Solution: Use consensus protocols (Raft/Paxos) requiring a quorum (>50% nodes) before electing a leader.",
  },
  {
    question: "What is Semi-Synchronous Replication in MySQL/PostgreSQL?",
    answer:
      "A hybrid approach where the Leader commits and ACKs the client as soon as at least ONE replica has written the binlog to its relay log on disk, balancing strong durability with high throughput.",
  },
];

export default function ReplicationLesson({
  topic,
  group,
  lesson,
}: ReplicationLessonProps) {
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
              ⭐ Replication Architecture Rules:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>Leader Role:</strong> 100% of INSERT/UPDATE/DELETE queries.</li>
              <li><strong>Follower Role:</strong> 100% of read-only SELECT queries.</li>
              <li><strong>Replication Lag:</strong> Replicas are eventually consistent.</li>
              <li><strong>Automated Failover:</strong> Promotes healthy replica if leader fails.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-orange-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-orange-400 text-[11px]">
              🔒 Sync vs Async Trade-off:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              <strong>Async:</strong> High write throughput, minor lag risk.<br/>
              <strong>Sync:</strong> Zero data loss (RPO=0), higher write latency.
            </p>
          </div>

          <div className="bg-orange-400/10 border border-orange-400/30 p-2 rounded-xl text-[10px] text-orange-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Use Read Replicas across different cloud Availability Zones (AZs) for instant disaster recovery!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <ReplicationVisual
          visualState={step.visualState as ReplicationVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
