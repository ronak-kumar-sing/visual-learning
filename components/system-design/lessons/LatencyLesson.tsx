"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import LatencyVisual from "@/components/system-design/visuals/LatencyVisual";
import type { LatencyVisualState } from "@/lib/system-design/lessons/networking/latency";

interface LatencyLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `Latency is the time duration required for a data packet to travel from the sender to the receiver and back (Round-Trip Time, RTT). Total latency is the sum of Propagation Delay (physical transit time through medium), Transmission Delay (pushing bits onto wire), Queuing Delay (waiting in router buffers), and Processing Delay (server CPU execution).`;

const INTERVIEW_PREP = [
  {
    question: "How do latency and throughput differ in system design?",
    answer:
      "Latency measures delay (speed of 1 request in milliseconds). Throughput measures volume (total requests or bits per second). A network can have high throughput (moving 100 GB files) while still having high latency (each packet takes 200ms).",
  },
  {
    question: "Why is P99 latency more important than average latency?",
    answer:
      "Average latency hides tail spikes. If 99% of requests take 10ms but 1% take 5,000ms due to database lock contention, the average may look clean (~15ms), but 1 in 100 users experiences a broken 5-second delay. P99 reflects worst-case real user experience.",
  },
  {
    question: "What architectural strategies reduce global latency for users?",
    answer:
      "1) Deploying Content Delivery Networks (CDNs) to cache static assets at edge locations close to users. 2) Deploying multi-region application clusters. 3) Using persistent TCP connections (HTTP Keep-Alive / WebSockets) to eliminate handshake RTTs.",
  },
];

export default function LatencyLesson({
  topic,
  group,
  lesson,
}: LatencyLessonProps) {
  return (
    <LessonShell
      topic={topic}
      group={group}
      lesson={lesson}
      definition={DEFINITION}
      interviewPrep={INTERVIEW_PREP}
      callout={
        <div className="space-y-2 text-xs text-zinc-300">
          <p>
            <strong>GeeksforGeeks Key Concepts:</strong>
          </p>
          <ul className="list-disc pl-4 space-y-1 text-zinc-400">
            <li>
              <strong>Total Latency Formula:</strong> Propagation + Transmission
              + Queuing + Processing Delay.
            </li>
            <li>
              <strong>Speed of Light Limit:</strong> Light travels through fiber at
              ~200,000 km/s (~5ms per 1,000km). Physical distance imposes an unavoidable lower latency bound.
            </li>
            <li>
              <strong>P99 Tail Latency:</strong> Essential metric in system design
              to catch worst-case buffer bloat and lock contention.
            </li>
          </ul>
        </div>
      }
      visual={(step: LessonStep) => (
        <LatencyVisual
          visualState={step.visualState as LatencyVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
