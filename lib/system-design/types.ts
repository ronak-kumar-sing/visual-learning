export type LessonStep = {
  narration: string;
  activeLine?: number; // 0-indexed into lesson.pseudocode
  state: Record<string, string | number | boolean>;
  visualState: unknown; // typed per-lesson visual component
};

export type Lesson = {
  pseudocode: string[];
  steps: LessonStep[];
};
