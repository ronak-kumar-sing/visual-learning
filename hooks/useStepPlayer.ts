"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Speed = 0.5 | 1 | 2 | 4;

const SPEED_MS: Record<Speed, number> = {
  0.5: 3000,
  1: 1500,
  2: 750,
  4: 375,
};

export interface UseStepPlayerReturn {
  currentStep: number;
  isPlaying: boolean;
  speed: Speed;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  setSpeed: (s: Speed) => void;
  goToStep: (n: number) => void;
}

export function useStepPlayer(totalSteps: number): UseStepPlayerReturn {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeedState] = useState<Speed>(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);

  const next = useCallback(
    () => setCurrentStep((s) => Math.min(s + 1, totalSteps - 1)),
    [totalSteps],
  );

  const prev = useCallback(
    () => setCurrentStep((s) => Math.max(s - 1, 0)),
    [],
  );

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  const setSpeed = useCallback((s: Speed) => setSpeedState(s), []);

  const goToStep = useCallback(
    (n: number) =>
      setCurrentStep(Math.max(0, Math.min(Math.floor(n), totalSteps - 1))),
    [totalSteps],
  );

  // Auto-advance interval
  useEffect(() => {
    clearTimer();
    if (!isPlaying) return;

    intervalRef.current = setInterval(() => {
      setCurrentStep((s) => {
        if (s >= totalSteps - 1) {
          setIsPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, SPEED_MS[speed]);

    return clearTimer;
  }, [isPlaying, speed, totalSteps, clearTimer]);

  // Stop if totalSteps shrinks below currentStep
  useEffect(() => {
    setCurrentStep((s) => Math.min(s, totalSteps - 1));
  }, [totalSteps]);

  return {
    currentStep,
    isPlaying,
    speed,
    play,
    pause,
    next,
    prev,
    reset,
    setSpeed,
    goToStep,
  };
}
