import type { Metadata } from "next";
import { GROUPS } from "@/lib/system-design/topics";
import { GroupCard } from "@/components/system-design/Cards";

export const metadata: Metadata = {
  title: "System Design Visualizer",
  description:
    "Learn system design through interactive step-by-step animated lessons covering 30 core concepts across 7 topics.",
};

const ICONS: Record<string, string> = {
  "networking-fundamentals": "🌐",
  "web-and-apis": "🔌",
  "scaling-foundations": "📈",
  "database-internals": "🗄️",
  "performance-and-consistency": "⚡",
  "realtime-and-architecture": "🔄",
  "reliability-and-traffic": "🛡️",
};

export default function SystemDesignPage() {
  const totalTopics = GROUPS.reduce((sum, g) => sum + g.topics.length, 0);

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--sd-bg)", color: "var(--sd-text)" }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="border-b" style={{ borderColor: "var(--sd-border)" }}>
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <p
            className="text-xs font-mono uppercase tracking-widest mb-4"
            style={{ color: "var(--sd-text-faint)" }}
          >
            Interactive Learning
          </p>

          <h1
            className="text-5xl md:text-6xl font-semibold tracking-tight mb-5 max-w-3xl"
            style={{ color: "var(--sd-text)" }}
          >
            System Design
            <br />
            <span style={{ color: "var(--sd-text-muted)" }}>Visualized.</span>
          </h1>

          <p
            className="text-lg max-w-xl leading-relaxed mb-8"
            style={{ color: "var(--sd-text-muted)" }}
          >
            {totalTopics} step-by-step animated lessons that explain how the
            internet&apos;s plumbing actually works — from IP addresses to
            distributed consensus.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8">
            {[
              { label: "Topics", value: String(totalTopics) },
              { label: "Groups", value: String(GROUPS.length) },
              { label: "Difficulty range", value: "Core → Advanced" },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  className="text-2xl font-semibold"
                  style={{ color: "var(--sd-text)" }}
                >
                  {stat.value}
                </p>
                <p className="text-sm" style={{ color: "var(--sd-text-muted)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Group grid ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <h2
          className="text-xs font-mono uppercase tracking-widest mb-8"
          style={{ color: "var(--sd-text-faint)" }}
        >
          All Groups
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GROUPS.map((group, i) => (
            <GroupCard key={group.slug} group={group} index={i} icons={ICONS} />
          ))}
        </div>
      </div>
    </main>
  );
}
