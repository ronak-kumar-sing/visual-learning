"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import ApisVisual from "@/components/system-design/visuals/ApisVisual";
import type { ApiVisualState } from "@/lib/system-design/lessons/web-apis/apis";

interface ApisLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `An API (Application Programming Interface) is a set of rules, protocols, and endpoints that allows two software applications to communicate with each other and exchange structured data (such as JSON or XML) securely over HTTP/HTTPS.`;

const INTERVIEW_PREP = [
  {
    question: "What is the difference between Idempotent and Non-Idempotent HTTP methods in API design?",
    answer:
      "An idempotent method produces the same server state regardless of how many times it is called with identical parameters (e.g. GET, PUT, DELETE). A non-idempotent method creates a new server state on every request (e.g. POST creates duplicate records).",
  },
  {
    question: "How do Public, Private, Partner, and Composite APIs differ?",
    answer:
      "1) Public APIs are open to any developer, 2) Private APIs are isolated within an enterprise LAN, 3) Partner APIs are restricted to B2B partners, 4) Composite APIs batch multiple microservice API calls into a single response to reduce client round-trips.",
  },
  {
    question: "What are essential API Best Practices for production systems?",
    answer:
      "1) Use noun-based URI paths with standard HTTP verbs (/api/v1/users), 2) Version APIs in path or headers, 3) Enforce HTTPS encryption, OAuth2 auth & rate limiting, 4) Provide comprehensive OpenAPI / Swagger documentation.",
  },
];

export default function ApisLesson({ topic, group, lesson }: ApisLessonProps) {
  return (
    <LessonShell
      topic={topic}
      group={group}
      lesson={lesson}
      definition={DEFINITION}
      interviewPrep={INTERVIEW_PREP}
      callout={
        <div className="space-y-3 text-xs text-zinc-300">
          {/* Key Characteristics (5 Cards) */}
          <div>
            <p className="font-bold text-emerald-400 mb-1 font-mono text-[11px]">
              ⭐ 5 Key Characteristics of APIs:
            </p>
            <div className="grid grid-cols-1 gap-1 text-[10px]">
              <div className="bg-[#18181b] border border-white/10 p-1.5 rounded font-mono">
                🧩 <strong>Enables Integration:</strong> Connects disparate software systems.
              </div>
              <div className="bg-[#18181b] border border-white/10 p-1.5 rounded font-mono">
                🛡️ <strong>Standardized:</strong> Standard HTTP request/response methods.
              </div>
              <div className="bg-[#18181b] border border-white/10 p-1.5 rounded font-mono">
                📄 <strong>Data Exchange:</strong> Structured JSON &amp; XML data formats.
              </div>
              <div className="bg-[#18181b] border border-white/10 p-1.5 rounded font-mono">
                🔒 <strong>Secure:</strong> API keys, OAuth2 authentication &amp; rate limiting.
              </div>
              <div className="bg-[#18181b] border border-white/10 p-1.5 rounded font-mono">
                📈 <strong>Scalable:</strong> Extends system features seamlessly.
              </div>
            </div>
          </div>

          {/* Real-World Travel Website Weather API Example */}
          <div className="bg-[#18181b] border border-emerald-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-emerald-400 text-[11px]">
              🌤️ Real-World Travel Website Example:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              Travel Website ➔ Request ➔ <strong>Weather API</strong> ➔ Response ➔ Real-time weather updates payload.
            </p>
          </div>

          {/* Best Practices Checklist */}
          <div>
            <p className="font-bold text-emerald-400 mb-1 font-mono text-[11px]">
              ✔ API Best Practices:
            </p>
            <ul className="list-disc pl-4 space-y-0.5 text-zinc-400 text-[10px]">
              <li>Use consistent naming conventions</li>
              <li>Version your APIs (<code className="text-emerald-300">/v1/</code>, <code className="text-emerald-300">/v2/</code>)</li>
              <li>Document clearly (OpenAPI / Swagger)</li>
              <li>Enforce security &amp; rate limiting</li>
              <li>Monitor &amp; analyze performance</li>
            </ul>
          </div>

          {/* In Short Banner */}
          <div className="bg-emerald-400/10 border border-emerald-400/30 p-2 rounded-xl text-[10px] text-emerald-300 font-mono">
            💡 <strong>In Short:</strong> An API acts as a bridge that allows applications to communicate, share data, and deliver more value together!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <ApisVisual
          visualState={step.visualState as ApiVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
