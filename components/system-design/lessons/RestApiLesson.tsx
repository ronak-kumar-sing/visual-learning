"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import RestApiVisual from "@/components/system-design/visuals/RestApiVisual";
import type { RestApiVisualState } from "@/lib/system-design/lessons/web-apis/rest-api";

interface RestApiLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `REST (Representational State Transfer) is an architectural style for distributed hypermedia systems. It relies on a stateless client-server protocol (almost always HTTP), structured URIs for identifying resources (/articles/42), standard HTTP verbs for operations (GET, POST, PUT, DELETE), and standardized representation formats like JSON.`;

const INTERVIEW_PREP = [
  {
    question: "What is the difference between PUT and PATCH in REST API design?",
    answer:
      "PUT replaces the entire resource with the payload sent in the request (idempotent). PATCH applies a partial update modifying only the specific fields included in the request body.",
  },
  {
    question: "Why is Statelessness critical for horizontal scalability in system design?",
    answer:
      "Because the server stores no client session context, any backend instance behind a load balancer can handle any request without needing sticky sessions or distributed session synchronization.",
  },
  {
    question: "What makes an HTTP method Idempotent?",
    answer:
      "An HTTP method is idempotent if making the same request multiple times produces the exact same server state as making it once. GET, PUT, and DELETE are idempotent; POST is non-idempotent because multiple calls create multiple rows.",
  },
];

export default function RestApiLesson({ topic, group, lesson }: RestApiLessonProps) {
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
            <p className="font-bold text-teal-400 mb-1 font-mono text-[11px]">
              ⭐ 6 Core REST Constraints:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>Client-Server:</strong> UI decoupled from data storage.</li>
              <li><strong>Stateless:</strong> No session state stored on servers.</li>
              <li><strong>Cacheable:</strong> Responses specify caching rules.</li>
              <li><strong>Uniform Interface:</strong> Standard URIs and HTTP verbs.</li>
              <li><strong>Layered System:</strong> Transparent proxies and gateways.</li>
              <li><strong>Code on Demand:</strong> Optional executable scripts.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-teal-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-teal-400 text-[11px]">
              🔄 CRUD Method Mappings:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              CREATE ➔ <span className="text-amber-400">POST</span><br/>
              READ ➔ <span className="text-emerald-400">GET</span> (Cacheable)<br/>
              UPDATE ➔ <span className="text-blue-400">PUT / PATCH</span><br/>
              DELETE ➔ <span className="text-red-400">DELETE</span>
            </p>
          </div>

          <div className="bg-teal-400/10 border border-teal-400/30 p-2 rounded-xl text-[10px] text-teal-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Always return appropriate 2xx, 4xx, and 5xx HTTP status codes with structured JSON error bodies!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <RestApiVisual
          visualState={step.visualState as RestApiVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
