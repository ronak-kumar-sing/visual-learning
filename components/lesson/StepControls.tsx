"use client";

import { useCallback, useRef } from "react";
import type { Speed } from "@/hooks/useStepPlayer";

interface StepControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: Speed;
  accentHex: string;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onSetSpeed: (s: Speed) => void;
  onGoToStep: (n: number) => void;
}

const SPEEDS: Speed[] = [0.5, 1, 2, 4];

export default function StepControls({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  accentHex,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onReset,
  onSetSpeed,
  onGoToStep,
}: StepControlsProps) {
  const progress = totalSteps > 1 ? currentStep / (totalSteps - 1) : 0;
  const barRef = useRef<HTMLDivElement>(null);

  const handleBarClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onGoToStep(Math.round(fraction * (totalSteps - 1)));
    },
    [totalSteps, onGoToStep],
  );

  const handleBarPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.buttons !== 1 || !barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onGoToStep(Math.round(fraction * (totalSteps - 1)));
    },
    [totalSteps, onGoToStep],
  );

  return (
    <div
      className="border-t px-6 py-4 flex flex-col gap-3"
      style={{ borderColor: "var(--sd-border)", backgroundColor: "var(--sd-surface)" }}
    >
      {/* Progress bar */}
      <div
        ref={barRef}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={totalSteps - 1}
        aria-valuenow={currentStep}
        aria-label="Lesson progress"
        tabIndex={0}
        className="relative h-1.5 rounded-full cursor-pointer group select-none"
        style={{ backgroundColor: "var(--sd-surface-3)" }}
        onClick={handleBarClick}
        onPointerMove={handleBarPointerMove}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") onNext();
          if (e.key === "ArrowLeft") onPrev();
        }}
      >
        {/* Fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
          style={{ width: `${progress * 100}%`, backgroundColor: accentHex }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 shadow transition-all duration-300 opacity-0 group-hover:opacity-100"
          style={{
            left: `calc(${progress * 100}% - 7px)`,
            backgroundColor: accentHex,
            borderColor: "var(--sd-bg)",
          }}
        />
        {/* Step ticks */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full transition-colors duration-200"
              style={{
                left: `${(i / (totalSteps - 1)) * 100}%`,
                backgroundColor:
                  i <= currentStep ? accentHex : "var(--sd-text-faint)",
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between gap-4">
        {/* Transport */}
        <div className="flex items-center gap-2">
          {/* Reset */}
          <button
            id="step-control-reset"
            aria-label="Reset to first step"
            onClick={onReset}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/8"
            style={{ color: "var(--sd-text-muted)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7a5 5 0 1 0 .9-2.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M2 3v4h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Prev */}
          <button
            id="step-control-prev"
            aria-label="Previous step"
            onClick={onPrev}
            disabled={currentStep === 0}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/8 disabled:opacity-30"
            style={{ color: "var(--sd-text-muted)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 3L4 7l5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Play / Pause */}
          <button
            id="step-control-playpause"
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={isPlaying ? onPause : onPlay}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: accentHex, color: "#000" }}
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <rect x="3" y="2.5" width="3" height="9" rx="1" fill="currentColor"/>
                <rect x="8" y="2.5" width="3" height="9" rx="1" fill="currentColor"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3.5 2.5l8 4.5-8 4.5V2.5z" fill="currentColor"/>
              </svg>
            )}
          </button>

          {/* Next */}
          <button
            id="step-control-next"
            aria-label="Next step"
            onClick={onNext}
            disabled={currentStep === totalSteps - 1}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/8 disabled:opacity-30"
            style={{ color: "var(--sd-text-muted)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M5 3l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Step counter */}
          <span
            className="text-xs font-mono ml-1 tabular-nums"
            style={{ color: "var(--sd-text-faint)" }}
          >
            step {currentStep + 1} / {totalSteps}
          </span>
        </div>

        {/* Speed selector */}
        <div
          className="flex items-center gap-0.5 rounded-lg p-0.5"
          style={{ backgroundColor: "var(--sd-surface-2)" }}
          role="group"
          aria-label="Playback speed"
        >
          {SPEEDS.map((s) => (
            <button
              key={s}
              id={`speed-${s}x`}
              aria-label={`${s}x speed`}
              aria-pressed={speed === s}
              onClick={() => onSetSpeed(s)}
              className="px-2.5 py-1 rounded-md text-xs font-mono transition-all duration-150"
              style={{
                backgroundColor: speed === s ? accentHex : "transparent",
                color: speed === s ? "#000" : "var(--sd-text-muted)",
                fontWeight: speed === s ? 600 : 400,
              }}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
