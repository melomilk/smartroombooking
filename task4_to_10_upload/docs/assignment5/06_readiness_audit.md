# Task #06 — Agent-Readiness Audit

**Audited version:** final commit (both Task #07 mitigations applied)
**Evidence:** `evidence/task6_audit_checks.txt`, `evidence/task7_final_checks.txt`

Levels: **1 Baseline** (code runs, little guidance) · **2 Documented** (accurate docs, agent rules, runnable checks) · **3 Agent-ready** (rules are *enforced* automatically: CI, protected branches, pinned toolchain, clean audit).

## Checklist

| Area | Baseline `a2f8a69` | Final | Evidence |
|---|---|---|---|
| Readable structure | ✅ small, clear `src/lib` / `src/data` split | ✅ plus `src/components/` | Repo map, Task #01 |
| README accurate | ❌ no README | ✅ purpose, setup, checks, structure | `README.md`; commands in it were run |
| Reproducible setup | ⚠️ lockfile, but no instructions | ⚠️ `npm ci` documented; **Node version not pinned** | No `engines` field, no `.nvmrc` |
| Pinned dependencies | ⚠️ caret ranges + lockfile | ⚠️ same; lockfile gives identical installs | Two machines produced identical trees (Task #04 C11) |
| Dependency health | ❌ 1 runtime high, 25 total | ⚠️ **0 runtime**, 24 dev-only (2 critical) | `npm audit` |
| Tests | ✅ 13 logic tests | ✅ 15 tests (logic + render) | `npm test` |
| Lint / type checks | ✅ pass | ✅ pass; ⚠️ TS 5.6.3 unsupported by typescript-eslint | Windows lint warning |
| Build command | ✅ `npm run build` | ✅ | exit 0 |
| Logging | ➖ none | ➖ none | No `console.*` in `src/`. Acceptable for a static, front-end-only checker with no I/O; no error reporting exists |
| Security safeguards | ⚠️ `.env` ignored; no secrets | ⚠️ same; no secret scanning or CI | `.gitignore:23`; grep for keys/tokens → none |
| CI / automated gates | ❌ | ❌ | No `.github/`, no pre-commit hooks |
| AGENTS.md: permissions & safe commands | ⚠️ 4 commands only | ✅ §4 table | `AGENTS.md` |
| AGENTS.md: prohibited actions | ⚠️ scope only | ✅ §5: secrets, deploy, destructive, deps, tests | `AGENTS.md` |
| AGENTS.md: review gates | ❌ | ✅ §9 written; ❌ **not enforced** | No branch protection or CI to enforce it |
| Agent actually loads instructions | ❌ (Claude does not read AGENTS.md) | ✅ `CLAUDE.md` imports it | Task #02 disclosure |

## Readiness level

| Version | Level | Justification |
|---|---|---|
| Baseline `a2f8a69` | **1 — Baseline** | Code and checks run, but there was no README, and AGENTS.md missed setup, security rules and review gates. The agent I used would not even load it. |
| Final | **2 — Documented** | README and AGENTS.md are accurate and were tested against real commands. Safe/forbidden actions and review gates are explicit, and all four checks pass. |

**Why not level 3:** every rule is still only *written*. Nothing stops an agent or a person from pushing untested code to `master`, adding a dependency, or skipping the review gate.

## Missing evidence for level 3

1. A CI workflow running `npm ci`, test, typecheck, lint, build on every push/PR, with a green run link (A5-R3).
2. Branch protection on `master`: PRs required, CI must pass, 1 approving review.
3. A pinned Node version (`engines` in `package.json` and/or `.nvmrc`).
4. A clean `npm audit` including dev dependencies (vitest major upgrade, A5-R4).
5. A supported TypeScript / typescript-eslint combination (A5-R7).
6. Secret scanning (GitHub secret scanning or a pre-commit hook).
7. Component tests with a DOM test library, and manual mobile/accessibility evidence for AC6.
