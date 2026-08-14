"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import ClientServerVisual from "@/components/system-design/visuals/ClientServerVisual";
import type { ClientServerVisualState } from "@/lib/system-design/lessons/networking/client-server-architecture";

interface ClientServerLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `Client-Server Architecture is a distributed application structure that partitions tasks or workloads between service providers (servers) and service requesters (clients). Clients communicate over a computer network via standard protocols like HTTP/HTTPS to request data, while servers listen, process business logic, and return responses.`;

const INTERVIEW_PREP = [
  {
    question: "How does Client-Server architecture scale under heavy traffic?",
    answer:
      "By decoupling client state (stateless authentication via JWT) and placing a Load Balancer in front of multiple horizontally-scaled backend application servers.",
  },
  {
    question: "What is the primary bottleneck in a simple Client-Server system?",
    answer:
      "The server's network bandwidth, CPU/RAM, or its single database connection limit. If traffic exceeds capacity without load balancing or caching, latency spikes and 503 errors occur.",
  },
  {
    question: "Why is HTTP considered a stateless client-server protocol?",
    answer:
      "Each HTTP request is processed independently without the server automatically remembering previous requests. App state is maintained via cookies, session storage, or authorization tokens.",
  },
];

export default function ClientServerLesson({
  topic,
  group,
  lesson,
}: ClientServerLessonProps) {
  return (
    <LessonShell
      topic={topic}
      group={group}
      lesson={lesson}
      definition={DEFINITION}
      interviewPrep={INTERVIEW_PREP}
      callout={
        <p>
          Every web interaction — loading a page, sending a form, calling an API
          — is a client sending a request and a server sending a response. This
          pattern is the foundation everything else is built on.
        </p>
      }
      visual={(step: LessonStep) => (
        <ClientServerVisual
          visualState={step.visualState as ClientServerVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
