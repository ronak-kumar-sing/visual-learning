import type { Lesson } from "@/lib/system-design/types";

export interface ApiEndpointItem {
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  description: string;
  samplePayload?: string;
}

export const COMMON_API_ENDPOINTS: ApiEndpointItem[] = [
  {
    method: "GET",
    endpoint: "/api/users",
    description: "Retrieve a list of all users from database.",
    samplePayload: `[{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]`,
  },
  {
    method: "GET",
    endpoint: "/api/users/{id}",
    description: "Retrieve user details for a specific user ID.",
    samplePayload: `{"id": 1, "name": "Alice", "role": "engineer"}`,
  },
  {
    method: "POST",
    endpoint: "/api/users",
    description: "Create a new user record in database.",
    samplePayload: `{"name": "Charlie", "email": "charlie@example.com"}`,
  },
  {
    method: "PUT",
    endpoint: "/api/users/{id}",
    description: "Update existing user details by ID.",
    samplePayload: `{"name": "Alice Smith", "role": "lead_engineer"}`,
  },
  {
    method: "DELETE",
    endpoint: "/api/users/{id}",
    description: "Delete a user record by ID.",
    samplePayload: `{"status": "deleted", "id": 1}`,
  },
];

export interface ApiVisualState {
  currentStepIndex: number;
  activeMethod: "GET" | "POST" | "PUT" | "DELETE";
  activeEndpoint: string;
  apiType: "public" | "private" | "partner" | "composite";
  packetState: "idle" | "requesting" | "processing" | "responding";
}

export const apisLesson: Lesson = {
  pseudocode: [
    "// API Request/Response Lifecycle Algorithm",
    "function processApiCall(clientRequest):",
    "  // Step 1: Validate HTTP Method & Endpoint",
    "  endpoint = router.findMatch(clientRequest.method, clientRequest.path)",
    "  ",
    "  // Step 2: Authenticate & Authorize",
    "  auth.verifyApiKey(clientRequest.headers.authorization)",
    "  ",
    "  // Step 3: Execute Business Logic & Database Query",
    "  responseData = database.execute(endpoint.query, clientRequest.body)",
    "  ",
    "  // Step 4: Serialize & Return JSON Response",
    "  return response.json({ status: 200, data: responseData })",
  ],

  steps: [
    {
      narration:
        "Step 1: Client Application (e.g. Travel Website) initiates an API call GET /api/weather?city=Tokyo.",
      activeLine: 3,
      state: {
        step: "1 of 4",
        requestMethod: "GET",
        endpoint: "/api/weather?city=Tokyo",
        format: "JSON (application/json)",
        status: "Sending Request",
      },
      visualState: {
        currentStepIndex: 0,
        activeMethod: "GET",
        activeEndpoint: "/api/weather?city=Tokyo",
        apiType: "public",
        packetState: "requesting",
      } satisfies ApiVisualState,
    },
    {
      narration:
        "Step 2: API Gateway receives the call, validates API keys/tokens, and routes the request to backend service.",
      activeLine: 6,
      state: {
        step: "2 of 4",
        requestMethod: "GET",
        endpoint: "/api/weather?city=Tokyo",
        format: "JSON (application/json)",
        status: "Authenticating & Routing",
      },
      visualState: {
        currentStepIndex: 1,
        activeMethod: "GET",
        activeEndpoint: "/api/weather?city=Tokyo",
        apiType: "public",
        packetState: "processing",
      } satisfies ApiVisualState,
    },
    {
      narration:
        "Step 3: Backend Weather Server queries database, processes weather updates, and formats data into JSON.",
      activeLine: 9,
      state: {
        step: "3 of 4",
        requestMethod: "GET",
        endpoint: "/api/weather?city=Tokyo",
        format: "JSON (application/json)",
        status: "Executing Query",
      },
      visualState: {
        currentStepIndex: 2,
        activeMethod: "GET",
        activeEndpoint: "/api/weather?city=Tokyo",
        apiType: "public",
        packetState: "processing",
      } satisfies ApiVisualState,
    },
    {
      narration:
        "Step 4: API returns HTTP 200 OK with weather JSON payload back to Travel Website client! ✓",
      activeLine: 12,
      state: {
        step: "4 of 4",
        requestMethod: "GET",
        endpoint: "/api/weather?city=Tokyo",
        format: "JSON (application/json)",
        status: "200 OK Response Delivered",
      },
      visualState: {
        currentStepIndex: 3,
        activeMethod: "GET",
        activeEndpoint: "/api/weather?city=Tokyo",
        apiType: "public",
        packetState: "responding",
      } satisfies ApiVisualState,
    },
  ],
};
