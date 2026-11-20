# Task #04 — Read-only AI Risk Review

**Reviewed version:** commit `72a4b12` (after Tasks 1–3)
**AI assistant:** Claude Opus 5.5 (claude.ai, Claude Code-based environment), 20 Nov 2026
**Verification output:** `evidence/task4_verification.txt`

## 1. Prompt given to the AI (read-only)

> Read-only review. Do NOT modify, create or delete any file in the repository. Review `melomilk/smartroombooking` at commit `72a4b12` against `AGENTS.md`. Propose candidate risks in these categories: correctness, maintainability, security, dependency, agent operations. For each candidate give the claim, the file/line it concerns, and how it could be verified.

Context given: the full repository, AGENTS.md (read explicitly; see Task #02 disclosure), and the Task #01 baseline results.
**Read-only check:** `git status` was clean after the review. The only files created were temporary probe tests used during *verification*, which were deleted right after running (shown in the evidence log).

## 2. Raw AI candidates (before verification)

| # | Category | AI claim |
|---|---|---|
| C1 | Correctness | `toMinutes` does not validate the `HH:MM` format, so values like `10:75` produce a wrong time |
| C2 | Correctness | When a request overlaps several bookings, only the first conflict is reported |
| C3 | Maintainability | React keys `${start}-${end}` in the bookings list can collide and break rendering |
| C4 | Security | Room names or labels could inject HTML/JS (XSS) into the page |
| C5 | Dependency | `@supabase/supabase-js` is unused but installed, and brings a vulnerable `ws` |
| C6 | Dependency / security | `vitest` and `tinypool` have **critical** vulnerabilities (possible remote code execution) |
| C7 | Dependency | TypeScript 5.6.3 is outside the version range supported by `typescript-eslint` 8.8.1 |
| C8 | Correctness | Header says "Live campus hours" while the clock is hard-coded to 10:30 |
| C9 | Agent operations | No CI pipeline, so agent-made changes can reach `master` without tests running |
| C10 | Agent operations | Bolt's `.bolt/prompt` tells the agent to build "fully featured" pages, contradicting AGENTS.md |
| C11 | Dependency | Caret (`^`) version ranges make builds non-reproducible across machines |
| C12 | Maintainability | Assignment #04 documents state wrong test counts |

## 3. Investigation and classification

| # | Classification | Evidence (what was actually checked) |
|---|---|---|
| C1 | **Confirmed** (function level) | Probe: `toMinutes("10:75")` = 675 → `checkAvailability` returns `available=true`, "11:15 AM – 11:30 AM". Code: `src/lib/availability.ts:11-14` splits on `:` and multiplies with no range check. In the browser, `<input type="time">` probably blocks such values; not tested manually. |
| C2 | **Confirmed** | Probe: Library 118, 12:15–14:15 (120 min) overlaps *Workshop 11:30–12:30* **and** *Project meeting 14:00–15:30*; output lists only the workshop. Cause: `room.bookings.find(...)` in `availability.ts` returns the first match only. |
| C3 | **Plausible / unverified** | All 4 fixture bookings have unique start–end pairs, so no collision exists today. A collision needs two bookings with identical times, which current data cannot produce. |
| C4 | **Unsupported** | `grep` for `dangerouslySetInnerHTML`, `innerHTML`, `eval(`, `new Function`, `document.write` in `src/` → no matches. React escapes all text, and all data is static fixtures with no user-supplied HTML. |
| C5 | **Confirmed** (with correction) | `findstr`/`grep supabase src/` → no matches; `npm ls ws` → `supabase-js › realtime-js › ws@8.18.3`; `npm audit --omit=dev` → 1 high (`ws`). **Correction to the AI claim:** after `npm run build`, `grep supabase\|realtime dist/assets/*.js` finds nothing, so the package is **not shipped to browsers**. The risk is install/supply-chain surface and audit noise, not a live exploit. |
| C6 | **Confirmed present; AI overstated impact** | `npm audit --json`: vitest advisories need the **Vitest UI server** to be listening or a malicious mock redirect; tinypool needs attacker-controlled worker options. `@vitest/ui` is not installed and the script is `vitest run` (no server). It is real, but only reachable on a developer machine running untrusted test code. |
| C7 | **Confirmed** | Windows `npm run lint` printed: "SUPPORTED TYPESCRIPT VERSIONS: >=4.7.4 <5.6.0 / YOUR TYPESCRIPT VERSION: 5.6.3". `npm ls` shows typescript 5.6.3 and typescript-eslint 8.8.1. The Linux AI run did **not** show this warning, so it was found by the human check, not the AI. |
| C8 | **Confirmed** | `src/App.tsx:54` "Live campus hours"; `src/data/rooms.ts:25` `currentTime = 10 * 60 + 30`. No code reads the real time anywhere in `src/`. |
| C9 | **Confirmed** | No `.github/` directory; no other CI config in the repo. All checks run only when someone runs them by hand. |
| C10 | **Plausible / unverified** | The prompt text exists inside the original ZIP (commit `6e9e998`, `project/.bolt/prompt`: "fully featured and worthy for production"). `.bolt/` is **not** in the current tree, and it is unknown whether Bolt still applies it to this project. |
| C11 | **Unsupported** | `package-lock.json` is committed, and `npm ci` installs exact locked versions. Two independent installs (Linux AI run and Windows run) got identical trees: 319 packages, `ws@8.18.3`, `typescript@5.6.3`. Carets only matter for `npm install`/`npm update`, which AGENTS.md §5 now forbids without approval. |
| C12 | **Confirmed** | `RISK_REGISTER.md:42` and `SUBMISSION_READINESS.md:47` say "12 tests passed"; `npm test` reports 13. |

**Summary:** 12 candidates in 5 categories → **8 confirmed, 2 plausible/unverified, 2 unsupported.**
Two confirmed findings needed corrections to the AI's claim (C5: not shipped to the browser; C6: impact overstated). One confirmed finding (C7) came from the human run, not the AI.

Confirmed and plausible findings go to the risk register (`05_risk_register.md`) as A5-R1…A5-R10.
