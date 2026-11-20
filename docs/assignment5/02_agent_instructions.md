# Task #02 — Agent Instructions

**Files:** `AGENTS.md` (rewritten), `CLAUDE.md` (new), `README.md` (new)
**Previous version:** `evidence/AGENTS.before.md` (Assignment #04 version, 37 lines)

## What changed in AGENTS.md

| Requirement | Before (A4 version) | After |
|---|---|---|
| Purpose | 1 line | §1: what the app does and does not do, fixed clock explained |
| Architecture | missing | §2: layer table + data flow |
| Setup | missing | §3: Node version, `npm ci`, `npm run dev` |
| Safe commands | 4 commands listed | §4: table of allowed commands, including read-only git/npm inspection |
| Forbidden: secrets | missing | §5: no `.env`, keys, tokens, real personal data |
| Forbidden: production deployment | missing | §5: no deploy/publish to any host |
| Forbidden: destructive commands | missing | §5: no `rm -rf`, `reset --hard`, force push, history rewrite |
| Forbidden: unreviewed dependency changes | missing | §5: no install/uninstall/update/`audit fix` without approval |
| Coding conventions | 5 rules | §7: strict TS, `@/` alias, pure logic in `src/lib`, style |
| Test expectations | 1 line | §8: regression test per bug fix, all 4 checks, no fake results |
| Review gates | missing | §9: branch only, human merges, approval for deps/config/tests |

Every claim in AGENTS.md was checked against the repo: `tsconfig.app.json` has `"strict": true`; the 4 scripts exist in `package.json`; `src/` contains no deep relative imports.

## Loading disclosure

The assistant used (Claude Opus 5.5, Claude Code-based environment) **does not load AGENTS.md automatically**. It loads `CLAUDE.md`. Two measures:

1. Added `CLAUDE.md`, which imports AGENTS.md with `@AGENTS.md`, so future Claude Code sessions load it.
2. In this session the file was not auto-loaded, so the assistant **read AGENTS.md explicitly** before each change and checked its work against §5–§9. This is disclosed in the AI-use record.

## Items intentionally not changed

- `package.json` name is still `vite-react-typescript-starter` (W5). Under the new §9 a `package.json` change needs approval, so it is listed as a follow-up instead of being changed silently.
