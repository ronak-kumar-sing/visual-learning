"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import WebsocketsVisual from "@/components/system-design/visuals/WebsocketsVisual";
import type { WebsocketsVisualState } from "@/lib/system-design/lessons/realtime/websockets";

interface WebsocketsLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `WebSockets (RFC 6455) provide full-duplex, bidirectional communication channels over a single persistent TCP connection. Initiated through an HTTP 101 Switching Protocols handshake, WebSockets eliminate the massive latency, connection churn, and 800+ byte header overhead of traditional HTTP polling, enabling sub-millisecond real-time interactivity for multiplayer games, collaborative workspaces (Figma), and chat applications.`;

const INTERVIEW_PREP = [
  {
    question: "How do you scale WebSocket connections across multiple backend server instances?",
    answer:
      "Because WebSockets are persistent stateful connections, a client connected to Server A cannot directly send a message to a peer connected to Server B. To scale horizontally: 1) Deploy a distributed message broker (Redis Pub/Sub, Apache Kafka, or NATS) as a central backplane, 2) When Server A receives a frame for User B, it publishes to the user's channel on Redis, 3) Server B receives the pub/sub event and pushes it down the active TCP socket to User B.",
  },
  {
    question: "When should you choose Server-Sent Events (SSE) instead of WebSockets?",
    answer:
      "Choose SSE when communication is strictly unidirectional from Server to Client (e.g. LLM token streaming in ChatGPT, real-time stock prices, or notification bells). SSE runs over standard HTTP/2, supports automatic reconnection out of the box, and bypasses enterprise firewall/proxy issues that sometimes block WebSockets.",
  },
  {
    question: "How do you handle WebSocket connection loss and heartbeats?",
    answer:
      "Implement Ping/Pong heartbeat frames every 30-60 seconds to detect dead TCP sockets (e.g. mobile client entering a subway tunnel). If a Pong is not received within the timeout window, terminate the zombie connection on the server and trigger client-side exponential backoff reconnection with message queue replay.",
  },
];

export default function WebsocketsLesson({
  topic,
  group,
  lesson,
}: WebsocketsLessonProps) {
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
              ⭐ Real-Time Protocol Matrix:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>Polling:</strong> Client repeatedly pulls; 95% empty waste.</li>
              <li><strong>SSE:</strong> Persistent unidirectional server-to-client push.</li>
              <li><strong>WebSockets:</strong> Full-duplex bidirectional stream over 1 TCP socket.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-green-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-green-400 text-[11px]">
              ⚡ Overhead Efficiency:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              HTTP Header: <strong>~800 Bytes per poll</strong><br/>
              WebSocket Frame: <strong>2 - 10 Bytes (99% Less Overhead!)</strong>
            </p>
          </div>

          <div className="bg-green-400/10 border border-green-400/30 p-2 rounded-xl text-[10px] text-green-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Use Redis Pub/Sub as the central message backplane to broadcast frames across multi-node WebSocket clusters!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <WebsocketsVisual
          visualState={step.visualState as WebsocketsVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
