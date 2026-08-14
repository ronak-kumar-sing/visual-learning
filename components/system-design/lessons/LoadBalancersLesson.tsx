"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import LoadBalancersVisual from "@/components/system-design/visuals/LoadBalancersVisual";
import type { LoadBalancersVisualState } from "@/lib/system-design/lessons/scaling/load-balancers";

interface LoadBalancersLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `A Load Balancer is a critical networking component that sits between clients and a backend server pool, efficiently distributing incoming network traffic across multiple healthy servers. It enhances application responsiveness, ensures high availability by routing around failed instances via automated health checks, and supports Layer 4 (Transport) and Layer 7 (Application) routing.`;

const INTERVIEW_PREP = [
  {
    question: "How do Layer 4 and Layer 7 Load Balancers differ in system design?",
    answer:
      "Layer 4 load balancers operate at the transport layer (TCP/UDP), routing packets purely based on source/dest IP and Port without inspecting application data (extremely fast, low CPU). Layer 7 load balancers operate at the application layer (HTTP/HTTPS), decrypting TLS to route based on URL paths (/images vs /api), HTTP headers, or cookie sessions.",
  },
  {
    question: "When should you use Least Connections vs Round Robin?",
    answer:
      "Use Round Robin when requests have uniform, short execution times (e.g. static assets). Use Least Connections when requests have highly variable processing durations or long-lived persistent connections (e.g. WebSockets, heavy file uploads, video processing).",
  },
  {
    question: "How do Load Balancers handle Session Persistence (Sticky Sessions)?",
    answer:
      "Through cookie-based affinity or IP Hash routing, ensuring all subsequent requests from the same user are directed to the same backend server. However, modern best practice is to design stateless application tiers where sessions live in Redis.",
  },
];

export default function LoadBalancersLesson({
  topic,
  group,
  lesson,
}: LoadBalancersLessonProps) {
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
              ⭐ Common Routing Algorithms:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>Round Robin:</strong> Sequential rotation across all servers.</li>
              <li><strong>Least Connections:</strong> Routes to lowest active connection count.</li>
              <li><strong>Weighted:</strong> Proportional to server CPU/RAM capacity.</li>
              <li><strong>IP Hash:</strong> Deterministic client IP mapping.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-blue-400 text-[11px]">
              🚦 Layer 4 vs Layer 7 Rule:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              Raw Speed &amp; High PPS ➔ <span className="text-blue-300 font-bold">Layer 4 (NLB)</span><br/>
              Path Routing &amp; SSL Term ➔ <span className="text-emerald-300 font-bold">Layer 7 (ALB)</span>
            </p>
          </div>

          <div className="bg-blue-400/10 border border-blue-400/30 p-2 rounded-xl text-[10px] text-blue-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Always configure health check thresholds with grace periods to avoid prematurely evicting servers during brief CPU spikes!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <LoadBalancersVisual
          visualState={step.visualState as LoadBalancersVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
