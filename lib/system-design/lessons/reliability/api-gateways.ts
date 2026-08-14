import type { Lesson } from "@/lib/system-design/types";

export interface GatewayMiddlewareStep {
  name: string;
  badge: string;
  description: string;
  executionTime: string;
}

export const GATEWAY_MIDDLEWARE_PIPELINE: GatewayMiddlewareStep[] = [
  { name: "1. TLS Termination", badge: "Security", description: "Decrypts HTTPS traffic and terminates SSL certificates near client.", executionTime: "2ms" },
  { name: "2. JWT Authentication", badge: "Auth", description: "Validates Authorization Bearer token signature & RBAC claims.", executionTime: "1ms" },
  { name: "3. Rate Limiter Check", badge: "Protection", description: "Verifies user quota in Redis token bucket (Blocks with 429 if full).", executionTime: "0.5ms" },
  { name: "4. Dynamic Routing", badge: "Dispatch", description: "Routes /api/v1/orders/42 to internal microservice pod on port 8002.", executionTime: "1ms" },
];

export interface ApiGatewaysVisualState {
  currentStepIndex: number;
  activePath: string;
  middlewarePassed: number;
  routedService: string;
}

export const apiGatewaysLesson: Lesson = {
  pseudocode: [
    "// API Gateway Request Ingestion & Middleware Pipeline (Envoy / Kong)",
    "async function handleClientRequest(req):",
    "  // 1. SSL/TLS Termination",
    "  const cleanReq = tlsEngine.decrypt(req)",
    "  ",
    "  // 2. Centralized Auth & JWT Verification",
    "  const user = await authMiddleware.verifyJwt(cleanReq.headers['authorization'])",
    "  if (!user) return httpResponse(401, 'Unauthorized')",
    "  ",
    "  // 3. Centralized Rate Limiting",
    "  const isAllowed = await rateLimiter.consumeToken(user.id)",
    "  if (!isAllowed) return httpResponse(429, 'Too Many Requests')",
    "  ",
    "  // 4. Reverse Proxy Dynamic Routing",
    "  const targetService = serviceRegistry.resolve(cleanReq.path) // e.g. OrderService",
    "  return await proxyClient.forward(targetService, cleanReq)",
  ],

  steps: [
    {
      narration:
        "Step 1: TLS Termination & Security Check. Client connects via HTTPS. API Gateway terminates the SSL handshake and verifies the JWT authentication token.",
      activeLine: 7,
      state: {
        stage: "TLS & Auth Middleware",
        incomingUrl: "https://api.myapp.com/api/v1/orders",
        tlsStatus: "Decrypted (TLS 1.3)",
        jwtStatus: "Alex (User ID: 42) Verified ✓",
      },
      visualState: {
        currentStepIndex: 0,
        activePath: "/api/v1/orders",
        middlewarePassed: 2,
        routedService: "auth",
      } satisfies ApiGatewaysVisualState,
    },
    {
      narration:
        "Step 2: Rate Limit Verification. Gateway queries Redis token bucket. Client has 4 tokens remaining, approving the request in 0.5ms.",
      activeLine: 10,
      state: {
        stage: "Rate Limit Token Check",
        tokenQuota: "4 / 5 Tokens Available",
        action: "Token Consumed ✓",
        status: "Allowed (No Throttling)",
      },
      visualState: {
        currentStepIndex: 1,
        activePath: "/api/v1/orders",
        middlewarePassed: 3,
        routedService: "ratelimit",
      } satisfies ApiGatewaysVisualState,
    },
    {
      narration:
        "Step 3: Dynamic Path Routing & Dispatch. Gateway consults Service Registry and proxies the clean internal request to Order Service Pod on port 8002.",
      activeLine: 14,
      state: {
        stage: "Microservice Dispatch",
        routeRule: "/api/v1/orders/* ➔ OrderService:8002",
        protocol: "Internal gRPC / HTTP/2",
        destination: "Order Service Pod #3",
      },
      visualState: {
        currentStepIndex: 2,
        activePath: "/api/v1/orders",
        middlewarePassed: 4,
        routedService: "order-service",
      } satisfies ApiGatewaysVisualState,
    },
  ],
};
