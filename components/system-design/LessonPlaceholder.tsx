"use client";

import Link from "next/link";
import type { Topic, Group } from "@/lib/system-design/topics";

interface LessonPlaceholderProps {
  topic: Topic;
  group: Group;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  core: "Core",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function LessonPlaceholder({
  topic,
  group,
}: LessonPlaceholderProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
      style={{ backgroundColor: "var(--sd-bg)" }}
    >
      {/* Back breadcrumb */}
      <div className="w-full max-w-2xl mb-10">
        <Link
          href={`/system-design/${group.slug}`}
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: "var(--sd-text-muted)" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 3L5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {group.title}
        </Link>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-2xl rounded-2xl p-10 border"
        style={{
          backgroundColor: "var(--sd-surface)",
          borderColor: group.accentHex + "33",
        }}
      >
        {/* Group + difficulty badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: group.accentHex + "18",
              color: group.accentHex,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: group.accentHex }}
            />
            {group.title}
          </span>
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: "var(--sd-surface-2)",
              color:
                topic.difficulty === "core"
                  ? "var(--sd-core)"
                  : topic.difficulty === "intermediate"
                    ? "var(--sd-intermediate)"
                    : "var(--sd-advanced)",
            }}
          >
            {DIFFICULTY_LABELS[topic.difficulty]}
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-4xl font-semibold tracking-tight mb-4"
          style={{ color: "var(--sd-text)" }}
        >
          {topic.title}
        </h1>

        {/* One-liner */}
        <p
          className="text-lg leading-relaxed mb-10"
          style={{ color: "var(--sd-text-muted)" }}
        >
          {topic.oneLiner}
        </p>

        {/* Coming soon notice */}
        <div
          className="rounded-xl border p-6 flex items-start gap-4"
          style={{
            backgroundColor: "var(--sd-surface-2)",
            borderColor: "var(--sd-border)",
          }}
        >
          {/* Animated construction icon */}
          <div
            className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: group.accentHex + "18" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={group.accentHex}
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: "var(--sd-text)" }}
            >
              Lesson under construction
            </p>
            <p className="text-sm" style={{ color: "var(--sd-text-muted)" }}>
              The interactive step-player and animated visualisation for this
              topic will be wired up in a later phase. Check back soon.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative glow behind card */}
      <div
        className="pointer-events-none absolute rounded-full blur-3xl opacity-[0.06] w-96 h-96 -z-10"
        style={{ backgroundColor: group.accentHex }}
        aria-hidden="true"
      />
    </div>
  );
}
