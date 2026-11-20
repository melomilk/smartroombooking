# Task #03 — Focused Pattern Decision

**Evidence:** `evidence/task3_before.txt`, `evidence/task3_after.txt`

## The maintainability problem

**Mixed UI logic and duplicated conditionals in `src/App.tsx`.** The decision panel (lines 126–152 at the baseline) was written inline inside `App`:

- The same `decision.available` / `panelState` check appeared **5 times** in about 25 lines (lines 126, 135, 138, 140, 147).
- The non-empty branch used an inline IIFE `(() => { … })()` inside JSX only to declare one variable, which makes the JSX hard to read and edit.
- `App` (179 lines) handled room selection, time input, sample slots, today's schedule **and** result display at once. Changing how a result looks meant editing the main component.

## Patterns considered

| Option | Fits? | Decision |
|---|---|---|
| **Strategy** (interchangeable rule objects for `checkAvailability`) | No. There is only **one** rule set: every room uses the same 4 checks (past time, 120 min, blocked, overlap). Strategy pays off when several algorithms are swapped at runtime, e.g. different rules per room type. Here it would add an interface and 4 objects with no variation to switch between. AGENTS.md also forbids unnecessary abstractions. | Rejected |
| **Adapter** (wrap the browser time input to the domain's minutes) | Partly. `toMinutes` already converts `"HH:MM"` to minutes in one line. The real problem there is missing validation (W3), which is a correctness fix, not a structural one. A separate Adapter class would be ceremony. | Rejected; W3 is handled as a risk mitigation in Task #07 instead |
| **Extract Component** (plain refactoring, no GoF pattern) | Yes. It directly removes the duplication and the IIFE, and separates "show a decision" from "collect input". | **Chosen** |

**Conclusion: no design pattern is warranted.** The codebase is too small, and has no variation points, to justify Strategy or Adapter. One focused refactoring without a pattern solves the actual problem.

## The refactoring

- **New** `src/components/DecisionPanel.tsx`: receives `decision: Decision | null` and renders the empty, available or unavailable panel. An early return handles the empty state; `state` is computed **once**; labels come from a small `stepLabels` lookup.
- **Changed** `src/App.tsx`: the 27-line inline block becomes `<DecisionPanel decision={decision} />`; the now-unused `Check` and `X` icon imports are removed.
- **Unchanged:** `availability.ts`, `rooms.ts`, the tests, CSS class names, and all text.

## Before / after

| Measure | Before | After |
|---|---|---|
| `App.tsx` lines | 179 | 151 |
| `decision.available` / `panelState` checks in `App.tsx` | 5 | 0 |
| Same checks in the panel code | 5 (inline) | 1 `state` assignment + 2 uses |
| Inline IIFE in JSX | 1 | 0 |
| Components | `App` | `App`, `DecisionPanel` |

```
Before                                   After
App.tsx                                  App.tsx
 ├─ room picker                           ├─ room picker
 ├─ time inputs + samples                 ├─ time inputs + samples
 ├─ decision panel (inline, IIFE,         ├─ <DecisionPanel decision={decision} />
 │   5 duplicated checks)                 └─ today's bookings
 └─ today's bookings                     components/DecisionPanel.tsx
                                          └─ empty | available | unavailable
```

## Proof the acceptance criteria still hold

| Check | Before | After |
|---|---|---|
| `npm test` | 13 passed / 0 failed | 13 passed / 0 failed (AC1–AC5) |
| `npm run typecheck` | exit 0 | exit 0 |
| `npm run lint` | exit 0 | exit 0 |
| `npm run build` | exit 0 | exit 0 |
| Rendered HTML of the panel (empty / available / unavailable) | — | **identical** to the old inline JSX in all 3 states |

The last row comes from a temporary test. It rendered the old inline JSX (copied from the previous commit) and the new `DecisionPanel` with `react-dom/server`, then compared the strings. The temporary files were deleted afterwards; the output is in `evidence/task3_after.txt`.

**AC6 (manual):** take a desktop and a mobile-width screenshot of the decision panel after the change and attach them.

**Not done:** no permanent component test was added. That needs `@testing-library/react` + `jsdom`, which is a dependency change requiring approval under AGENTS.md §5.
