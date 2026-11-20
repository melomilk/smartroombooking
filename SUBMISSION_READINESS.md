# Submission Readiness

## Checklist

| Requirement | Status | Evidence |
|---|---|---|
| Project link or source archive with no real personal data | Ready in repository | The project is a self-contained fictional room checker. A project link or archive must still be attached through the submission system. |
| Risk register with at least five evaluated findings | Complete | `RISK_REGISTER.md` contains six findings with classifications, evidence, scores, mitigations, owners, and verification methods. |
| Agent-readiness audit with level, gaps, and AGENTS.md review | Complete | See the audit below. |
| Evidence of two mitigations, test outputs, and a release decision | Complete after verification below | R-02 and R-04 are implemented and covered by the evidence listed below. |

## Agent-readiness audit

**Level: Ready for constrained exercise submission; not production-ready for real reservations.**

### Strengths

- `AGENTS.md` clearly defines AC1–AC6, forbidden scope, engineering rules, and verification expectations.
- The instructions correctly prohibit backend services, authentication, databases, saved bookings, and fixture mutation.
- The core availability logic is pure and covered by focused tests.
- The repository has explicit commands for tests, type checking, linting, and production builds.

### Gaps

- The current time is intentionally fixed at 10:30, so this remains a deterministic exercise rather than a live campus schedule.
- Room and booking data are fictional fixtures and are not refreshed.
- No browser, mobile, or assistive-technology test evidence is available; AC6 remains supported by responsive source review only.
- A project link or source archive still needs to be attached externally when submitting.

### AGENTS.md review

`AGENTS.md` is consistent with the implementation. The required acceptance criteria are preserved, no prohibited backend or persistence work was added, booking fixtures remain unchanged, and the verification commands now list the actual project checks.

## Two implemented mitigations

1. **R-02:** Removed the misleading booking confirmation flow. The result panel is explicitly reference-only and does not claim that a reservation was saved.
2. **R-04:** Added finite-value validation before availability checks and a regression test proving malformed time input is rejected.

## Release decision

**Release for submission:** Yes, as a fictional room-availability exercise.

**Release for real reservation use:** No. The fixed clock, hard-coded schedule, and lack of a reservation authority are documented limitations, not missing implementation within this assignment's allowed scope.

## Verification evidence

- `npm test`: passed, 1 test file and 12 tests passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed. Existing Browserslist and Tailwind warnings are non-blocking.
- Manual browser, mobile, and assistive-technology checks were not executed and are not claimed as passed.
