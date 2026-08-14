"use client";

import Link from "next/link";
import { useState, useCallback, useEffect, type ReactNode } from "react";
import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import { useStepPlayer } from "@/hooks/useStepPlayer";
import PseudocodePanel from "./PseudocodePanel";
import StatePanel from "./StatePanel";
import NarrationBar from "./NarrationBar";
import StepControls from "./StepControls";

interface InterviewPrepItem {
  question: string;
  answer: string;
}

interface LessonShellProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
  definition?: string;
  interviewPrep?: InterviewPrepItem[];
  callout: ReactNode;
  visual: (step: LessonStep, stepIndex: number) => ReactNode;
}

const DIFFICULTY_LABELS = {
  core: "Core",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function LessonShell({
  topic,
  group,
  lesson,
  definition,
  interviewPrep,
  callout,
  visual,
}: LessonShellProps) {
  const player = useStepPlayer(lesson.steps.length);
  const step = lesson.steps[player.currentStep];

  // Tab selection for Left Sidebar
  const [activeTab, setActiveTab] = useState<"overview" | "definition" | "interview">("overview");

  // Resizable sidebar states (pixels) - expanded bounds up to 800px / 900px
  const [leftWidth, setLeftWidth] = useState(320);
  const [rightWidth, setRightWidth] = useState(360);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  const startResizingLeft = useCallback(() => setIsResizingLeft(true), []);
  const startResizingRight = useCallback(() => setIsResizingRight(true), []);

  useEffect(() => {
    if (!isResizingLeft && !isResizingRight) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft) {
        setLeftWidth(Math.max(220, Math.min(e.clientX, 800)));
      }
      if (isResizingRight) {
        const newRight = window.innerWidth - e.clientX;
        setRightWidth(Math.max(260, Math.min(newRight, 900)));
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight]);

  return (
    <div
      className="flex flex-col h-screen overflow-hidden select-none"
      style={{ backgroundColor: "var(--sd-bg)", color: "var(--sd-text)" }}
    >
      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <header
        className="flex-shrink-0 flex items-center gap-3 px-5 py-2.5 border-b z-20"
        style={{
          backgroundColor: "var(--sd-surface)",
          borderColor: "var(--sd-border)",
        }}
      >
        <Link
          href={`/system-design/${group.slug}`}
          className="text-xs transition-colors hover:text-white flex items-center gap-1.5"
          style={{ color: "var(--sd-text-muted)" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M7.5 2L3 6l4.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {group.title}
        </Link>
        <span style={{ color: "var(--sd-text-faint)" }}>/</span>
        <span className="text-xs font-medium" style={{ color: "var(--sd-text)" }}>
          {topic.title}
        </span>

        <div className="ml-auto flex items-center gap-2">
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
            style={{
              backgroundColor: group.accentHex + "18",
              color: group.accentHex,
            }}
          >
            {group.title}
          </span>
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
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
      </header>

      {/* ── Main 3-column area ────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">

        {/* Left Sidebar */}
        <aside
          className="hidden lg:flex flex-col flex-shrink-0 border-r overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-all duration-75 relative"
          style={{
            width: `${leftWidth}px`,
            borderColor: "var(--sd-border)",
            backgroundColor: "var(--sd-surface)",
          }}
        >
          {/* Sidebar Navigation Tabs */}
          <div className="p-3 border-b" style={{ borderColor: "var(--sd-border)" }}>
            <div className="join grid grid-cols-3 w-full bg-[#18181b] p-0.5 rounded-lg border border-white/5">
              <button
                className={`join-item text-[11px] py-1 font-medium transition-all ${
                  activeTab === "overview"
                    ? "bg-amber-400 text-black font-semibold rounded-md shadow"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`join-item text-[11px] py-1 font-medium transition-all ${
                  activeTab === "definition"
                    ? "bg-amber-400 text-black font-semibold rounded-md shadow"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
                onClick={() => setActiveTab("definition")}
              >
                Definition
              </button>
              <button
                className={`join-item text-[11px] py-1 font-medium transition-all ${
                  activeTab === "interview"
                    ? "bg-amber-400 text-black font-semibold rounded-md shadow"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
                onClick={() => setActiveTab("interview")}
              >
                Interview Prep
              </button>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-4 flex-1">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <>
                <div>
                  <h1
                    className="text-base font-semibold leading-tight mb-1.5"
                    style={{ color: "var(--sd-text)" }}
                  >
                    {topic.title}
                  </h1>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--sd-text-muted)" }}>
                    {topic.oneLiner}
                  </p>
                </div>

                {/* Callout slot */}
                <div
                  className="rounded-xl border p-3.5 text-xs leading-relaxed"
                  style={{
                    backgroundColor: group.accentHex + "0d",
                    borderColor: group.accentHex + "30",
                    color: "var(--sd-text-muted)",
                  }}
                >
                  <p
                    className="text-[11px] font-mono font-semibold uppercase tracking-wider mb-2"
                    style={{ color: group.accentHex }}
                  >
                    Why it matters
                  </p>
                  {callout}
                </div>
              </>
            )}

            {/* Formal Definition Tab */}
            {activeTab === "definition" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
                  <span>📖</span> Architectural Definition
                </div>
                <div className="rounded-xl bg-[#161616] border border-white/10 p-4 text-xs leading-relaxed text-zinc-300 font-mono">
                  {definition || topic.oneLiner}
                </div>
              </div>
            )}

            {/* System Design Interview Prep Tab */}
            {activeTab === "interview" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
                  <span>💡</span> Interview Questions &amp; Trade-offs
                </div>
                {interviewPrep && interviewPrep.length > 0 ? (
                  <div className="space-y-2.5">
                    {interviewPrep.map((item, idx) => (
                      <div
                        key={idx}
                        className="collapse collapse-plus bg-[#161616] border border-white/10 rounded-xl"
                      >
                        <input type="radio" name="interview-accordion" defaultChecked={idx === 0} />
                        <div className="collapse-title text-xs font-semibold text-zinc-200 pr-8">
                          Q{idx + 1}: {item.question}
                        </div>
                        <div className="collapse-content text-xs leading-relaxed text-zinc-400 border-t border-white/5 pt-2">
                          {item.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic">
                    Interview prep topics coming soon for this module.
                  </p>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Left resizer handle with grip dots */}
        <div
          onMouseDown={startResizingLeft}
          className="hidden lg:flex w-2.5 hover:w-3 bg-transparent hover:bg-amber-400/40 active:bg-amber-400 cursor-col-resize z-30 transition-all items-center justify-center group"
          title="Drag to resize Left Sidebar (expandable up to 800px)"
        >
          <div className="w-0.5 h-8 rounded bg-zinc-600 group-hover:bg-amber-400" />
        </div>

        {/* Center: Animation stage */}
        <main
          className="flex-1 min-w-0 flex flex-col overflow-hidden"
          style={{ backgroundColor: "var(--sd-bg)" }}
        >
          <div className="flex-1 min-h-0 relative">
            {visual(step, player.currentStep)}
          </div>
        </main>

        {/* Right resizer handle with grip dots */}
        <div
          onMouseDown={startResizingRight}
          className="hidden md:flex w-2.5 hover:w-3 bg-transparent hover:bg-amber-400/40 active:bg-amber-400 cursor-col-resize z-30 transition-all items-center justify-center group"
          title="Drag to resize Right Panel (expandable up to 900px)"
        >
          <div className="w-0.5 h-8 rounded bg-zinc-600 group-hover:bg-amber-400" />
        </div>

        {/* Right: panels (Pseudocode, State, Narration) */}
        <aside
          className="hidden md:flex flex-col flex-shrink-0 border-l overflow-y-auto gap-3 p-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-all duration-75"
          style={{
            width: `${rightWidth}px`,
            borderColor: "var(--sd-border)",
            backgroundColor: "var(--sd-surface)",
          }}
        >
          <PseudocodePanel
            lines={lesson.pseudocode}
            activeLine={step.activeLine}
            accentHex={group.accentHex}
          />
          <StatePanel state={step.state} accentHex={group.accentHex} />
          <NarrationBar text={step.narration} stepKey={player.currentStep} />
        </aside>
      </div>

      {/* Mobile: panels stacked below animation */}
      <div className="md:hidden flex flex-col gap-3 p-3 border-t" style={{ borderColor: "var(--sd-border)" }}>
        <NarrationBar text={step.narration} stepKey={player.currentStep} />
        <StatePanel state={step.state} accentHex={group.accentHex} />
      </div>

      {/* ── Bottom: step controls ─────────────────────────────────────────── */}
      <StepControls
        currentStep={player.currentStep}
        totalSteps={lesson.steps.length}
        isPlaying={player.isPlaying}
        speed={player.speed}
        accentHex={group.accentHex}
        onPlay={player.play}
        onPause={player.pause}
        onNext={player.next}
        onPrev={player.prev}
        onReset={player.reset}
        onSetSpeed={player.setSpeed}
        onGoToStep={player.goToStep}
      />
    </div>
  );
}
