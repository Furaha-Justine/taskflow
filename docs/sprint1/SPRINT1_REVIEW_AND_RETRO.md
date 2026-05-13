# Sprint 1 Review

**Sprint Goal:** Deliver the core task lifecycle (add → list → complete) with a working CI pipeline and tests.  
**Sprint Duration:** Simulated — 1 week  
**Stories Planned:** US-01, US-02, US-03 (5 story points)  
**Stories Delivered:** US-01, US-02, US-03 ✅

---

## Demo: What Was Delivered

### US-01 — Add a Task ✅

**Acceptance Criteria Verification:**

| Criterion | Result |
|-----------|--------|
| Given a valid title, a task is created with unique ID, title, status=`open`, and timestamp | ✅ PASS |
| If the title is empty, an error is returned | ✅ PASS |

**Evidence — Test output:**
```
✓ creates a task with correct shape
✓ assigns a unique ID to each task
✓ trims whitespace from title
✓ throws when title is empty string
✓ throws when title is only whitespace
✓ throws when title is not a string
```

**HTTP Demonstration:**
```bash
# POST /tasks
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Write sprint review"}'

# Response (201 Created):
{
  "id": "fa4ead07-412c-4745-a6bf-81b695fe8b38",
  "title": "Write sprint review",
  "status": "open",
  "createdAt": "2026-05-12T08:50:21.955Z",
  "completedAt": null
}
```

---

### US-02 — List Tasks ✅

**Acceptance Criteria Verification:**

| Criterion | Result |
|-----------|--------|
| Tasks are returned sorted by creation date | ✅ PASS |
| If no tasks exist, empty array is returned (not an error) | ✅ PASS |

**HTTP Demonstration:**
```bash
curl http://localhost:3000/tasks

# Response (200 OK):
[
  {
    "id": "fa4ead07-...",
    "title": "Write sprint review",
    "status": "open",
    "createdAt": "2026-05-12T08:50:21.955Z"
  }
]
```

---

### US-03 — Complete a Task ✅

**Acceptance Criteria Verification:**

| Criterion | Result |
|-----------|--------|
| Task status changes to `done` and `completedAt` is set | ✅ PASS |
| If the ID does not exist, an error is returned | ✅ PASS |

**HTTP Demonstration:**
```bash
curl -X PATCH http://localhost:3000/tasks/fa4ead07-.../complete

# Response (200 OK):
{
  "id": "fa4ead07-...",
  "title": "Write sprint review",
  "status": "done",
  "completedAt": "2026-05-12T09:15:00.000Z"
}
```

---

## CI Pipeline Evidence

**Pipeline File:** `.github/workflows/main.yml`  
**Status:** ✅ Passing on Node 18.x and 20.x

**Pipeline stages:**
1. Checkout code
2. Set up Node.js (matrix: 18.x, 20.x)
3. `npm ci` — install dependencies
4. `npm run lint` — ESLint check
5. `npm run test:ci` — Jest with coverage
6. Upload coverage artifact

**Test Results:**
```
Test Suites: 1 passed
Tests:       17 passed, 0 failed
Coverage:    96% on taskStore.js
```

---

## Velocity

| Story | Points | Status |
|-------|--------|--------|
| US-01 | 2 | ✅ Done |
| US-02 | 1 | ✅ Done |
| US-03 | 2 | ✅ Done |
| **Total** | **5** | **5/5 delivered** |

---

## Sprint 1 Retrospective

### What Went Well
1. **Incremental commits** — Each feature was committed separately with clear messages (`feat(US-01)`, `test(US-01)`), making the history readable and the intent clear.
2. **TDD approach** — Writing tests immediately after each feature caught an edge case (whitespace-only titles) that would have been missed otherwise.
3. **CI pipeline** — Catching linting issues early kept code clean throughout the sprint.

### What Could Be Improved

**Improvement 1 — Test coverage enforcement was too lenient**  
The 80% line coverage threshold was nearly missed because `server.js` and `logger.js` had 0% coverage in Sprint 1. In Sprint 2, integration tests will be added from the start to cover the HTTP layer, and the CI pipeline will fail fast if coverage drops.

**Improvement 2 — Missing input validation module**  
Validation logic (empty string check, status filter check) is embedded directly in `taskStore.js`. This makes it hard to reuse and test in isolation. In Sprint 2, validation will be extracted into a dedicated `validators.js` module, improving cohesion and testability.

### Actions for Sprint 2
- [ ] Add integration tests (`tests/server.test.js`) covering all HTTP endpoints
- [ ] Extract validation logic into `src/validators.js`
- [ ] Add coverage upload step to CI so reports are visible in GitHub Actions artifacts
