"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import ProxyReverseProxyVisual from "@/components/system-design/visuals/ProxyReverseProxyVisual";
import type { ProxyInfographicVisualState } from "@/lib/system-design/lessons/networking/proxy-reverse-proxy";

interface ProxyLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `In modern cloud infrastructure, Reverse Proxies (front door for origin servers), Gateway Proxies / API Gateways (control layer for microservices APIs), and Load Balancers (traffic distributors across instances) work together to guarantee security, high availability, rate limiting, and scalability.`;

const INTERVIEW_PREP = [
  {
    question: "When should you use an API Gateway (Gateway Proxy) instead of a simple Reverse Proxy?",
    answer:
      "Use an API Gateway when building microservices architectures that require centralized authentication, per-client rate limiting, request aggregation across multiple downstream services, or protocol translation (REST to gRPC).",
  },
  {
    question: "How do Reverse Proxies and Load Balancers complement each other?",
    answer:
      "A Reverse Proxy operates at Layer 7 (HTTP) to terminate TLS, cache static assets, and filter malicious requests. A Load Balancer distributes incoming HTTP/TCP requests across multiple healthy server instances to prevent single-node overload.",
  },
  {
    question: "What is SSL/TLS Termination and why is it beneficial?",
    answer:
      "SSL Termination decrypts HTTPS traffic at the reverse proxy or API gateway before forwarding plain HTTP traffic over private LANs to backend servers, saving CPU cycles on application nodes.",
  },
];

export default function ProxyReverseProxyLesson({
  topic,
  group,
  lesson,
}: ProxyLessonProps) {
  return (
    <LessonShell
      topic={topic}
      group={group}
      lesson={lesson}
      definition={DEFINITION}
      interviewPrep={INTERVIEW_PREP}
      callout={
        <div className="space-y-2.5 text-xs text-zinc-300">
          {/* Quick Difference Summary */}
          <div>
            <p className="font-bold text-amber-400 mb-1 font-mono text-[11px]">
              ⚡ Quick Difference Summary:
            </p>
            <div className="space-y-1 font-mono text-[10px]">
              <div className="bg-[#18181b] border border-amber-400/30 p-1.5 rounded flex items-center gap-2">
                <span>🛡️</span>
                <div>
                  <strong className="text-amber-400">Reverse Proxy:</strong> Front door for servers
                </div>
              </div>
              <div className="bg-[#18181b] border border-teal-400/30 p-1.5 rounded flex items-center gap-2">
                <span>⚙️</span>
                <div>
                  <strong className="text-teal-400">Gateway Proxy:</strong> Control layer for APIs
                </div>
              </div>
              <div className="bg-[#18181b] border border-blue-400/30 p-1.5 rounded flex items-center gap-2">
                <span>⚖️</span>
                <div>
                  <strong className="text-blue-400">Load Balancer:</strong> Traffic distributor
                </div>
              </div>
            </div>
          </div>

          {/* Key Use Case Highlights */}
          <div className="bg-[#18181b] border border-white/10 p-2.5 rounded-xl space-y-1.5 text-[10px] leading-relaxed">
            <p className="font-bold text-zinc-200 font-mono">
              💡 Common Architectural Roles:
            </p>
            <p className="text-zinc-400">
              • <strong>Reverse Proxy:</strong> SSL termination, static caching &amp; origin protection.
            </p>
            <p className="text-zinc-400">
              • <strong>Gateway Proxy:</strong> Auth, rate limiting, microservices routing &amp; aggregation.
            </p>
            <p className="text-zinc-400">
              • <strong>Load Balancer:</strong> Health checks, failover &amp; round-robin traffic distribution.
            </p>
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <ProxyReverseProxyVisual
          visualState={step.visualState as ProxyInfographicVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
