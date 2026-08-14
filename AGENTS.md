<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-skills -->

## Project Skills

This repo has two agent skills in `.agents/skills/`. Load the relevant one before writing any code:

| Skill | Trigger |
|-------|---------|
| `hallmark` (`.agents/skills/hallmark/SKILL.md`) | Building/redesigning UI pages, landing pages, audits, design extraction |
| `system-design-viz` (`.agents/skills/system-design-viz/SKILL.md`) | Any file under `app/system-design/`, `lib/system-design/`, `hooks/useStepPlayer*`, `components/lesson/*`, or lesson Visual components |

## Non-Negotiable Project Rules

1. **`await props.params`** — Next.js 16: dynamic route `params` is a Promise. Always `const { slug } = await props.params`. Never destructure directly.
2. **DESIGN.md is the locked design system** for the main app (white-canvas, emerald-green). The `/system-design/*` routes use a separate dark theme (`.sd-dark` class) — do not cross-contaminate the two palettes.
3. **Tailwind v4** — tokens live in `app/globals.css` inside `@theme inline {}`. Do not touch `tailwind.config.ts` for design tokens.
4. **`"use client"`** — all hooks (`useStepPlayer`, `useState`, `useEffect`) and interactive lesson components must have this directive at the top.

<!-- END:project-skills -->
