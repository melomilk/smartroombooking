# Task #08 — Background Agent Safeguards (hypothetical design)

No paid background-agent service was used; this is a design only.

## Task given to the background agent

> **Fix A5-R8:** when a request overlaps more than one booking, list **every** conflicting booking instead of only the first. Add a regression test using Library 118, 12:15–14:15 (overlaps the 11:30–12:30 workshop and the 14:00–15:30 project meeting).

Chosen because it is small, confirmed (Task #04 C2), testable, and touches pure logic only.

## Isolation

| Setting | Value |
|---|---|
| Workspace | Separate git worktree: `git worktree add ../srb-agent-a5r8 -b agent/a5-r8-all-conflicts master` |
| Branch | `agent/a5-r8-all-conflicts`. Never `master`; no force push |
| Environment | Fresh container, no secrets and no `.env` mounted, network allowed only to `registry.npmjs.org` for `npm ci` |
| Instructions | `AGENTS.md` loaded via `CLAUDE.md`. The task prompt repeats §5 (forbidden actions) explicitly in case the tool does not load it |

## Allowed files

| May edit | May read only | Must not touch |
|---|---|---|
| `src/lib/availability.ts`, `src/lib/availability.test.ts` | everything else in the repo | `package.json`, `package-lock.json`, `AGENTS.md`, `CLAUDE.md`, config files (`vite`, `tsconfig`, `eslint`, `tailwind`), `src/data/rooms.ts`, `.github/`, existing test assertions |

Any change outside the "may edit" column makes the run fail automatically. The check: `git diff --name-only master` must be a subset of the allowed list.

## Allowed commands

`npm ci`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `git status`, `git diff`, `git add <allowed files>`, `git commit`, `git push origin agent/a5-r8-all-conflicts`.

## Time and resource limits

| Limit | Value |
|---|---|
| Total wall-clock time | 30 minutes, then the run is stopped and marked failed |
| Single command | 5 minutes |
| Commits | at most 3 on the branch |
| Retries of a failing check | at most 2 fix attempts, then stop and report |

## Prohibited operations

Everything in AGENTS.md §5, and specifically:
- no `npm install`, `npm uninstall`, `npm update`, `npm audit fix`
- no reading or creating `.env` or other secrets, and no network calls besides the npm registry
- no deploying or publishing; no merging; no pushing to `master`; no `--force`
- no `rm -rf`, `git reset --hard`, `git clean`, or history rewrite
- no `.skip`/`.only`, and no deleting or weakening existing assertions
- no changes to the UI, fixtures or acceptance criteria

## Required artifacts (attached to the pull request)

1. **Change summary:** what changed and why, and which risk it addresses (A5-R8).
2. **Diff:** the full `git diff master...agent/a5-r8-all-conflicts`.
3. **Test logs:** full `npm test` output **before** (new test failing) and **after** (all passing), with pass/fail totals.
4. **Check results:** `npm run typecheck`, `npm run lint` output.
5. **Build result:** `npm run build` output, with the exit code.
6. **Risk notes:** new or changed risks, anything not verified, and any deviation from the task.
7. **Command log:** every command run, with timestamps.

## Human review and approval

- The agent opens a **pull request**; it cannot merge.
- Milana reviews the diff line by line, reruns `npm ci && npm test && npm run build` locally, and checks that only allowed files changed.
- She confirms AC1–AC5 tests are untouched and still pass, and that the new test fails on `master` (proof it is a real regression test).
- Merge happens only after explicit approval. **No deployment** is part of this task; any deployment is a separate, human-initiated step.

## Failure and rollback handling

| Situation | Handling |
|---|---|
| Checks fail after 2 fix attempts or the time limit is hit | Agent stops, pushes nothing further, and reports logs + its best diagnosis. Branch stays for inspection |
| Agent touches a forbidden file or runs a forbidden command | Run marked failed; the branch and worktree are deleted (`git worktree remove`, `git branch -D`) without merging |
| Reviewer rejects the PR | PR closed; branch deleted; `master` is unaffected because nothing was merged |
| A problem is found after merge | `git revert <merge-commit>` on a new branch, which goes through the same PR review. No force push or history rewrite. Rerun all checks to confirm the revert |
