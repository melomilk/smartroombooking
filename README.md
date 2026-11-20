# Campuspace — Smart Room Booking checker

A small React + TypeScript web app that checks whether a campus study room is free for a chosen time. It returns an availability decision only; it does not save reservations. All rooms and bookings are fictional, and the current time is fixed at 10:30 so results are repeatable.

## Features

- Choose one of 3 fixture rooms (one is blocked for maintenance)
- Enter a start and end time and get a clear available / not available answer with reasons
- Rules: no past start times, max 120 minutes, no blocked rooms, no overlaps (touching edges is fine)

## Setup

Requires Node 20+ and npm.

```bash
npm ci
npm run dev       # http://localhost:5173
```

## Checks

| Command | What it does |
|---|---|
| `npm test` | Vitest unit tests for the availability logic |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run build` | Production build into `dist/` |

## Project structure

```
src/
  App.tsx                  UI: room picker, time inputs, today's bookings
  components/              UI pieces (decision panel)
  lib/availability.ts      Pure availability logic
  lib/availability.test.ts Unit tests
  data/rooms.ts            Fixture rooms, bookings, fixed current time
```

## For AI agents

Read [AGENTS.md](AGENTS.md) before making changes. Claude Code loads it through `CLAUDE.md`.

## Coursework documents

- Assignment #04: `RISK_REGISTER.md`, `SUBMISSION_READINESS.md`
- Assignment #05: `docs/assignment5/`
