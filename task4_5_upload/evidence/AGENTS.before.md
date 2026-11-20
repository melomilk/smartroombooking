# AGENTS.md

## Project
Smart Campus room availability checker. One room, fictional bookings, fixed current time. It returns an availability decision only.

## Constraints
Preserve AC1–AC6:
- AC1: Reject start >= end and past requests.
- AC2: Reject durations longer than 120 minutes.
- AC3: Reject a blocked room.
- AC4: Reject overlaps; allow bookings touching only at endpoints.
- AC5: Do not mutate booking data.
- AC6: Keep clear feedback on desktop and mobile.

Forbidden: backend, login, database, saved booking creation, new features, or UI redesign.

## Engineering rules
Prefer pure functions and minimal changes.
Use at most 2 patterns, each justified by a concrete problem.
Avoid Singleton, Factory, and unnecessary class hierarchies.
Do not mutate booking fixtures.
Do not weaken or delete existing test assertions.

## Commands
- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Verification
Run existing tests and add focused regression tests.
Report changed files, rationale, and test evidence.