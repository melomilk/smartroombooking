# Task #01 — Baseline and Context

**Repository:** https://github.com/melomilk/smartroombooking
**Baseline commit:** `a2f8a69` (first commit containing the full source; earlier commits only held a ZIP)
**Environments:** (1) AI assistant run: Node v22.23.5, npm 10.9.9, Linux. (2) Own verification run: Windows 10 Command Prompt, npm 11.8.0 — screenshots in `evidence/screenshots/`. Dependencies installed with `npm ci` in both.
**Raw output:** `evidence/baseline_checks.txt`, `evidence/baseline_evidence.txt`

> Context: this repository was reused from Assignment #04. Files `RISK_REGISTER.md` (R-01…R-06), `SUBMISSION_READINESS.md` and the original `AGENTS.md` belong to Assignment #04. Assignment #05 work lives in `docs/assignment5/` and uses new finding IDs (A5-xx).

## Repository map

| Part | Files | Role |
|---|---|---|
| Entry point | `index.html` → `src/main.tsx` → `src/App.tsx` | React 18 single-page app, rendered into `#root` |
| UI | `src/App.tsx` (179 lines), `src/index.css` | Room selector, time inputs, decision panel, today's bookings |
| Business logic | `src/lib/availability.ts` | `toMinutes`, `formatTime`, `checkAvailability` (pure function) |
| Data | `src/data/rooms.ts` | Types, 3 fixture rooms with bookings, fixed `currentTime = 10:30`, sample slots |
| Tests | `src/lib/availability.test.ts` | 13 Vitest unit tests for `checkAvailability` |
| Dependencies | `package.json`, `package-lock.json` | 4 runtime deps (react, react-dom, lucide-react, @supabase/supabase-js), 15 dev deps; caret (`^`) ranges, lockfile present |
| Build / tooling | `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `tailwind.config.js`, `postcss.config.js` | Vite build, `@/` alias, TypeScript, ESLint, Tailwind |
| Scripts | `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run dev` | Defined in `package.json` |
| CI | none | No `.github/workflows/` |

## Commands and actual results (baseline `a2f8a69`)

| Check | Command | Result |
|---|---|---|
| Install | `npm ci` | 319 packages installed |
| Tests | `npm test` | **13 passed / 0 failed**, 1 file, exit 0 |
| Type check | `npm run typecheck` | exit 0, no errors |
| Lint | `npm run lint` | exit 0, no errors; on Windows it also prints a **warning: TypeScript 5.6.3 is not officially supported** by typescript-eslint (supported `>=4.7.4 <5.6.0`) |
| Build | `npm run build` | exit 0, built in 1.86 s; warning: `caniuse-lite is outdated` |
| Security audit | `npm audit` | **25 vulnerabilities (2 low, 7 moderate, 14 high, 2 critical)**, exit 1 |
| Audit, runtime only | `npm audit --omit=dev` | **1 high: `ws` 8.18.3** |

## Acceptance criteria (must remain true after every change)

| ID | Criterion | Verified by |
|---|---|---|
| AC1 | Requests with start ≥ end, or starting at/before the current time, are rejected | 4 tests (past, reversed, equal, R-01 regression) |
| AC2 | 120 minutes is allowed; 121 minutes is rejected | 2 boundary tests |
| AC3 | A blocked room (Arts Center 301) is always rejected | 1 test |
| AC4 | Overlapping requests are rejected; requests touching a booking only at its start or end are allowed | 3 tests |
| AC5 | `checkAvailability` never mutates room or booking data | 1 test (deep-copy comparison) |

AC6 from the original AGENTS.md (clear feedback on desktop and mobile) is checked manually with screenshots, not by automated tests.

## Weaknesses found

### Observed facts (reproduced; evidence in `evidence/`)

| # | Weakness | Evidence |
|---|---|---|
| W1 | **Unused runtime dependency.** `@supabase/supabase-js` is in `dependencies` but never imported. It pulls in `ws@8.18.3`, the only runtime vulnerability (high). | `grep -rn supabase src/ index.html` → no matches; `npm ls ws` → `@supabase/supabase-js > @supabase/realtime-js > ws@8.18.3`; `npm audit --omit=dev` → 1 high (`ws`) |
| W2 | **Vulnerable dev toolchain.** 25 audit findings; the 2 criticals (`vitest`, `tinypool`) need a major upgrade (vitest 2 → 5). | `npm audit`, `npm audit --json` |
| W3 | **Malformed minutes are accepted.** `toMinutes("10:75")` returns 675 (= 11:15) and the room is reported available. | Probe run in `evidence/baseline_evidence.txt`: `start="10:75" -> 675 … available=true` |
| W4 | **Misleading "live" label.** Header says "Live campus hours", but the clock is fixed at 10:30 (`src/data/rooms.ts:25`). Same root cause as Assignment #04 R-01, which was never mitigated. | `src/App.tsx:55`, `src/data/rooms.ts:25` |
| W5 | **No README, generic package name.** No README exists; `package.json` name is `vite-react-typescript-starter`. | `ls README*` → not found; `package.json` line 2 |
| W6 | **Stale documentation.** Both A4 documents claim "12 tests passed"; 13 tests actually run. | `RISK_REGISTER.md:42`, `SUBMISSION_READINESS.md:47` vs `npm test` |
| W7 | **AGENTS.md has gaps for agent use.** It has no setup steps and no rules on secrets, deployments, destructive commands or dependency changes. | `AGENTS.md` (full file) |
| W8 | **No CI and outdated browser data.** No workflow runs the checks on push; build warns `caniuse-lite is outdated`. | no `.github/`; build output |
| W9 | **Unsupported lint toolchain combination.** `typescript@5.6.3` is outside the range supported by `typescript-eslint@8.8.1` (`<5.6.0`), so lint results may be unreliable. Seen only in the Windows run; the Linux run printed no warning for the same versions. | Windows screenshot of `npm run lint`; `npm ls typescript typescript-eslint` |

### Assumptions (not verified)

- In the browser, `<input type="time">` probably prevents values like `10:75`, so W3 mainly affects direct calls to `toMinutes`. Needs a manual browser test.
- The site is not deployed publicly, so the `ws` vulnerability is not reachable in practice. No deployment config was found, but the Bolt hosting status is unknown.
- `.bolt/prompt` ("fully featured and worthy for production") conflicts with AGENTS.md ("no new features"). It exists in the original Bolt ZIP but was **not uploaded** to the repo, so it is not repository evidence yet.

### Unverified AI suggestions

None are accepted at this stage. AI-proposed risks are classified in Task #04.
