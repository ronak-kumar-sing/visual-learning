export type Difficulty = "core" | "intermediate" | "advanced";

export type Topic = {
  slug: string;
  group: string;
  title: string;
  oneLiner: string;
  difficulty: Difficulty;
};

export type Group = {
  slug: string;
  title: string;
  accent: string;        // Tailwind color name, e.g. "amber"
  accentHex: string;     // for inline SVG / canvas
  accentClass: string;   // Tailwind text class
  borderClass: string;   // Tailwind border class
  bgClass: string;       // Tailwind bg (at low opacity, for glows)
  topics: Topic[];
};

export const TOPICS: Topic[] = [
  // ── Group 1: Networking Fundamentals ──────────────────────────────────────
  {
    slug: "client-server-architecture",
    group: "networking-fundamentals",
    title: "Client-Server Architecture",
    oneLiner: "How your browser talks to a server — the fundamental request/response loop.",
    difficulty: "core",
  },
  {
    slug: "ip-address",
    group: "networking-fundamentals",
    title: "IP Address",
    oneLiner: "How every device on a network gets a unique numerical address.",
    difficulty: "core",
  },
  {
    slug: "dns",
    group: "networking-fundamentals",
    title: "DNS",
    oneLiner: "The phone book of the internet — turning domain names into IP addresses.",
    difficulty: "core",
  },
  {
    slug: "proxy-reverse-proxy",
    group: "networking-fundamentals",
    title: "Proxy & Reverse Proxy",
    oneLiner: "Intermediaries that hide identities, route traffic, and terminate TLS.",
    difficulty: "intermediate",
  },
  {
    slug: "latency",
    group: "networking-fundamentals",
    title: "Latency",
    oneLiner: "Why distance costs time — the physics of network round-trips.",
    difficulty: "core",
  },

  // ── Group 2: Web & APIs ───────────────────────────────────────────────────
  {
    slug: "http-https",
    group: "web-and-apis",
    title: "HTTP / HTTPS",
    oneLiner: "The protocol everything on the web speaks — and why encryption matters.",
    difficulty: "core",
  },
  {
    slug: "apis",
    group: "web-and-apis",
    title: "APIs",
    oneLiner: "A contract for how two programs ask each other for things.",
    difficulty: "core",
  },
  {
    slug: "rest-api",
    group: "web-and-apis",
    title: "REST API",
    oneLiner: "Using HTTP verbs as CRUD operations on named resources.",
    difficulty: "core",
  },
  {
    slug: "graphql",
    group: "web-and-apis",
    title: "GraphQL",
    oneLiner: "Ask for exactly the fields you need — no more, no less.",
    difficulty: "intermediate",
  },
  {
    slug: "databases",
    group: "web-and-apis",
    title: "Databases",
    oneLiner: "Durable, queryable storage — why a variable isn't enough.",
    difficulty: "core",
  },

  // ── Group 3: Scaling Foundations ─────────────────────────────────────────
  {
    slug: "sql-vs-nosql",
    group: "scaling-foundations",
    title: "SQL vs NoSQL",
    oneLiner: "Structured joins vs flexible documents — a trade-off, not a winner.",
    difficulty: "core",
  },
  {
    slug: "vertical-scaling",
    group: "scaling-foundations",
    title: "Vertical Scaling",
    oneLiner: "Adding more CPU/RAM to one machine — simple, but limited.",
    difficulty: "core",
  },
  {
    slug: "horizontal-scaling",
    group: "scaling-foundations",
    title: "Horizontal Scaling",
    oneLiner: "Adding more machines — near-infinite scale, new coordination problems.",
    difficulty: "intermediate",
  },
  {
    slug: "load-balancers",
    group: "scaling-foundations",
    title: "Load Balancers",
    oneLiner: "Spreading traffic across servers, routing around failures automatically.",
    difficulty: "intermediate",
  },

  // ── Group 4: Database Internals ───────────────────────────────────────────
  {
    slug: "indexing",
    group: "database-internals",
    title: "Indexing",
    oneLiner: "Trading write speed for O(log n) reads — when to index and when not to.",
    difficulty: "intermediate",
  },
  {
    slug: "replication",
    group: "database-internals",
    title: "Replication",
    oneLiner: "Copying data to multiple nodes for availability and read scale.",
    difficulty: "intermediate",
  },
  {
    slug: "sharding",
    group: "database-internals",
    title: "Sharding",
    oneLiner: "Splitting data across machines horizontally to scale writes.",
    difficulty: "advanced",
  },
  {
    slug: "vertical-partitioning",
    group: "database-internals",
    title: "Vertical Partitioning",
    oneLiner: "Splitting a table by columns to separate hot and cold data.",
    difficulty: "advanced",
  },

  // ── Group 5: Performance & Consistency ───────────────────────────────────
  {
    slug: "caching",
    group: "performance-and-consistency",
    title: "Caching",
    oneLiner: "Storing results close to the reader so the DB is rarely hit.",
    difficulty: "intermediate",
  },
  {
    slug: "denormalization",
    group: "performance-and-consistency",
    title: "Denormalization",
    oneLiner: "Duplicating data to avoid expensive joins — faster reads, costlier writes.",
    difficulty: "intermediate",
  },
  {
    slug: "cap-theorem",
    group: "performance-and-consistency",
    title: "CAP Theorem",
    oneLiner: "During a network partition you must choose: consistency or availability.",
    difficulty: "advanced",
  },
  {
    slug: "blob-storage",
    group: "performance-and-consistency",
    title: "Blob Storage",
    oneLiner: "Where your images, videos, and files actually live — not in the DB.",
    difficulty: "intermediate",
  },

  // ── Group 6: Real-Time & Architecture ────────────────────────────────────
  {
    slug: "cdn",
    group: "realtime-and-architecture",
    title: "CDN",
    oneLiner: "Caching content at the edge, closer to your users around the world.",
    difficulty: "intermediate",
  },
  {
    slug: "websockets",
    group: "realtime-and-architecture",
    title: "WebSockets",
    oneLiner: "A persistent connection so the server can push — no more polling.",
    difficulty: "intermediate",
  },
  {
    slug: "webhooks",
    group: "realtime-and-architecture",
    title: "Webhooks",
    oneLiner: "Flipping the direction — third-party notifies you instead of you polling.",
    difficulty: "intermediate",
  },
  {
    slug: "microservices",
    group: "realtime-and-architecture",
    title: "Microservices",
    oneLiner: "Breaking a monolith into isolated services — deploy and fail independently.",
    difficulty: "advanced",
  },

  // ── Group 7: Reliability & Traffic ───────────────────────────────────────
  {
    slug: "message-queues",
    group: "reliability-and-traffic",
    title: "Message Queues",
    oneLiner: "Decoupling producer speed from consumer speed with a durable buffer.",
    difficulty: "intermediate",
  },
  {
    slug: "rate-limiting",
    group: "reliability-and-traffic",
    title: "Rate Limiting",
    oneLiner: "Protecting your backend from being overwhelmed — by bugs or attackers.",
    difficulty: "intermediate",
  },
  {
    slug: "api-gateways",
    group: "reliability-and-traffic",
    title: "API Gateways",
    oneLiner: "A single entry point that handles auth, routing, and rate limits centrally.",
    difficulty: "advanced",
  },
  {
    slug: "idempotency",
    group: "reliability-and-traffic",
    title: "Idempotency",
    oneLiner: "Safe retries — the same request twice should never cause a double charge.",
    difficulty: "advanced",
  },
];

export const GROUPS: Group[] = [
  {
    slug: "networking-fundamentals",
    title: "Networking Fundamentals",
    accent: "amber",
    accentHex: "#fbbf24",
    accentClass: "text-amber-400",
    borderClass: "border-amber-400/40",
    bgClass: "bg-amber-400/10",
    topics: TOPICS.filter((t) => t.group === "networking-fundamentals"),
  },
  {
    slug: "web-and-apis",
    title: "Web & APIs",
    accent: "teal",
    accentHex: "#2dd4bf",
    accentClass: "text-teal-400",
    borderClass: "border-teal-400/40",
    bgClass: "bg-teal-400/10",
    topics: TOPICS.filter((t) => t.group === "web-and-apis"),
  },
  {
    slug: "scaling-foundations",
    title: "Scaling Foundations",
    accent: "blue",
    accentHex: "#60a5fa",
    accentClass: "text-blue-400",
    borderClass: "border-blue-400/40",
    bgClass: "bg-blue-400/10",
    topics: TOPICS.filter((t) => t.group === "scaling-foundations"),
  },
  {
    slug: "database-internals",
    title: "Database Internals",
    accent: "orange",
    accentHex: "#fb923c",
    accentClass: "text-orange-400",
    borderClass: "border-orange-400/40",
    bgClass: "bg-orange-400/10",
    topics: TOPICS.filter((t) => t.group === "database-internals"),
  },
  {
    slug: "performance-and-consistency",
    title: "Performance & Consistency",
    accent: "pink",
    accentHex: "#f472b6",
    accentClass: "text-pink-400",
    borderClass: "border-pink-400/40",
    bgClass: "bg-pink-400/10",
    topics: TOPICS.filter((t) => t.group === "performance-and-consistency"),
  },
  {
    slug: "realtime-and-architecture",
    title: "Real-Time & Architecture",
    accent: "green",
    accentHex: "#4ade80",
    accentClass: "text-green-400",
    borderClass: "border-green-400/40",
    bgClass: "bg-green-400/10",
    topics: TOPICS.filter((t) => t.group === "realtime-and-architecture"),
  },
  {
    slug: "reliability-and-traffic",
    title: "Reliability & Traffic",
    accent: "yellow",
    accentHex: "#facc15",
    accentClass: "text-yellow-400",
    borderClass: "border-yellow-400/40",
    bgClass: "bg-yellow-400/10",
    topics: TOPICS.filter((t) => t.group === "reliability-and-traffic"),
  },
];

/** Flat lookup helpers */
export function getGroup(slug: string): Group | undefined {
  return GROUPS.find((g) => g.slug === slug);
}

export function getTopic(group: string, slug: string): Topic | undefined {
  return TOPICS.find((t) => t.group === group && t.slug === slug);
}

export function getTopicsForGroup(groupSlug: string): Topic[] {
  return TOPICS.filter((t) => t.group === groupSlug);
}

/** Ordered flat list for prev/next navigation across all 30 topics */
export const TOPICS_ORDERED: Topic[] = GROUPS.flatMap((g) => g.topics);

export function getAdjacentTopics(group: string, slug: string) {
  const idx = TOPICS_ORDERED.findIndex(
    (t) => t.group === group && t.slug === slug
  );
  return {
    prev: idx > 0 ? TOPICS_ORDERED[idx - 1] : null,
    next: idx < TOPICS_ORDERED.length - 1 ? TOPICS_ORDERED[idx + 1] : null,
  };
}
