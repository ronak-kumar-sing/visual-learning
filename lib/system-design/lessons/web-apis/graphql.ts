import type { Lesson } from "@/lib/system-design/types";

export interface GraphqlFieldItem {
  id: string;
  name: string;
  type: string;
  description: string;
  sampleValue: string | number | boolean;
}

export const USER_SCHEMA_FIELDS: GraphqlFieldItem[] = [
  { id: "id", name: "id", type: "ID!", description: "Unique User Identifier", sampleValue: 101 },
  { id: "name", name: "name", type: "String!", description: "Full Name", sampleValue: "Sarah Connor" },
  { id: "email", name: "email", type: "String", description: "Email address", sampleValue: "sarah@cyberdyne.com" },
  { id: "role", name: "role", type: "String", description: "System Role", sampleValue: "admin" },
  { id: "postsCount", name: "postsCount", type: "Int", description: "Total published articles", sampleValue: 24 },
  { id: "location", name: "location", type: "String", description: "City / Country", sampleValue: "San Francisco, CA" },
];

export interface GraphqlVisualState {
  currentStepIndex: number;
  selectedFields: string[];
  operationType: "query" | "mutation" | "subscription";
  payloadMode: "graphql" | "rest-overfetch" | "rest-underfetch";
}

export const graphqlLesson: Lesson = {
  pseudocode: [
    "// GraphQL Schema & Resolver Execution Engine",
    "type Query {",
    "  user(id: ID!): User",
    "}",
    "type User {",
    "  id: ID!",
    "  name: String!",
    "  email: String",
    "  posts: [Post]",
    "}",
    "// Resolver parses client query AST and returns exact requested fields",
    "function resolveGraphQLQuery(requestAST):",
    "  userData = db.users.findById(requestAST.args.id)",
    "  // Prune unrequested fields - zero over-fetching!",
    "  return filterFields(userData, requestAST.requestedFields)",
  ],

  steps: [
    {
      narration:
        "Step 1: Client constructs a GraphQL query requesting ONLY 'id' and 'name' fields over POST /graphql.",
      activeLine: 2,
      state: {
        operation: "Query (Read)",
        endpoint: "POST /graphql",
        requestedFields: "id, name",
        payloadEfficiency: "100% (Zero Over-fetching)",
      },
      visualState: {
        currentStepIndex: 0,
        selectedFields: ["id", "name"],
        operationType: "query",
        payloadMode: "graphql",
      } satisfies GraphqlVisualState,
    },
    {
      narration:
        "Step 2: GraphQL Engine parses query AST, resolves User record from DB, and extracts nested posts in a single roundtrip.",
      activeLine: 11,
      state: {
        operation: "Query (Nested Join)",
        endpoint: "POST /graphql",
        requestedFields: "id, name, email, postsCount",
        payloadEfficiency: "Single Network Roundtrip (Zero Under-fetching)",
      },
      visualState: {
        currentStepIndex: 1,
        selectedFields: ["id", "name", "email", "postsCount"],
        operationType: "query",
        payloadMode: "graphql",
      } satisfies GraphqlVisualState,
    },
    {
      narration:
        "Step 3: Mutation operation updates user profile and returns the modified fields in a single atomic response.",
      activeLine: 13,
      state: {
        operation: "Mutation (Write)",
        endpoint: "POST /graphql",
        requestedFields: "mutation updateUser(id: 101, name: 'Sarah C.')",
        payloadEfficiency: "Atomic Write & Read in One Request",
      },
      visualState: {
        currentStepIndex: 2,
        selectedFields: ["id", "name", "role"],
        operationType: "mutation",
        payloadMode: "graphql",
      } satisfies GraphqlVisualState,
    },
  ],
};
