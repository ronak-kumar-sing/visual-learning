import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GROUPS, getGroup } from "@/lib/system-design/topics";
import { TopicCard } from "@/components/system-design/Cards";

export function generateStaticParams() {
  return GROUPS.map((g) => ({ group: g.slug }));
}

export async function generateMetadata(
  props: PageProps<"/system-design/[group]">
): Promise<Metadata> {
  const { group: groupSlug } = await props.params;
  const group = getGroup(groupSlug);
  if (!group) return {};
  return {
    title: `${group.title} — System Design Visualizer`,
    description: `Interactive animated lessons covering ${group.topics.length} topics in ${group.title}.`,
  };
}

export default async function GroupPage(
  props: PageProps<"/system-design/[group]">
) {
  const { group: groupSlug } = await props.params;
  const group = getGroup(groupSlug);
  if (!group) notFound();

  const allGroups = GROUPS;
  const currentIdx = allGroups.findIndex((g) => g.slug === groupSlug);
  const prevGroup = currentIdx > 0 ? allGroups[currentIdx - 1] : null;
  const nextGroup =
    currentIdx < allGroups.length - 1 ? allGroups[currentIdx + 1] : null;

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--sd-bg)", color: "var(--sd-text)" }}
    >
      {/* ── Top nav ─────────────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-10 border-b backdrop-blur-md"
        style={{
          backgroundColor: "color-mix(in srgb, var(--sd-bg) 85%, transparent)",
          borderColor: "var(--sd-border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link
            href="/system-design"
            className="text-sm transition-colors hover:text-white"
            style={{ color: "var(--sd-text-muted)" }}
          >
            System Design
          </Link>
          <span style={{ color: "var(--sd-text-faint)" }}>/</span>
          <span
            className="text-sm font-medium"
            style={{ color: "var(--sd-text)" }}
          >
            {group.title}
          </span>
        </div>
      </div>

      {/* ── Group header ────────────────────────────────────────────────────── */}
      <div className="border-b" style={{ borderColor: "var(--sd-border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="flex items-center gap-3 mb-5">
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
              Group {currentIdx + 1} of {allGroups.length}
            </span>
          </div>

          <h1
            className="text-4xl md:text-5xl font-semibold tracking-tight mb-4"
            style={{ color: "var(--sd-text)" }}
          >
            {group.title}
          </h1>
          <p className="text-lg" style={{ color: "var(--sd-text-muted)" }}>
            {group.topics.length} interactive lesson
            {group.topics.length !== 1 ? "s" : ""} · step-by-step animated
          </p>
        </div>
      </div>

      {/* ── Topic list ──────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2
          className="text-xs font-mono uppercase tracking-widest mb-8"
          style={{ color: "var(--sd-text-faint)" }}
        >
          Topics in this group
        </h2>

        <div className="flex flex-col gap-3">
          {group.topics.map((topic, idx) => (
            <TopicCard
              key={topic.slug}
              topic={topic}
              group={group}
              index={idx}
            />
          ))}
        </div>
      </div>

      {/* ── Group prev/next ─────────────────────────────────────────────────── */}
      {(prevGroup || nextGroup) && (
        <div className="max-w-6xl mx-auto px-6 pb-16 flex flex-col sm:flex-row gap-4">
          {prevGroup && (
            <Link
              href={`/system-design/${prevGroup.slug}`}
              className="flex-1 flex items-center gap-3 rounded-xl border p-4 transition-colors hover:border-white/20"
              style={{
                backgroundColor: "var(--sd-surface)",
                borderColor: "var(--sd-border)",
              }}
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
                  style={{ color: "var(--sd-text-muted)" }}
                />
              </svg>
              <div>
                <p className="text-xs" style={{ color: "var(--sd-text-faint)" }}>
                  Previous group
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--sd-text)" }}
                >
                  {prevGroup.title}
                </p>
              </div>
            </Link>
          )}
          {nextGroup && (
            <Link
              href={`/system-design/${nextGroup.slug}`}
              className="flex-1 flex items-center justify-end gap-3 rounded-xl border p-4 transition-colors hover:border-white/20"
              style={{
                backgroundColor: "var(--sd-surface)",
                borderColor: "var(--sd-border)",
              }}
            >
              <div className="text-right">
                <p className="text-xs" style={{ color: "var(--sd-text-faint)" }}>
                  Next group
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--sd-text)" }}
                >
                  {nextGroup.title}
                </p>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "var(--sd-text-muted)" }}
                />
              </svg>
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
