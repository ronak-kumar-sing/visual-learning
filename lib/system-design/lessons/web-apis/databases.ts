import type { Lesson } from "@/lib/system-design/types";

export interface AcidPropertyItem {
  letter: "A" | "C" | "I" | "D";
  title: string;
  badge: string;
  summary: string;
  example: string;
}

export const ACID_PROPERTIES: AcidPropertyItem[] = [
  {
    letter: "A",
    title: "Atomicity",
    badge: "All or Nothing",
    summary: "A transaction is treated as a single indivisible unit. Either ALL operations succeed, or the entire transaction is rolled back.",
    example: "If money is deducted from Account A but system crashes before crediting Account B, the entire transaction rolls back to initial state.",
  },
  {
    letter: "C",
    title: "Consistency",
    badge: "Valid States",
    summary: "Guarantees that a transaction moves the database from one valid state to another, upholding all constraints, cascades, and schema rules.",
    example: "Total account balance across both accounts remains identical ($1000 total before = $1000 total after).",
  },
  {
    letter: "I",
    title: "Isolation",
    badge: "Concurrent Safety",
    summary: "Concurrent transactions execute independently without interfering with each other's intermediate uncommitted states.",
    example: "Other queries cannot read Account A balance while transfer is in-flight (avoids dirty reads).",
  },
  {
    letter: "D",
    title: "Durability",
    badge: "Crash Proof",
    summary: "Once a transaction is committed, its changes are permanently written to non-volatile storage (WAL/Disk) and will survive server crashes or power outages.",
    example: "Write-Ahead Log (WAL) ensures committed balances survive sudden power failure.",
  },
];

export interface DatabasesVisualState {
  currentStepIndex: number;
  transactionStatus: "idle" | "in-flight" | "committed" | "rolled-back";
  accountA: number;
  accountB: number;
  transferAmount: number;
}

export const databasesLesson: Lesson = {
  pseudocode: [
    "// ACID Compliant Bank Transfer Transaction",
    "function transferMoney(fromAcc, toAcc, amount):",
    "  BEGIN TRANSACTION;",
    "  try:",
    "    // 1. Deduct funds from sender",
    "    accA = db.query('SELECT balance FROM accounts WHERE id = ? FOR UPDATE', fromAcc)",
    "    if accA.balance < amount: raise InsufficientFunds()",
    "    db.execute('UPDATE accounts SET balance = balance - ? WHERE id = ?', amount, fromAcc)",
    "    ",
    "    // 2. Credit funds to receiver",
    "    db.execute('UPDATE accounts SET balance = balance + ? WHERE id = ?', amount, toAcc)",
    "    ",
    "    // 3. Commit atomically to Write-Ahead Log (WAL)",
    "    COMMIT;",
    "  catch error:",
    "    // Atomic rollback to pristine state on any failure",
    "    ROLLBACK;",
  ],

  steps: [
    {
      narration:
        "Step 1: Initial Database State. Account A has $500, Account B has $500. Total system balance is $1000.",
      activeLine: 3,
      state: {
        step: "1 of 4",
        accountA: "$500",
        accountB: "$500",
        totalBalance: "$1000",
        transactionState: "Idle",
      },
      visualState: {
        currentStepIndex: 0,
        transactionStatus: "idle",
        accountA: 500,
        accountB: 500,
        transferAmount: 100,
      } satisfies DatabasesVisualState,
    },
    {
      narration:
        "Step 2: BEGIN TRANSACTION. Deduct $100 from Account A under Isolation row locks.",
      activeLine: 7,
      state: {
        step: "2 of 4",
        accountA: "$400 (Pending)",
        accountB: "$500",
        totalBalance: "In-Flight Transaction",
        transactionState: "Row Locked (Isolation)",
      },
      visualState: {
        currentStepIndex: 1,
        transactionStatus: "in-flight",
        accountA: 400,
        accountB: 500,
        transferAmount: 100,
      } satisfies DatabasesVisualState,
    },
    {
      narration:
        "Step 3: Credit $100 to Account B. Consistency check verifies non-negative balances.",
      activeLine: 10,
      state: {
        step: "3 of 4",
        accountA: "$400 (Pending)",
        accountB: "$600 (Pending)",
        totalBalance: "$1000 (Consistent)",
        transactionState: "Writing to WAL Buffer",
      },
      visualState: {
        currentStepIndex: 2,
        transactionStatus: "in-flight",
        accountA: 400,
        accountB: 600,
        transferAmount: 100,
      } satisfies DatabasesVisualState,
    },
    {
      narration:
        "Step 4: COMMIT! Atomicity & Durability guarantee changes are flushed to Write-Ahead Log (WAL) permanently.",
      activeLine: 13,
      state: {
        step: "4 of 4",
        accountA: "$400 (Committed)",
        accountB: "$600 (Committed)",
        totalBalance: "$1000",
        transactionState: "Committed & Durable ✓",
      },
      visualState: {
        currentStepIndex: 3,
        transactionStatus: "committed",
        accountA: 400,
        accountB: 600,
        transferAmount: 100,
      } satisfies DatabasesVisualState,
    },
  ],
};
