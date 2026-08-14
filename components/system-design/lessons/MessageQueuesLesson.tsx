"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import MessageQueuesVisual from "@/components/system-design/visuals/MessageQueuesVisual";
import type { MessageQueuesVisualState } from "@/lib/system-design/lessons/reliability/message-queues";

interface MessageQueuesLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `A Message Queue (such as Apache Kafka, RabbitMQ, or AWS SQS) is an asynchronous inter-process communication buffer that completely decouples the speed of producers (which generate tasks) from the speed of consumers (which process them). By buffering incoming spikes, message queues prevent cascading database crashes, level out backpressure, and enable non-blocking sub-millisecond API response times.`;

const INTERVIEW_PREP = [
  {
    question: "When should you choose Apache Kafka over RabbitMQ in system design?",
    answer:
      "Choose Apache Kafka when you need high-throughput event streaming (>100,000 to millions of msgs/sec), long-term log retention, replayability of historical events by new consumer groups, or event sourcing architectures. Choose RabbitMQ when you need complex routing keys, granular message-level ACKs, priority queues, or lightweight push-based background task execution.",
  },
  {
    question: "What is Backpressure and how do message queues solve it?",
    answer:
      "Backpressure occurs when downstream consumers (e.g. video encoders or databases) cannot process requests as fast as upstream clients produce them. A message queue acts as an elastic shock absorber: producers dump jobs into the durable queue in 1ms, and consumers pull tasks at their own maximum sustainable rate without running out of CPU or memory.",
  },
  {
    question: "What is a Dead Letter Queue (DLQ) and why is it necessary?",
    answer:
      "A Dead Letter Queue is a secondary queue where messages that repeatedly fail processing (poison pills) are isolated after exceeding a maximum retry limit (e.g. 3 attempts). This prevents a malformed message from blocking the consumer loop indefinitely and allows engineers to inspect and debug failed payloads safely.",
  },
];

export default function MessageQueuesLesson({
  topic,
  group,
  lesson,
}: MessageQueuesLessonProps) {
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
              ⭐ Queue Architecture Superpowers:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>Temporal Decoupling:</strong> Producers &amp; consumers run independently.</li>
              <li><strong>Backpressure Leveling:</strong> Smooths out 10,000 req/s flash sales.</li>
              <li><strong>Fault Tolerance:</strong> Tasks persist in queue if consumers crash.</li>
              <li><strong>Poison Pill Isolation:</strong> Malformed jobs divert to DLQ.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-yellow-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-yellow-400 text-[11px]">
              ⏱️ Latency Decoupling:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              Sync Execution: <strong>5 - 10 Seconds (User Waits)</strong><br/>
              Async Enqueue: <strong>1.2 Milliseconds (Instant HTTP 202)</strong>
            </p>
          </div>

          <div className="bg-yellow-400/10 border border-yellow-400/30 p-2 rounded-xl text-[10px] text-yellow-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Always monitor `Consumer Lag` in Kafka/SQS to trigger auto-scaling on worker pods before queues back up!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <MessageQueuesVisual
          visualState={step.visualState as MessageQueuesVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
