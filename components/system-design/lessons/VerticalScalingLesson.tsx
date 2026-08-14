"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import VerticalScalingVisual from "@/components/system-design/visuals/VerticalScalingVisual";
import type { VerticalScalingVisualState } from "@/lib/system-design/lessons/scaling/vertical-scaling";

interface VerticalScalingLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `Vertical Scaling (Scaling Up) is the process of expanding a system's processing capacity by adding more compute resources (CPU cores, RAM memory, NVMe SSD storage) to an existing single server or database node. While simple to implement, it faces a physical hardware ceiling, exponential cost curves, and creates a Single Point of Failure (SPOF).`;

const INTERVIEW_PREP = [
  {
    question: "What are the primary disadvantages of Vertical Scaling in high-traffic architectures?",
    answer:
      "1) Physical Hardware Ceiling (there is a finite limit on CPU/RAM per server), 2) Downtime during maintenance upgrades/reboots, 3) Single Point of Failure (if that machine dies, everything goes down), 4) Exponential cost curve compared to commodity hardware.",
  },
  {
    question: "When is Vertical Scaling the recommended first architectural choice?",
    answer:
      "Vertical scaling is ideal for early-stage MVPs, relational databases with complex ACID queries where sharding adds unnecessary complexity, and workloads that can easily fit within a large single instance (e.g. 64 cores / 256GB RAM).",
  },
  {
    question: "How do you transition from Vertical to Horizontal Scaling?",
    answer:
      "Make application servers completely stateless (extracting sessions to Redis), place a Load Balancer in front to distribute requests, and split databases into Read Replicas or Shards.",
  },
];

export default function VerticalScalingLesson({
  topic,
  group,
  lesson,
}: VerticalScalingLessonProps) {
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
              ⭐ Scale-Up Characteristics:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>Zero Code Changes:</strong> Monolith continues to run seamlessly.</li>
              <li><strong>Simple Maintenance:</strong> Single machine to monitor and backup.</li>
              <li><strong>Hardware Ceiling:</strong> Physical limits on socket CPU &amp; RAM channels.</li>
              <li><strong>SPOF Risk:</strong> 100% outage if hardware fails.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-blue-400 text-[11px]">
              📈 Cost Curve Reality:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              2 vCPU ➔ $20/mo<br/>
              32 vCPU ➔ $800/mo<br/>
              128 vCPU ➔ $4,200/mo (Diminishing Returns)
            </p>
          </div>

          <div className="bg-blue-400/10 border border-blue-400/30 p-2 rounded-xl text-[10px] text-blue-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Scale vertically until engineering costs exceed cloud costs, then pivot to horizontal scaling!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <VerticalScalingVisual
          visualState={step.visualState as VerticalScalingVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
