import type { Lesson } from "@/lib/system-design/types";

// VisualState shape for ClientServerVisual
export type ClientServerPhase =
  | "idle"
  | "connecting"
  | "request-fly"
  | "processing"
  | "response-fly"
  | "complete";

export interface ClientServerVisualState {
  phase: ClientServerPhase;
  statusCode: string;
  requestLabel: string;
  responseLabel: string;
}

export const clientServerLesson: Lesson = {
  pseudocode: [
    "// Client-Server Architecture",
    "function request(url):",
    "  conn = TCP.connect(server, port=443)",
    "  send(conn, 'GET / HTTP/1.1')",
    "  send(conn, 'Host: ' + url)",
    "  response = await conn.receive()",
    "  render(parse(response.body))",
    "  conn.close()",
  ],

  steps: [
    {
      narration:
        "The client (your browser) wants to load a page. It resolves the domain and prepares to connect.",
      activeLine: 1,
      state: {
        phase: "idle",
        clientStatus: "typing URL",
        serverStatus: "listening",
        statusCode: "—",
      },
      visualState: {
        phase: "idle",
        statusCode: "—",
        requestLabel: "",
        responseLabel: "",
      } satisfies ClientServerVisualState,
    },
    {
      narration:
        "Client opens a TCP connection to the server on port 443 — a reliable, ordered byte stream.",
      activeLine: 2,
      state: {
        phase: "connecting",
        clientStatus: "TCP handshake",
        serverStatus: "accepting",
        statusCode: "—",
      },
      visualState: {
        phase: "connecting",
        statusCode: "—",
        requestLabel: "TCP SYN →",
        responseLabel: "",
      } satisfies ClientServerVisualState,
    },
    {
      narration:
        "Client sends an HTTP GET request through the established connection.",
      activeLine: 3,
      state: {
        phase: "request",
        clientStatus: "sending",
        serverStatus: "receiving",
        statusCode: "—",
      },
      visualState: {
        phase: "request-fly",
        statusCode: "—",
        requestLabel: "GET / HTTP/1.1",
        responseLabel: "",
      } satisfies ClientServerVisualState,
    },
    {
      narration:
        "Server receives the request, reads the URL path, and begins processing — querying data or reading files.",
      activeLine: 5,
      state: {
        phase: "processing",
        clientStatus: "waiting",
        serverStatus: "processing",
        statusCode: "—",
      },
      visualState: {
        phase: "processing",
        statusCode: "—",
        requestLabel: "GET / HTTP/1.1",
        responseLabel: "",
      } satisfies ClientServerVisualState,
    },
    {
      narration:
        "Server sends back an HTTP 200 OK response with HTML content in the body.",
      activeLine: 5,
      state: {
        phase: "response",
        clientStatus: "receiving",
        serverStatus: "sending",
        statusCode: "200 OK",
      },
      visualState: {
        phase: "response-fly",
        statusCode: "200 OK",
        requestLabel: "",
        responseLabel: "HTTP/1.1 200 OK",
      } satisfies ClientServerVisualState,
    },
    {
      narration:
        "Client receives the HTML, parses it, and renders the page. Connection is closed when done.",
      activeLine: 6,
      state: {
        phase: "complete",
        clientStatus: "rendered ✓",
        serverStatus: "done",
        statusCode: "200 OK",
      },
      visualState: {
        phase: "complete",
        statusCode: "200 OK",
        requestLabel: "",
        responseLabel: "HTML rendered",
      } satisfies ClientServerVisualState,
    },
  ],
};
