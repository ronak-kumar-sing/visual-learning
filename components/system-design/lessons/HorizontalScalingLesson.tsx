"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import HorizontalScalingVisual from "@/components/system-design/visuals/HorizontalScalingVisual";
import type { HorizontalScalingVisualState } from "@/lib/system-design/lessons/scaling/horizontal-scaling";

interface HorizontalScalingLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `Horizontal Scaling (Scaling Out) is the architectural practice of adding more discrete computing instances (commodity servers, containers, or virtual machines) into a distributed pool coordinated by a Load Balancer. It eliminates Single Points of Failure (SPOF) and offers elastic, near-infinite capacity scaling.`;

const INTERVIEW_PREP = [
  {
    question: "What makes application servers suitable for Horizontal Scaling?",
    answer:
      "Statelessness. When application servers do not store client session state or file uploads locally in memory (offloading sessions to Redis and media to S3/Blob storage), any incoming request can be safely routed to any available instance.",
  },
  {
    question: "How does an Auto-Scaling Group (ASG) work in production cloud environments?",
    answer:
      "An ASG tracks system metrics (CPU utilization > 70%, request count per target, or queue backlog) and automatically provisions new EC2/Kubernetes pod instances when thresholds are breached, registering them to the target group of a Load Balancer.",
  },
  {
    question: "What new architectural challenges does Horizontal Scaling introduce?",
    answer:
      "1) Distributed session management, 2) Distributed logging/tracing across multiple machines, 3) Cache invalidation complexity, 4) Database write scaling bottlenecks (requiring sharding).",
  },
];

export default function HorizontalScalingLesson({
  topic,
  group,
  lesson,
}: HorizontalScalingLessonProps) {
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
              ⭐ Scale-Out Advantages:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>High Availability:</strong> Zero single point of failure (SPOF).</li>
              <li><strong>Elastic Cost:</strong> Scale down during low-traffic nights to save money.</li>
              <li><strong>Commodity Hardware:</strong> Cheap, interchangeable virtual instances.</li>
              <li><strong>Rolling Deployments:</strong> Zero-downtime canary updates.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-blue-400 text-[11px]">
              ⚖️ Scaling Rule of Thumb:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              Start Vertical for simplicity ➔ Go Horizontal when traffic grows or High Availability is required!
            </p>
          </div>

          <div className="bg-blue-400/10 border border-blue-400/30 p-2 rounded-xl text-[10px] text-blue-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Always store session tokens in a central Redis cache so users don't get logged out when load balancers switch server nodes!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <HorizontalScalingVisual
          visualState={step.visualState as HorizontalScalingVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
