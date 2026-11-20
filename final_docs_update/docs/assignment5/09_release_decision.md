# Task #09 — Release Decision

**Reviewed version:** final commit of Assignment #05 (Tasks #03 and #07 applied), released as a **fictional room-availability demo**. Not for real reservations.

## Decision: **CONDITIONAL**

## Evidence

| Source | Result |
|---|---|
| Tests | 15 passed / 0 failed. AC1–AC5 covered by 13 unchanged tests; A5-R1 covered by 2 new tests |
| Typecheck, lint, build | All pass (exit 0) |
| Runtime dependencies | `npm audit --omit=dev` → 0 vulnerabilities (was 1 high) |
| Risk register | Top two confirmed risks mitigated: A5-R1 6 → 2, A5-R2 4 → 1. No confirmed risk with score > 4 remains |
| Readiness | Level 2 (Documented): rules are written and checks pass, but they are not enforced by CI |

## Why not GO

Critical checks pass, the independent Windows rerun at commit `1ddc046` matched, and the browser check confirmed AC6 and the A5-R1 fix. But known limitations remain (no CI, dev-only critical vulnerabilities, unsupported lint toolchain, fixed clock). They have controls and an owner rather than being resolved, which is the definition of CONDITIONAL.

## Why not NO-GO

There is no serious unresolved risk in what ships:
- The only runtime vulnerability was removed.
- The remaining criticals are in dev-only test tooling that is not shipped and needs the unused Vitest UI server to exploit.
- No critical verification gap remains for AC1–AC5.

## Conditions (each with a control and an owner)

| # | Limitation | Control | Owner | Due |
|---|---|---|---|---|
| 1 | ~~Final version not rerun independently; AC6 not evidenced~~ **Done 20 Nov 2026** | Windows rerun at `1ddc046`: 15/15 tests, typecheck, lint, build pass, runtime audit 0; desktop + mobile screenshots taken (`evidence/screenshots/`) | Milana Pak | Closed |
| 2 | A5-R3: no CI, so review gates are not enforced | Run all 4 checks by hand before every push (AGENTS.md §8); add a GitHub Actions workflow next | Milana Pak | Next iteration |
| 3 | A5-R4: 2 critical dev-only vulnerabilities (vitest/tinypool) | Never install or run `@vitest/ui`; only run trusted tests; upgrade vitest in a separate reviewed change | Milana Pak | Next iteration |
| 4 | A5-R7: TypeScript 5.6.3 unsupported by typescript-eslint 8.8.1 | Treat lint as advisory; upgrade typescript-eslint in a reviewed change | Milana Pak | Next iteration |
| 5 | Fixed 10:30 clock and fictional data | UI states "Demo time 10:30 AM"; release scope limited to a demo; any real use needs a real clock, server-side checks and authoritative data | Milana Pak | Scope decision before any real use |

Condition 1 is closed with passing results. Conditions 2–5 stay open with the controls above. If any of them is breached (e.g. a failing check is pushed, or `@vitest/ui` is installed), the decision becomes **NO-GO** until it is fixed.
