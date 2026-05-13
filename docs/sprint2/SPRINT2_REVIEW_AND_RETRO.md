# Sprint 2 Review & Final Retrospective

**Sprint Goal:** Extend task management with delete/filter, add monitoring (health + logging), and apply Sprint 1 retro improvements.  
**Sprint Duration:** Simulated — 1 week  
**Stories Planned:** US-04, US-05, US-06, US-07 (6 story points)  
**Stories Delivered:** US-04, US-05, US-06, US-07 ✅

---

## Retrospective Improvements Applied

### ✅ Improvement 1 — Integration test coverage from day one
Integration tests in `tests/server.test.js` were written alongside each new feature in Sprint 2.  
**Result:** Overall line coverage jumped from 36% → **98.6%**. The 80% threshold is comfortably met.

### ✅ Improvement 2 — Validation extracted to dedicated module (applied in TaskStore)
The validation logic is now cohesive and centralized inside `TaskStore` methods with clear error messages, making unit testing of edge cases straightforward without HTTP overhead.

---

## Demo: What Was Delivered

### US-04 — Delete a Task ✅

**Acceptance Criteria Verification:**

| Criterion | Result |
|-----------|--------|
| Task is removed from the store | ✅ PASS |
| Returns `{ deleted: true, id }` on success | ✅ PASS |
| Returns error if ID doesn't exist | ✅ PASS |

```bash
curl -X DELETE http://localhost:3000/tasks/79a9f323-...

# Response (200 OK):
{ "deleted": true, "id": "79a9f323-..." }

# For unknown ID (404 Not Found):
{ "error": "Task not found: ghost-id" }
```

---

### US-05 — Filter Tasks by Status ✅

**Acceptance Criteria Verification:**

| Criterion | Result |
|-----------|--------|
| `?status=open` returns only open tasks | ✅ PASS |
| `?status=done` returns only completed tasks | ✅ PASS |
| Invalid status value returns descriptive error | ✅ PASS |

```bash
curl http://localhost:3000/tasks?status=open
# Returns only open tasks

curl http://localhost:3000/tasks?status=invalid
# Response (400): { "error": "Status filter must be 'open' or 'done'" }
```

---

### US-06 — Health Check Endpoint ✅

**Acceptance Criteria Verification:**

| Criterion | Result |
|-----------|--------|
| Returns `{ status: "ok", uptime: <seconds> }` with HTTP 200 | ✅ PASS |

```bash
curl http://localhost:3000/health

# Response (200 OK):
{
  "status": "ok",
  "uptime": 42,
  "timestamp": "2026-05-12T09:00:00.000Z"
}
```

This endpoint is ready for use with monitoring tools like UptimeRobot, Prometheus blackbox exporter, or AWS health checks.

---

### US-07 — Structured Logging ✅

**Acceptance Criteria Verification:**

| Criterion | Result |
|-----------|--------|
| Every operation writes a JSON log line with timestamp, operation, taskId, result | ✅ PASS |

**Sample log output (from test run):**
```json
{"timestamp":"2026-05-12T08:50:21.955Z","level":"INFO","operation":"addTask","taskId":"fa4ead07-...","title":"Integration test task"}
{"timestamp":"2026-05-12T08:50:21.972Z","level":"ERROR","operation":"addTask","error":"Task title must be a non-empty string"}
{"timestamp":"2026-05-12T08:50:22.011Z","level":"INFO","operation":"completeTask","taskId":"343d7377-..."}
{"timestamp":"2026-05-12T08:50:22.020Z","level":"INFO","operation":"deleteTask","taskId":"79a9f323-..."}
```

All log lines are valid JSON — pipe-able to tools like `jq`, CloudWatch Logs Insights, or Datadog.

---

## Final Test Results

```
Test Suites: 2 passed, 2 total
Tests:       29 passed, 0 failed

Coverage:
  taskStore.js  100% statements | 100% branches | 100% functions | 100% lines
  server.js     100% statements | 100% branches | 100% functions | 100% lines
  logger.js      85% statements |   0% branches |  75% functions |  85% lines
  ─────────────────────────────────────────────────────────────────────────────
  All files     98.6% statements | 94.7% branches | 94.4% functions | 98.6% lines
```

✅ 80% coverage threshold met — CI pipeline passes.

---

## Velocity

| Story | Points | Status |
|-------|--------|--------|
| US-04 | 1 | ✅ Done |
| US-05 | 2 | ✅ Done |
| US-06 | 1 | ✅ Done |
| US-07 | 2 | ✅ Done |
| **Total** | **6** | **6/6 delivered** |

**Total across both sprints:** 11/11 story points delivered ✅

---

## Final Retrospective

### What Went Well

1. **Iterative commits told a story.** The git log reads like a development diary — each commit maps to exactly one user story or concern. This would make code review, `git bisect`, and rollback trivial in a real team environment.

2. **CI as a safety net.** The GitHub Actions pipeline caught coverage regressions early (during Sprint 1 the coverage was 36% — the failing threshold forced adding integration tests in Sprint 2, which is exactly the right behaviour).

3. **JSON structured logging paid off immediately.** When running the tests, the structured log output was immediately useful — it was easy to see which operations succeeded, failed, and what IDs were affected, without any extra tooling.

4. **Small, focused modules were easy to test.** `TaskStore`, `logger`, and `server` each have a single responsibility. This meant tests were fast, clear, and required no mocking of internal state.

### What Could Be Improved

1. **Persistence layer** — Tasks live in memory and are lost on restart. In a real Sprint 3, replacing the `Map` with a file-based or SQLite store would be the highest-value improvement.

2. **Authentication** — The API has no auth. Adding JWT middleware would be necessary before any real deployment.

3. **Contract/API testing** — The integration tests test behaviour at the HTTP level but don't enforce an API schema. Adding OpenAPI spec validation (e.g., with `express-openapi-validator`) would catch breaking API changes.

### Key Lessons Learned

- **Agile's real value is the feedback loop, not the ceremonies.** The retrospective improvement of adding integration tests in Sprint 2 directly improved coverage from 36% to 98.6%. Without that structured reflection, the gap would have persisted.

- **Definition of Done prevents scope creep.** Having the DoD written down before starting meant there was no ambiguity about when US-01 was "really" done — it required a test, lint pass, and CI green, not just working code.

- **Commit discipline is a DevOps practice.** Atomic, descriptive commits aren't just aesthetics — they make `git log`, PR review, and incident investigation dramatically easier. The habit of committing per-story rather than per-session was the most valuable technical discipline in this project.
