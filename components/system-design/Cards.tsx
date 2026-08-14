"use client";

import Link from "next/link";
import type { Group, Topic } from "@/lib/system-design/topics";

interface TopicCardProps {
  topic: Topic;
  group: Group;
  index: number;
}

export function TopicCard({ topic, group, index }: TopicCardProps) {
  const DIFFICULTY_LABELS = {
    core: "Core",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };

  return (
    <Link
      href={`/system-design/${group.slug}/${topic.slug}`}
      id={`topic-card-${topic.slug}`}
      className="group relative flex items-center gap-5 rounded-xl border p-5 transition-all duration-200 hover:scale-[1.005] focus-visible:outline-none focus-visible:ring-2"
      style={{
        backgroundColor: "var(--sd-surface)",
        borderColor: "var(--sd-border)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          group.accentHex + "44";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--sd-border)";
      }}
    >
      {/* Index */}
      <span
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-medium"
        style={{
          backgroundColor: group.accentHex + "14",
          color: group.accentHex,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-medium mb-0.5" style={{ color: "var(--sd-text)" }}>
          {topic.title}
        </p>
        <p
          className="text-sm truncate"
          style={{ color: "var(--sd-text-muted)" }}
        >
          {topic.oneLiner}
        </p>
      </div>

      {/* Difficulty badge */}
      <span
        className="flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium hidden sm:inline-flex"
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

      {/* Arrow */}
      <svg
        className="flex-shrink-0 opacity-30 transition-opacity duration-150 group-hover:opacity-80"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        style={{ color: group.accentHex }}
        aria-hidden="true"
      >
        <path
          d="M3.5 8h9M9 4.5l3.5 3.5L9 11.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

interface GroupCardProps {
  group: Group;
  index: number;
  icons: Record<string, string>;
}

export function GroupCard({ group, index, icons }: GroupCardProps) {
  return (
    <Link
      key={group.slug}
      href={`/system-design/${group.slug}`}
      id={`group-card-${group.slug}`}
      className="group relative rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-200 hover:scale-[1.015] focus-visible:outline-none focus-visible:ring-2"
      style={{
        backgroundColor: "var(--sd-surface)",
        borderColor: "var(--sd-border)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          group.accentHex + "55";
        const glow = e.currentTarget.querySelector(
          ".card-glow"
        ) as HTMLElement | null;
        if (glow) glow.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--sd-border)";
        const glow = e.currentTarget.querySelector(
          ".card-glow"
        ) as HTMLElement | null;
        if (glow) glow.style.opacity = "0";
      }}
    >
      {/* Glow layer */}
      <div
        className="card-glow pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${group.accentHex}10 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Icon + number */}
      <div className="flex items-start justify-between">
        <span
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: group.accentHex + "18" }}
          aria-hidden="true"
        >
          {icons[group.slug] ?? "📦"}
        </span>
        <span
          className="text-xs font-mono tabular-nums"
          style={{ color: "var(--sd-text-faint)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Title */}
      <div className="flex-1">
        <h3
          className="text-lg font-medium mb-1"
          style={{ color: "var(--sd-text)" }}
        >
          {group.title}
        </h3>
        <p className="text-sm" style={{ color: "var(--sd-text-muted)" }}>
          {group.topics.length} topic{group.topics.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Topic pills */}
      <div className="flex flex-wrap gap-1.5 mt-1">
        {group.topics.map((t) => (
          <span
            key={t.slug}
            className="rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{
              backgroundColor: group.accentHex + "14",
              color: group.accentHex,
            }}
          >
            {t.title}
          </span>
        ))}
      </div>

      {/* Arrow */}
      <div
        className="mt-1 self-end flex items-center gap-1 text-xs transition-transform duration-150 group-hover:translate-x-0.5"
        style={{ color: group.accentHex }}
      >
        Explore
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 7h8M7.5 4l3 3-3 3"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
}
