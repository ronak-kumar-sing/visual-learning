import type { Lesson } from "@/lib/system-design/types";

export type RealTimeProtocol = "short-polling" | "long-polling" | "sse" | "websocket";

export interface ProtocolDetailItem {
  id: RealTimeProtocol;
  name: string;
  badge: string;
  direction: string;
  overhead: string;
  latency: string;
  bestFor: string;
}

export const PROTOCOL_COMPARISONS: ProtocolDetailItem[] = [
  {
    id: "short-polling",
    name: "Short Polling",
    badge: "High Overhead",
    direction: "Client ➔ Server (Pull)",
    overhead: "High (New TCP Handshake + HTTP Headers every 2s)",
    latency: "High (Up to poll interval delay)",
    bestFor: "Simple dashboards with infrequent updates (<1/min).",
  },
  {
    id: "long-polling",
    name: "Long Polling",
    badge: "Hanging Connection",
    direction: "Client ➔ Server (Hanging Pull)",
    overhead: "Medium (Re-opens connection immediately on each message)",
    latency: "Low (Instant response when server has data)",
    bestFor: "Legacy browser fallback where WebSockets are blocked.",
  },
  {
    id: "sse",
    name: "Server-Sent Events (SSE)",
    badge: "Unidirectional Stream",
    direction: "Server ➔ Client (Push Only)",
    overhead: "Low (Persistent HTTP connection, text/event-stream)",
    latency: "Ultra-Low (<5ms)",
    bestFor: "Stock ticker feeds, AI token streaming (ChatGPT), live scoreboards.",
  },
  {
    id: "websocket",
    name: "WebSockets",
    badge: "Full-Duplex Bidirectional",
    direction: "Client ⇄ Server (Two-Way Push)",
    overhead: "Ultra-Low (2-10 byte frame overhead, single TCP socket)",
    latency: "Sub-Millisecond (<1ms)",
    bestFor: "Multiplayer gaming, collaborative editing (Figma), live chat apps.",
  },
];

export interface WebsocketsVisualState {
  currentStepIndex: number;
  selectedProtocol: RealTimeProtocol;
  activePacketCount: number;
  isUpgraded: boolean;
}

export const websocketsLesson: Lesson = {
  pseudocode: [
    "// WebSocket Connection Lifecycle & Upgrade Protocol",
    "// 1. Initial HTTP Upgrade Handshake",
    "GET /chat/room12 HTTP/1.1",
    "Host: api.example.com",
    "Upgrade: websocket",
    "Connection: Upgrade",
    "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==",
    "Sec-WebSocket-Version: 13",
    "",
    "// 2. Server 101 Switching Protocols Response",
    "HTTP/1.1 101 Switching Protocols",
    "Upgrade: websocket",
    "Connection: Upgrade",
    "Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=",
    "",
    "// 3. Persistent Full-Duplex Framing (2-Byte Overhead)",
    "socket.onMessage((frame) => handleRealtimeEvent(frame))",
  ],

  steps: [
    {
      narration:
        "Step 1: Short Polling Bottleneck. Client queries GET /messages every 2 seconds. 95% of requests return empty responses, wasting bandwidth and battery.",
      activeLine: 3,
      state: {
        protocol: "Short Polling",
        connectionModel: "Repeated HTTP Request/Response (Every 2s)",
        headerOverhead: "800 Bytes per poll",
        wastePct: "95% Empty Responses",
      },
      visualState: {
        currentStepIndex: 0,
        selectedProtocol: "short-polling",
        activePacketCount: 6,
        isUpgraded: false,
      } satisfies WebsocketsVisualState,
    },
    {
      narration:
        "Step 2: HTTP 101 Upgrade Handshake. Client requests protocol switch (`Upgrade: websocket`). Server accepts and upgrades the TCP socket to bidirectional.",
      activeLine: 10,
      state: {
        protocol: "HTTP 101 Upgrade",
        handshake: "Sec-WebSocket-Key ➔ Sec-WebSocket-Accept",
        status: "101 Switching Protocols",
        socketStatus: "Upgrading to TCP Binary Stream",
      },
      visualState: {
        currentStepIndex: 1,
        selectedProtocol: "websocket",
        activePacketCount: 2,
        isUpgraded: true,
      } satisfies WebsocketsVisualState,
    },
    {
      narration:
        "Step 3: Full-Duplex Bidirectional Stream. Server and client push instant messages in both directions with tiny 2-byte frame overhead.",
      activeLine: 16,
      state: {
        protocol: "WebSocket (Full-Duplex)",
        latency: "<1ms Sub-Millisecond",
        frameOverhead: "2 - 10 Bytes (vs 800+ bytes in HTTP)",
        concurrency: "100,000+ persistent sockets per server",
      },
      visualState: {
        currentStepIndex: 2,
        selectedProtocol: "websocket",
        activePacketCount: 12,
        isUpgraded: true,
      } satisfies WebsocketsVisualState,
    },
  ],
};
