# AI Evidence Appendix / AI-Use Record

**AI assistant:** Claude Opus 5.5 (Anthropic), used through claude.ai in a Claude Code-based environment with a Linux shell
**Date:** 20 November 2026 (single session)
**Human:** Milana Pak. She reviewed every output, approved changes, and reran the checks on her own Windows 10 machine (npm 11.8.0)
**Disclosure:** the AI tool does not load `AGENTS.md` automatically. It was read explicitly in the session, and `CLAUDE.md` was added to import it (Task #02). All AI-assisted commits carry a `Co-Authored-By: Claude` line in the local history.

## Record

| # | Task | Prompt summary (human → AI) | AI output used | Problems found in AI output | Changes made after review | Verification source |
|---|---|---|---|---|---|---|
| 1 | Understand assignment | "Explain what I need to do to get a full score" + PDF | Task-by-task breakdown | First proposed building a new sample app instead of using my Bolt project | Discarded the sample app; switched to `melomilk/smartroombooking` | Assignment PDF |
| 2 | Repo setup | "Is my repo OK?" | Found the repo held only a ZIP, then that `src/` was missing after upload | Assumed branch `main`; the repo uses `master` | Re-uploaded `src/`; used `master` | `git clone`, `diff` vs original ZIP, `git ls-remote` |
| 3 | Task #01 | "Continue" | Repo map, baseline commands, 8 weaknesses | Did not see the TypeScript/typescript-eslint warning | Added W9 from my Windows run | My Windows screenshots of all checks |
| 4 | Task #02 | "Continue" | New AGENTS.md, CLAUDE.md, README | — | Checked each claim (strict mode, scripts) against files | `tsconfig.app.json`, `package.json` |
| 5 | Task #03 | "Continue" | Rejected Strategy/Adapter; extracted `DecisionPanel` | — | — | 13/13 tests before and after; HTML-equivalence probe; my Windows rerun at `72a4b12` |
| 6 | Task #04 | Read-only prompt (see `04_risk_review.md` §1) | 12 candidate risks | C4 (XSS) and C11 (caret ranges) unsupported; C5 overstated (not in bundle); C6 overstated (needs Vitest UI) | Reclassified with evidence | `grep`, `npm ls`, `npm audit --json`, bundle search, two-machine comparison |
| 7 | Task #05 | "Continue" | Risk register, 10 entries | Tie between A5-R2 and A5-R3 needed a stated tie-break | Tie-break documented | Register cross-checked with Task #04 evidence |
| 8 | Task #07 | AI asked for approval; I replied "approved" | Label fix + test; `npm uninstall @supabase/supabase-js` | The lockfile diff had 7 added lines that needed explaining | Reviewed: only flag/integrity changes, 0 version changes | Test failed before (2 failed) and passed after (15/15); `npm audit --omit=dev` 1 → 0 |
| 9 | Tasks #06, #08–#10 | "Continue" | Audit, safeguards design, release decision, reflection draft | Reflection draft overstated one score change | Corrected; I edit the reflection into my own words | Docs cross-checked with evidence files |

## Human verification summary

- Reran on Windows: baseline `a2f8a69` (test, typecheck, lint, build, audit, `npm ls ws`, `findstr`, `dir README*`) and post-refactor `72a4b12` (test, typecheck, lint, build). All matched the AI's numbers, plus one extra warning the AI missed.
- Still to do before submission: Windows rerun at the final commit; AC6 desktop/mobile screenshots; browser check of the "Demo time 10:30 AM" header.
- No test result in these documents is invented. Every number comes from a command output saved in `evidence/` or from my screenshots in `evidence/screenshots/`.
