# Smart Campus Risk Register

## Task 3 — Challenge AI findings

The repository was reviewed directly. Findings are classified as **confirmed**, **plausible / unverified**, or **unsupported**. A test is only counted as evidence when it was actually executed.

| ID | Category | Proposed risk | Classification | Repository evidence | Decision |
|---|---|---|---|---|---|
| R-01 | Correctness | Availability decisions use a permanently fixed current time, so the checker can accept requests that are already in the past after the app's assumed time. | **Confirmed** | `src/data/rooms.ts` sets `currentTime` to 10:30. `src/App.tsx` passes that constant to every check. | Real product risk within the current fixed-time exercise design. |
| R-02 | Business logic | The “Book this room” action shows “Booking confirmed” but does not create or save a booking. | **Confirmed** | `confirmBooking` only sets local `bookingConfirmed` state. The project explicitly forbids saved booking creation and mutation of fixtures. | Confirmed misleading behavior, but intentionally out of scope for this exercise. |
| R-03 | Security | A client-side availability result could be altered by a user if it were treated as an authority for a real reservation. | **Unsupported** | There is no backend, authenticated action, saved booking, or protected resource. `checkAvailability` only returns a local decision. | Not an exploitable vulnerability in this repository. It would become a risk if real reservations were added. |
| R-04 | Correctness | Invalid or malformed time strings might bypass the duration and overlap checks. | **Plausible / unverified** | `toMinutes` converts split string values without explicit finite-number validation. The current browser time controls and `checkAvailability` reject the malformed values observed in source-level review. | Needs boundary tests for direct helper calls and browser input behavior before reporting as a defect. |
| R-05 | Reliability | Booking fixtures can become stale because rooms and bookings are hard-coded and never refreshed. | **Confirmed** | All room status, booking intervals, and labels are constants in `src/data/rooms.ts`; no refresh or external source exists. | Real limitation of the demo data model; no backend may be added under the current constraints. |
| R-06 | UX / accessibility | Responsive feedback may be unclear on narrow screens or with assistive technology. | **Plausible / unverified** | The layout has mobile breakpoints and an `aria-live` decision panel, but there are no browser or accessibility tests in the repository. | Requires manual mobile and assistive-technology verification. Do not claim it is passed from unit tests. |

### Findings not supported by the repository

No evidence was found for XSS, unsafe HTML rendering, open redirects, cross-window messaging, token handling defects, hard-coded secrets, database/RLS exposure, or server-side injection. This is a static React application with no server routes or database usage in the checked source.

## Task 4 — Risk register

Scoring: likelihood and impact are each rated from 1 (low) to 3 (high). Score = likelihood × impact.

| ID | Cause / event / consequence | Affected component | Evidence | Likelihood | Impact | Score | Proposed mitigation | Owner | Verification method |
|---|---|---|---|---:|---:|---:|---|---|---|
| R-02 | A visitor assumes an availability result is a reservation; the visitor may rely on a room that is not reserved. | Availability result panel | `src/App.tsx` now presents the result as reference-only and has no booking action; `AGENTS.md` forbids saved booking creation. | 1 | 2 | **2** | **Implemented:** removed the booking action and added reference-only wording. | Engineering owner | Source review confirms no booking state or action remains; automated checks pass. |
| R-01 | The fixed clock remains at 10:30; later visitors can receive an “available” result for a time that is already past. | Time validation and availability decision | `src/data/rooms.ts`: fixed `currentTime`; `src/App.tsx`: passes it to the checker. | 3 | 2 | **6** | Use an injected clock or real current time when the exercise permits it; retain a fixed clock only in deterministic tests. | Engineering owner | Test a request before and after the configured current time and verify the decision changes. |
| R-05 | Hard-coded schedules are not refreshed; a real-world booking or room closure is absent from the fixture; visitors receive stale availability. | Room data and today’s schedule | `src/data/rooms.ts` contains all room and booking data as constants. | 2 | 3 | **6** | Replace fixtures with an approved authoritative schedule source in a future scope; do not add it under the current assignment constraints. | Product owner | Compare displayed bookings with the authoritative campus schedule at a defined verification time. |
| R-03 | A future client-only reservation flow trusts a browser decision; a modified client can claim availability and cause conflicting reservations. | Reservation authorization boundary | No server-side reservation path exists today. | 2 | 3 | **6** | If reservations are introduced, enforce overlap, room-block, duration, and time rules on the server and make the write atomic. | Engineering owner | Attempt two overlapping reservations concurrently and verify exactly one succeeds. |
| R-06 | Mobile or assistive-technology users cannot clearly understand the result; they make an incorrect room decision. | Checker form and decision panel | Responsive CSS and `aria-live` exist, but no browser/accessibility test evidence exists. | 2 | 2 | **4** | Perform manual mobile checks and keyboard/screen-reader verification; preserve clear error text. | QA owner | Verify focus order, announced result changes, readable contrast, and no horizontal overflow at narrow widths. |
| R-04 | A direct caller supplies malformed time text; conversion produces `NaN`; future changes could accidentally treat it as valid and return an incorrect decision. | Time conversion boundary | `src/lib/availability.ts` now rejects non-finite start/end values before duration, room, or overlap checks. | 1 | 1 | **1** | **Implemented:** finite-value validation plus a malformed-input regression test. | Engineering owner | Automated test confirms malformed input returns “Check the time range.” |

## Priorities

1. **R-01 — Score 6:** make the time source explicit and testable before this checker is used beyond the fixed-time exercise.
2. **R-05 — Score 6:** replace hard-coded schedules with an approved authoritative source in a future scope.

The remaining risks are either constrained by the assignment, require deployment or manual verification, or are future risks rather than current exploitable vulnerabilities.

## Verification evidence

- `npm test`: passed, 1 test file and 12 tests passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed. The build emitted non-blocking Browserslist and Tailwind configuration warnings.
- No browser, mobile, or assistive-technology test was executed, so R-06 remains plausible / unverified.
