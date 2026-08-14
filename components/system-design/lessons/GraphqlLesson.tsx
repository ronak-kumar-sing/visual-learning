"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import GraphqlVisual from "@/components/system-design/visuals/GraphqlVisual";
import type { GraphqlVisualState } from "@/lib/system-design/lessons/web-apis/graphql";

interface GraphqlLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `GraphQL is an open-source query and data manipulation language for APIs, as well as a runtime for executing queries using a strongly typed schema. Developed by Facebook, it allows clients to define the exact structure of data required from a single endpoint (/graphql), completely eliminating over-fetching and under-fetching.`;

const INTERVIEW_PREP = [
  {
    question: "What is the N+1 problem in GraphQL and how is it solved?",
    answer:
      "The N+1 problem occurs when a query fetches a list of N parent items, and then executes N individual database queries to resolve a nested relation for each item (e.g. fetching author for 20 posts). It is solved using DataLoader to batch and cache database requests into a single SQL 'WHERE id IN (...)' query.",
  },
  {
    question: "Why is caching harder in GraphQL compared to REST?",
    answer:
      "In REST, each resource has a unique URI (/users/1) easily cached by HTTP proxies and CDNs using standard HTTP headers (Cache-Control). In GraphQL, all requests are POST requests sent to /graphql with arbitrary query strings, requiring specialized normalized client caches (like Apollo Client) or Persisted Queries.",
  },
  {
    question: "When should you choose GraphQL over REST in system design?",
    answer:
      "Choose GraphQL for mobile clients with bandwidth constraints, complex microservice architectures requiring data aggregation, or applications with deeply nested entity graphs. Choose REST for public third-party APIs, simple CRUD resources, and heavy CDN-cached endpoints.",
  },
];

export default function GraphqlLesson({ topic, group, lesson }: GraphqlLessonProps) {
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
            <p className="font-bold text-fuchsia-400 mb-1 font-mono text-[11px]">
              ⭐ Why GraphQL Was Created:
            </p>
            <div className="space-y-1 text-[10px] text-zinc-400">
              <p>
                🚨 <strong>Over-fetching in REST:</strong> Fixed endpoints return full bulky objects when you only need a single field.
              </p>
              <p>
                🚨 <strong>Under-fetching in REST:</strong> Clients must fire multiple roundtrips to assemble related resources.
              </p>
              <p>
                🛡️ <strong>GraphQL Solution:</strong> Single roundtrip to <code className="text-fuchsia-300">POST /graphql</code> returning precisely the selected schema fields.
              </p>
            </div>
          </div>

          <div className="bg-[#18181b] border border-fuchsia-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-fuchsia-400 text-[11px]">
              📋 The 3 Operations in GraphQL:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              1. <strong>Query:</strong> Read data (GET equivalent)<br/>
              2. <strong>Mutation:</strong> Write data (POST/PUT/DELETE)<br/>
              3. <strong>Subscription:</strong> Real-time streaming via WebSockets
            </p>
          </div>

          <div className="bg-fuchsia-400/10 border border-fuchsia-400/30 p-2 rounded-xl text-[10px] text-fuchsia-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Use DataLoader in production GraphQL servers to prevent the notorious N+1 database query waterfall!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <GraphqlVisual
          visualState={step.visualState as GraphqlVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
