# Task #07 — Mitigation and Verification

Two minimal mitigations for the top two confirmed risks (A5-R1, A5-R2).
**Human approval:** Milana Pak approved both changes on 20 Nov 2026 before they were made. This was required by AGENTS.md §9 because M2 changes `package.json` / `package-lock.json`.
**Evidence:** `evidence/task7_m1_before.txt`, `task7_m1_after.txt`, `task7_m2_before.txt`, `task7_m2_after.txt`, `task7_final_checks.txt`

---

## M1 — A5-R1: misleading "Live campus hours" label

**Change (1 line, `src/App.tsx:54`):**
```diff
-<div className="topbar-status"><span className="status-dot" /> Live campus hours</div>
+<div className="topbar-status"><span className="status-dot" /> {`Demo time ${formatTime(currentTime)}`}</div>
```
The label is built from the same `currentTime` constant the checker uses, so the label and the logic cannot drift apart.

**New test `src/App.test.tsx` (2 tests).** It renders `<App />` with `react-dom/server` (already installed, so no new dependency). It asserts that "Live campus hours" is absent and that "Demo time 10:30 AM" is present.

| Run | Result |
|---|---|
| Test added **before** the fix | **2 failed / 13 passed (15)**, exit 1. Failures: "expected … not to contain 'Live campus hours'" and "expected … to contain 'Demo time 10:30 AM'" |
| **After** the fix | **15 passed / 0 failed**, exit 0 |
| Production bundle | `grep "Live campus" dist/assets/*.js` → no match; `"Demo time"` → 1 match |

**Diff review:** checked that only the label text changed. CSS classes, layout and the `currentTime` logic are untouched, and the label uses `formatTime`, the same function as the hint below the inputs.

## M2 — A5-R2: unused `@supabase/supabase-js` pulling in vulnerable `ws`

**Change:** `npm uninstall @supabase/supabase-js`. Removes 1 line from `package.json` and 13 packages from `package-lock.json`.

**Diff review of `package-lock.json`** (122 lines removed, 7 added):
- Removed: the 7 `@supabase/*` packages, `@types/phoenix`, `@types/ws`, `tr46`, `webidl-conversions`, `whatwg-url`, `ws`.
- Added: `dev`/`optional`/`peer` flags on `@types/node` and `undici-types` (now reachable only through dev tools), plus 1 integrity hash for `ts-api-utils`.
- **0 version changes** to any remaining package. Accepted.

| Measure | Before | After |
|---|---|---|
| `npm audit --omit=dev` (runtime) | **1 high** (`ws`) | **0 vulnerabilities** |
| `npm ls ws` | `ws@8.18.3` | (empty) |
| `npm audit` (all) | 25 (2 low, 7 moderate, 14 high, 2 critical) | 24 (2 low, 7 moderate, 13 high, 2 critical) |
| Installed packages (`npm ls --all` lines) | 544 | 523 |

## Final checks (both mitigations applied)

| Check | Baseline `a2f8a69` | After Tasks 1–3 `72a4b12` | Final |
|---|---|---|---|
| `npm test` | 13 passed / 0 failed | 13 passed / 0 failed | **15 passed / 0 failed** (2 files) |
| `npm run typecheck` | pass | pass | pass |
| `npm run lint` | pass (TS version warning on Windows) | pass (same warning) | pass |
| `npm run build` | pass, 1570 modules | pass, 1571 modules | pass, 1571 modules |
| `npm audit --omit=dev` | 1 high | 1 high | **0** |

Acceptance criteria AC1–AC5 are still covered by the 13 original tests, all passing and none changed.

**Independent verification by Milana** (Windows 10, npm 11.8.0, final code commit `1ddc046`, 20 Nov 2026):

| Check | Result | Screenshot |
|---|---|---|
| `npm ci` | 305 packages added, **24 vulnerabilities** (2 low, 7 moderate, 13 high, 2 critical) | `T7_final_1ddc046_push_npm_ci_test.png` |
| `npm test` | **2 files, 15 passed (15)** | same |
| `npm run typecheck` / `npm run lint` | pass (lint shows the known TS version warning, A5-R7) | `T7_final_1ddc046_typecheck_lint_build_audit.png` |
| `npm run build` | 1571 modules, `index-CgUmiCCQ.js` 155.56 kB, the **same file hash** as the AI's Linux build | same |
| `npm audit --omit=dev` | **found 0 vulnerabilities** | same |
| Browser (`npm run preview`) | Header shows **"Demo time 10:30 AM"**; North Hall 204 12:30–13:30 → "Not available this time" | `AC6_desktop_header_demo_time_unavailable.png` |
| Browser, mobile 400×650 | 11:00–11:45 → "Room is available"; 12:30–13:30 → "Not available this time" | `AC6_mobile_available.png`, `AC6_mobile_unavailable.png` |

**Not tested:** screen readers, browsers other than Chrome, and the desktop "available" state (the mobile one was captured).

## Updated risk scores

| ID | Before | After | Reason |
|---|---|---|---|
| A5-R1 | L3 × I2 = **6** | L1 × I2 = **2** | The UI now states the demo time instead of claiming live hours. The fixed clock itself remains by design. |
| A5-R2 | L2 × I2 = **4** | L1 × I1 = **1** | The package and `ws` are gone, and the runtime audit is clean. The remaining score is for the possibility of re-adding unused packages, now gated by AGENTS.md §5. |

## Remaining limitations and trade-offs

- **The static green status dot** next to the label still looks like an "online" indicator. Left unchanged to keep the fix minimal (AGENTS.md forbids UI redesign).
- **The fixed clock is still a product limitation.** A real clock would change behaviour and needs a scope decision.
- **24 dev-only vulnerabilities remain.** That includes 2 critical in vitest/tinypool (A5-R4), which need a major vitest upgrade, deliberately not bundled with these minimal fixes.
- **The new render test checks text only**, not visual layout. A full DOM/component test would need `@testing-library/react` + `jsdom` (a dependency change not approved here).
