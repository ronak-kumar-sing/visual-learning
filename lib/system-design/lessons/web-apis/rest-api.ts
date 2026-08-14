import type { Lesson } from "@/lib/system-design/types";

export interface RestConstraintItem {
  id: string;
  name: string;
  badge: string;
  summary: string;
  benefit: string;
  rule: string;
}

export const REST_CONSTRAINTS: RestConstraintItem[] = [
  {
    id: "client-server",
    name: "1. Client-Server",
    badge: "Decoupling",
    summary: "Strict separation between user interface (client) and data storage/logic (server).",
    benefit: "Allows client and backend systems to evolve, scale, and be refactored independently.",
    rule: "Clients know nothing about DB storage; servers know nothing about UI components.",
  },
  {
    id: "stateless",
    name: "2. Statelessness",
    badge: "Scalability",
    summary: "Server never stores client session state between requests.",
    benefit: "Every request contains all required auth tokens & context. Simplifies load balancing.",
    rule: "Any server in a cluster can handle any request without session affinity.",
  },
  {
    id: "cacheable",
    name: "3. Cacheable",
    badge: "Performance",
    summary: "Responses must explicitly declare whether they can be cached by clients or CDNs.",
    benefit: "Eliminates redundant network roundtrips and lowers database server load.",
    rule: "Uses Cache-Control: max-age=3600, ETag headers.",
  },
  {
    id: "uniform-interface",
    name: "4. Uniform Interface",
    badge: "Standardization",
    summary: "Standardized URIs for resources and standard HTTP verbs for operations.",
    benefit: "Predictable API contracts for third-party consumers and seamless tooling.",
    rule: "Identify resources via URIs (/articles/42), manipulate via representations (JSON).",
  },
  {
    id: "layered-system",
    name: "5. Layered System",
    badge: "Security & Scale",
    summary: "Client cannot tell whether it is connected directly to end server or an intermediary.",
    benefit: "Enables seamless insertion of reverse proxies, API gateways, load balancers, and caches.",
    rule: "Intermediate proxies can inspect, cache, or load-balance without breaking client code.",
  },
  {
    id: "code-on-demand",
    name: "6. Code on Demand (Optional)",
    badge: "Extensibility",
    summary: "Servers can temporarily extend client functionality by transferring executable code.",
    benefit: "Allows rich client customization on the fly (e.g. JavaScript widgets).",
    rule: "Optional constraint; not required for pure data REST APIs.",
  },
];

export interface RestApiVisualState {
  currentStepIndex: number;
  activeMethod: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  activePath: string;
  statusCode: number;
  responseBody: string;
}

export const restApiLesson: Lesson = {
  pseudocode: [
    "// RESTful Resource Controller Architecture",
    "class ArticleController:",
    "  // GET /api/v1/articles/{id} (Read - Idempotent, Cacheable)",
    "  function getArticle(id):",
    "    article = db.find('articles', id)",
    "    if not article: return Response(404, { error: 'Not Found' })",
    "    return Response(200, article, { 'Cache-Control': 'max-age=300' })",
    "  ",
    "  // POST /api/v1/articles (Create - Non-Idempotent)",
    "  function createArticle(body):",
    "    newId = db.insert('articles', body)",
    "    return Response(201, { id: newId, ...body })",
    "  ",
    "  // PUT /api/v1/articles/{id} (Full Replace - Idempotent)",
    "  function replaceArticle(id, body):",
    "    db.replace('articles', id, body)",
    "    return Response(200, { id, ...body })",
    "  ",
    "  // DELETE /api/v1/articles/{id} (Delete - Idempotent)",
    "  function deleteArticle(id):",
    "    db.delete('articles', id)",
    "    return Response(204, null)",
  ],

  steps: [
    {
      narration:
        "Step 1: Client issues a GET request to /api/v1/articles/42 to retrieve a specific resource.",
      activeLine: 3,
      state: {
        method: "GET",
        endpoint: "/api/v1/articles/42",
        idempotent: "Yes",
        cacheable: "Yes",
        status: "200 OK",
      },
      visualState: {
        currentStepIndex: 0,
        activeMethod: "GET",
        activePath: "/api/v1/articles/42",
        statusCode: 200,
        responseBody: `{"id": 42, "title": "System Design REST", "author": "Alex"}`,
      } satisfies RestApiVisualState,
    },
    {
      narration:
        "Step 2: Client issues a POST request to /api/v1/articles to create a new resource.",
      activeLine: 9,
      state: {
        method: "POST",
        endpoint: "/api/v1/articles",
        idempotent: "No (creates new row every call)",
        cacheable: "No",
        status: "201 Created",
      },
      visualState: {
        currentStepIndex: 1,
        activeMethod: "POST",
        activePath: "/api/v1/articles",
        statusCode: 201,
        responseBody: `{"id": 43, "title": "Understanding GraphQL", "status": "published"}`,
      } satisfies RestApiVisualState,
    },
    {
      narration:
        "Step 3: Client issues a PUT request to /api/v1/articles/42 to replace the complete resource.",
      activeLine: 13,
      state: {
        method: "PUT",
        endpoint: "/api/v1/articles/42",
        idempotent: "Yes",
        cacheable: "No",
        status: "200 OK",
      },
      visualState: {
        currentStepIndex: 2,
        activeMethod: "PUT",
        activePath: "/api/v1/articles/42",
        statusCode: 200,
        responseBody: `{"id": 42, "title": "System Design REST (Updated)", "author": "Alex"}`,
      } satisfies RestApiVisualState,
    },
    {
      narration:
        "Step 4: Client issues a DELETE request to /api/v1/articles/42. Server deletes row and returns 204 No Content.",
      activeLine: 17,
      state: {
        method: "DELETE",
        endpoint: "/api/v1/articles/42",
        idempotent: "Yes",
        cacheable: "No",
        status: "204 No Content",
      },
      visualState: {
        currentStepIndex: 3,
        activeMethod: "DELETE",
        activePath: "/api/v1/articles/42",
        statusCode: 204,
        responseBody: `(No Content - Resource Deleted)`,
      } satisfies RestApiVisualState,
    },
  ],
};
