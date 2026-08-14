"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import ApiGatewaysVisual from "@/components/system-design/visuals/ApiGatewaysVisual";
import type { ApiGatewaysVisualState } from "@/lib/system-design/lessons/reliability/api-gateways";

interface ApiGatewaysLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `An API Gateway (such as Envoy, Kong, NGINX, or AWS API Gateway) is a centralized reverse proxy and architectural boundary that acts as the single entry point for all external client traffic into a microservices cluster. It consolidates cross-cutting concerns including SSL/TLS termination, centralized authentication (JWT validation), rate limiting, request routing, telemetry, and Backend For Frontend (BFF) response aggregation.`;

const INTERVIEW_PREP = [
  {
    question: "What is the Backend For Frontend (BFF) pattern and why is it implemented at the API Gateway?",
    answer:
      "Different client form factors require different data formats (e.g. a mobile screen needs a lightweight 2KB summary to save 4G battery, while a desktop dashboard needs a rich 50KB dataset). Instead of forcing clients to make 5 separate roundtrips to different microservices, a dedicated BFF endpoint at the API Gateway queries internal services concurrently over the local datacenter LAN and returns a single optimized payload.",
  },
  {
    question: "How do you prevent an API Gateway from becoming a Single Point of Failure (SPOF)?",
    answer:
      "Deploy the API Gateway as a stateless cluster behind a Layer 4 Load Balancer (like AWS NLB or HAProxy) across multiple availability zones. If any individual gateway pod crashes, the load balancer automatically evicts it via health checks and routes traffic to healthy gateway instances with zero downtime.",
  },
  {
    question: "What is the difference between an API Gateway and a Service Mesh (like Istio)?",
    answer:
      "API Gateways manage **North-South traffic** (requests coming from external internet clients into the internal cluster, handling auth, rate limiting, and public routing). A Service Mesh manages **East-West traffic** (secure mTLS communication, circuit breaking, and distributed tracing between internal microservices inside the cluster).",
  },
];

export default function ApiGatewaysLesson({
  topic,
  group,
  lesson,
}: ApiGatewaysLessonProps) {
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
            <p className="font-bold text-yellow-400 mb-1 font-mono text-[11px]">
              ⭐ Core Gateway Responsibilities:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>TLS Termination:</strong> Offloads SSL crypto CPU load.</li>
              <li><strong>Centralized Auth:</strong> Validates JWTs at cluster edge.</li>
              <li><strong>Rate Limiting:</strong> Enforces user quotas centrally.</li>
              <li><strong>BFF Aggregation:</strong> Merges 3+ services into 1 call.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-yellow-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-yellow-400 text-[11px]">
              🌐 Traffic Direction:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              <strong>North-South:</strong> API Gateway (External ➔ Internal)<br/>
              <strong>East-West:</strong> Service Mesh (Pod ⇄ Pod)
            </p>
          </div>

          <div className="bg-yellow-400/10 border border-yellow-400/30 p-2 rounded-xl text-[10px] text-yellow-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Keep the API Gateway stateless so it can horizontally auto-scale to hundreds of pods during traffic spikes!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <ApiGatewaysVisual
          visualState={step.visualState as ApiGatewaysVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
