"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import MicroservicesVisual from "@/components/system-design/visuals/MicroservicesVisual";
import type { MicroservicesVisualState } from "@/lib/system-design/lessons/realtime/microservices";

interface MicroservicesLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `Microservices Architecture is an architectural style that structures an application as a collection of small, autonomous, and independently deployable services organized around distinct business domains. Each microservice manages its own isolated database (Database-per-Service) and communicates via lightweight APIs (REST/gRPC) or asynchronous event streams (Kafka), utilizing patterns like API Gateways, Service Discovery, and Distributed Sagas.`;

const INTERVIEW_PREP = [
  {
    question: "How do you handle distributed transactions across microservices without 2-Phase Commit (2PC)?",
    answer:
      "Use the Saga Pattern. A Saga is a sequence of local transactions where each microservice updates its own database and publishes an event. If a subsequent step fails (e.g. inventory out of stock), the saga orchestrator (or choreography event stream) executes a sequence of compensating transactions (e.g. issuing a refund and un-reserving resources) in reverse order to restore eventual consistency.",
  },
  {
    question: "What is the Database-per-Service pattern and why is it mandatory?",
    answer:
      "Each microservice must own and encapsulate its private database. No other service is permitted to query or modify that database directly. This ensures loose coupling, allows each service to choose the optimal database engine (polyglot persistence: e.g. Mongo for catalogs, Postgres for orders), and prevents one service's schema migration from breaking unrelated domain logic.",
  },
  {
    question: "What is the role of an API Gateway in a microservices architecture?",
    answer:
      "The API Gateway acts as the single reverse proxy entry point for all client requests. It handles cross-cutting concerns: SSL/TLS termination, centralized authentication (JWT validation), rate limiting, request routing to internal service pods, and API aggregation (BFF - Backend For Frontend pattern).",
  },
];

export default function MicroservicesLesson({
  topic,
  group,
  lesson,
}: MicroservicesLessonProps) {
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
            <p className="font-bold text-green-400 mb-1 font-mono text-[11px]">
              ⭐ Core Microservices Patterns:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>API Gateway:</strong> Central routing, auth, and rate limits.</li>
              <li><strong>Database-per-Service:</strong> Isolated data ownership.</li>
              <li><strong>Saga Pattern:</strong> Compensating transactions replace 2PC.</li>
              <li><strong>Asynchronous Events:</strong> Kafka/RabbitMQ decouples latency.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-green-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-green-400 text-[11px]">
              🚀 Deployment Freedom:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              Monolith: <strong>All-or-nothing release (High risk)</strong><br/>
              Microservices: <strong>Deploy 10x/day per team independently!</strong>
            </p>
          </div>

          <div className="bg-green-400/10 border border-green-400/30 p-2 rounded-xl text-[10px] text-green-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Never start with microservices on day one. Build a clean modular monolith first, then carve out services along domain boundaries!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <MicroservicesVisual
          visualState={step.visualState as MicroservicesVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
