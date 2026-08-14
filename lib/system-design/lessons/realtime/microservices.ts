import type { Lesson } from "@/lib/system-design/types";

export interface MicroserviceNodeItem {
  id: string;
  name: string;
  badge: string;
  dbType: string;
  role: string;
}

export const MICROSERVICE_NODES: MicroserviceNodeItem[] = [
  { id: "auth", name: "Auth Service", badge: "Port 8001", dbType: "Redis (Sessions)", role: "JWT Verification & RBAC" },
  { id: "order", name: "Order Service", badge: "Port 8002", dbType: "PostgreSQL (Orders)", role: "Order Lifecycle & State" },
  { id: "payment", name: "Payment Service", badge: "Port 8003", dbType: "Stripe API + Ledgers", role: "Credit Card & Invoicing" },
  { id: "inventory", name: "Inventory Service", badge: "Port 8004", dbType: "DynamoDB (Stock)", role: "Stock Reservation & SKUs" },
];

export interface MicroservicesVisualState {
  currentStepIndex: number;
  activeServiceId: string;
  sagaStatus: "in-flight" | "success" | "compensating-refund";
}

export const microservicesLesson: Lesson = {
  pseudocode: [
    "// Microservices Distributed Order Orchestration (Saga Pattern)",
    "async function orchestrateOrder(orderPayload):",
    "  // 1. API Gateway authenticates user token",
    "  const user = await authClient.verifyJwt(orderPayload.token);",
    "  ",
    "  // 2. Order Service creates initial PENDING order",
    "  const order = await orderService.createOrder(user.id, orderPayload.items);",
    "  ",
    "  // 3. Payment Service charges customer card",
    "  const payment = await paymentService.charge(user.id, order.total);",
    "  ",
    "  // 4. If Inventory reservation fails ➔ Execute Saga Compensating Refund!",
    "  try {",
    "    await inventoryService.reserveStock(orderPayload.items);",
    "    await orderService.markPaid(order.id);",
    "  } catch (err) {",
    "    await paymentService.refund(payment.id); // Saga Compensation",
    "    await orderService.markFailed(order.id, 'OUT_OF_STOCK');",
    "  }",
  ],

  steps: [
    {
      narration:
        "Step 1: Client Request at API Gateway. Client issues POST /orders. The API Gateway routes the request, verifies the JWT with Auth Service, and applies rate limits.",
      activeLine: 3,
      state: {
        entryPoint: "API Gateway (Kong / Envoy)",
        routingTarget: "Auth Service (Port 8001)",
        authentication: "JWT Validated ✓",
        blastRadius: "Isolated to Service Pods",
      },
      visualState: {
        currentStepIndex: 0,
        activeServiceId: "auth",
        sagaStatus: "in-flight",
      } satisfies MicroservicesVisualState,
    },
    {
      narration:
        "Step 2: Database-per-Service Isolation. Order Service writes to its dedicated PostgreSQL DB, while Payment Service communicates with Stripe and logs ledgers independently.",
      activeLine: 6,
      state: {
        architecture: "Database-Per-Service Pattern",
        orderDB: "PostgreSQL (Isolated Schema)",
        paymentService: "Stripe API + Ledgers",
        coupling: "Zero Shared DB Tables (Loose Coupling)",
      },
      visualState: {
        currentStepIndex: 1,
        activeServiceId: "order",
        sagaStatus: "in-flight",
      } satisfies MicroservicesVisualState,
    },
    {
      narration:
        "Step 3: Saga Pattern & Compensating Transactions. If Inventory runs out of stock, the orchestrator triggers a compensating refund transaction to maintain eventual consistency.",
      activeLine: 14,
      state: {
        transactionModel: "Distributed Saga (Choreography / Orchestration)",
        failureReason: "Inventory Out of Stock",
        compensatingAction: "Payment Refund Executed ($149 refunded)",
        finalConsistency: "Consistent without 2-Phase Commit (2PC)",
      },
      visualState: {
        currentStepIndex: 2,
        activeServiceId: "inventory",
        sagaStatus: "compensating-refund",
      } satisfies MicroservicesVisualState,
    },
  ],
};
