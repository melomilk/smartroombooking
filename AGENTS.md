# AGENTS.md

Instructions for AI coding agents (Claude, Codex, Cursor, Bolt, etc.) working in this repository. Read this whole file before changing anything.

## 1. Purpose

Campuspace is a front-end-only **room availability checker** for fictional campus rooms. A student picks a room and a time range; the app answers "available" or "not available" with reasons. It does **not** create, save or cancel reservations. All data is fictional fixture data. The current time is fixed at 10:30 on purpose, so results are deterministic.

## 2. Architecture

| Layer | File | Rule |
|---|---|---|
| Entry | `index.html` → `src/main.tsx` | Do not change unless asked |
| UI | `src/App.tsx`, `src/components/*.tsx`, `src/index.css` | Rendering and React state only. No business rules here |
| Logic | `src/lib/availability.ts` | Pure functions only: no React, no DOM, no I/O, no mutation |
| Data | `src/data/rooms.ts` | Read-only fixtures and types. Never mutate at runtime |
| Tests | `src/**/*.test.ts` | Vitest unit tests for logic |

Data flow: time inputs (`"HH:MM"` strings) → `toMinutes` → `checkAvailability(room, start, end, now)` → `Decision` → rendered by the UI.

## 3. Setup

Requirements: Node 20+ and npm.

```bash
npm ci          # install exact versions from package-lock.json
npm run dev     # local dev server (http://localhost:5173)
```

## 4. Safe commands (allowed without asking)

| Command | Purpose |
|---|---|
| `npm ci` | Install locked dependencies |
| `npm test` | Run Vitest unit tests |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run lint` | ESLint |
| `npm run build` | Production build into `dist/` |
| `npm run dev`, `npm run preview` | Local servers only |
| `npm audit`, `npm ls`, `npm outdated` | Read-only dependency inspection |
| `git status`, `git diff`, `git log` | Read-only git inspection |

## 5. Forbidden actions (never do these)

- **Secrets:** never create, read, print or commit `.env` files, API keys, tokens or passwords. Never add real personal data (real names, emails, student IDs).
- **Deployment:** never deploy, publish or push to any hosting (Bolt, Netlify, Vercel, GitHub Pages) or run any production command.
- **Destructive commands:** never run `rm -rf`, `git reset --hard`, `git push --force`, `git clean -fd`, delete branches, or rewrite git history.
- **Dependencies:** never add, remove or upgrade a package (`npm install <pkg>`, `npm uninstall`, `npm update`, `npm audit fix`) without explicit human approval of the exact change. Never edit `package-lock.json` by hand.
- **Scope:** no backend, login, database, network calls, saved bookings, new features or UI redesign.
- **Tests:** never delete, skip (`.skip`, `.only`) or weaken an existing assertion to make a check pass.
- **Data:** never mutate `rooms`, `bookings` or other fixtures.

## 6. Acceptance criteria (must stay true)

- **AC1** Reject start ≥ end and requests starting at or before the current time.
- **AC2** Allow exactly 120 minutes; reject longer durations.
- **AC3** Reject a blocked room.
- **AC4** Reject overlaps; allow requests that only touch a booking's start or end.
- **AC5** `checkAvailability` does not mutate room or booking data.
- **AC6** Feedback stays clear on desktop and mobile (manual check).

## 7. Coding conventions

- TypeScript strict mode; no `any`, no `@ts-ignore`.
- Import with the `@/` alias (`@/lib/availability`), not deep relative paths.
- Keep business logic in `src/lib/` as pure, typed functions; components only render.
- Small, focused changes. At most one design pattern per change, and only with a written justification.
- No Singleton, Factory or class hierarchies.
- Match existing style: single quotes, semicolons, 2-space indent.

## 8. Test expectations

- Every logic change needs a focused test in `src/lib/*.test.ts`; every bug fix needs a regression test that fails before the fix.
- Before reporting a task as done, run **all four** and report the real output:
  `npm test` · `npm run typecheck` · `npm run lint` · `npm run build`
- Never claim a check passed unless you ran it in this session. Say clearly which checks were not run.

## 9. Review gates

- All work happens on a separate branch, never directly on `main`.
- A human reviews every diff before it is merged. The agent must not merge its own work.
- Any change to `package.json`, `package-lock.json`, `AGENTS.md`, config files or test assertions needs explicit human approval.
- Final report must list: changed files, reason for each change, commands run with pass/fail totals, and open risks.
